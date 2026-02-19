import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "@/services/api";
import type { ChatMessage, ContentReference } from "@/types/chat";

const CONVERSATION_ID_KEY = "chat_conversation_id";
const MESSAGES_KEY = "chat_messages";

function loadMessages(): ChatMessage[] {
	try {
		const stored = localStorage.getItem(MESSAGES_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed)) {
				return parsed.map((m: ChatMessage) => ({
					...m,
					id: m.id ?? crypto.randomUUID(),
				}));
			}
		}
	} catch {
		// localStorage unavailable or corrupt
	}
	return [];
}

function saveMessages(messages: ChatMessage[]): void {
	try {
		localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
	} catch {
		// localStorage unavailable
	}
}

function clearStoredMessages(): void {
	try {
		localStorage.removeItem(MESSAGES_KEY);
	} catch {
		// localStorage unavailable
	}
}

interface ToolResultEvent {
	type: "tool_result";
	tool_name: string;
	result: unknown;
	successful: boolean;
}

function parseToolResultToReferences(
	toolName: string,
	result: unknown,
): ContentReference[] {
	const refs: ContentReference[] = [];

	switch (toolName) {
		case "GetBlogs": {
			const blogs = result as Array<{
				title: string;
				slug: string;
				excerpt?: string | null;
				featured_image?: string | null;
				read_time?: number;
			}>;
			for (const b of blogs) {
				refs.push({
					type: "blog",
					slug: b.slug,
					title: b.title,
					description: b.excerpt ?? null,
					image: b.featured_image ?? null,
					href: `/blog/${b.slug}`,
					meta: b.read_time ? { read_time: b.read_time } : undefined,
				});
			}
			break;
		}
		case "GetBlogDetail": {
			const b = result as {
				title: string;
				slug: string;
				excerpt?: string | null;
				featured_image?: string | null;
				read_time?: number;
			};
			refs.push({
				type: "blog",
				slug: b.slug,
				title: b.title,
				description: b.excerpt ?? null,
				image: b.featured_image ?? null,
				href: `/blog/${b.slug}`,
				meta: b.read_time ? { read_time: b.read_time } : undefined,
			});
			break;
		}
		case "GetProjects": {
			const projects = result as Array<{
				title: string;
				slug: string;
				description?: string | null;
				featured_image?: string | null;
				technologies?: string[];
			}>;
			for (const p of projects) {
				refs.push({
					type: "project",
					slug: p.slug,
					title: p.title,
					description: p.description ?? null,
					image: p.featured_image ?? null,
					href: `/projects/${p.slug}`,
					meta: p.technologies?.length
						? { technologies: p.technologies }
						: undefined,
				});
			}
			break;
		}
		case "GetProjectDetail": {
			const p = result as {
				title: string;
				slug: string;
				description?: string | null;
				featured_image?: string | null;
				technologies?: string[];
			};
			refs.push({
				type: "project",
				slug: p.slug,
				title: p.title,
				description: p.description ?? null,
				image: p.featured_image ?? null,
				href: `/projects/${p.slug}`,
				meta: p.technologies?.length
					? { technologies: p.technologies }
					: undefined,
			});
			break;
		}
		case "GetShares": {
			const shares = result as Array<{
				title?: string | null;
				slug: string;
				description?: string | null;
				image_url?: string | null;
				source_type?: string;
			}>;
			for (const s of shares) {
				if (!s.title) continue;
				refs.push({
					type: "share",
					slug: s.slug,
					title: s.title,
					description: s.description ?? null,
					image: s.image_url ?? null,
					href: `/shares/${s.slug}`,
					meta: s.source_type ? { source_type: s.source_type } : undefined,
				});
			}
			break;
		}
		case "SearchContent": {
			const data = result as {
				blogs?: Array<{
					title: string;
					slug: string;
					excerpt?: string | null;
					featured_image?: string | null;
					read_time?: number;
				}>;
				projects?: Array<{
					title: string;
					slug: string;
					description?: string | null;
					featured_image?: string | null;
					technologies?: string[];
				}>;
				shares?: Array<{
					title?: string | null;
					slug: string;
					description?: string | null;
					image_url?: string | null;
					source_type?: string;
				}>;
			};
			if (data.blogs) {
				refs.push(
					...parseToolResultToReferences("GetBlogs", data.blogs),
				);
			}
			if (data.projects) {
				refs.push(
					...parseToolResultToReferences("GetProjects", data.projects),
				);
			}
			if (data.shares) {
				refs.push(
					...parseToolResultToReferences("GetShares", data.shares),
				);
			}
			break;
		}
		// GetCVDetail returns plain text — not linkable, skip
	}

	return refs;
}

function deduplicateReferences(refs: ContentReference[]): ContentReference[] {
	const seen = new Set<string>();
	return refs.filter((ref) => {
		const key = `${ref.type}:${ref.slug}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const prevStreamingRef = useRef(false);

	// Persist messages when streaming finishes (true → false transition)
	useEffect(() => {
		if (prevStreamingRef.current && !isStreaming) {
			saveMessages(messages);
		}
		prevStreamingRef.current = isStreaming;
	}, [isStreaming, messages]);

	const getConversationId = (): string | null => {
		try {
			return localStorage.getItem(CONVERSATION_ID_KEY);
		} catch {
			return null;
		}
	};

	const setConversationId = (id: string): void => {
		try {
			localStorage.setItem(CONVERSATION_ID_KEY, id);
		} catch {
			// localStorage unavailable
		}
	};

	const clearConversationId = (): void => {
		try {
			localStorage.removeItem(CONVERSATION_ID_KEY);
		} catch {
			// localStorage unavailable
		}
	};

	const sendMessage = useCallback(async (text: string) => {
		const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
		setMessages((prev) => {
			const updated = [...prev, userMessage];
			saveMessages(updated);
			return updated;
		});
		setIsStreaming(true);
		setError(null);

		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		const timeoutId = setTimeout(() => {
			abortControllerRef.current = null;
			abortController.abort();
		}, 30000);

		try {
			const response = await chatApi.streamChat(
				text,
				getConversationId(),
				abortController.signal,
			);

			if (response.status === 429) {
				setError(
					"You're sending messages too quickly. Please wait a moment and try again.",
				);
				setIsStreaming(false);
				return;
			}

			if (!response.ok) {
				setError("Something went wrong. Please try again.");
				setIsStreaming(false);
				return;
			}

			const conversationId = response.headers.get("X-Conversation-Id");
			if (conversationId) {
				setConversationId(conversationId);
			}

			const assistantMessage: ChatMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: "",
			};
			setMessages((prev) => [...prev, assistantMessage]);

			const reader = response.body?.getReader();
			if (!reader) {
				setError("Failed to read response stream.");
				setIsStreaming(false);
				return;
			}

			const decoder = new TextDecoder();
			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;
					const data = line.slice(6).trim();
					if (data === "[DONE]") continue;

					try {
						const event = JSON.parse(data);
						if (event.type === "error" && event.message) {
							setError(event.message);
							setMessages((prev) => {
								const updated = [...prev];
								const last = updated[updated.length - 1];
								if (
									last?.role === "assistant" &&
									last.content === ""
								) {
									updated.pop();
								}
								return updated;
							});
							break;
						} else if (event.type === "text_delta" && event.delta) {
							setMessages((prev) => {
								const updated = [...prev];
								const last = updated[updated.length - 1];
								if (last?.role === "assistant") {
									updated[updated.length - 1] = {
										...last,
										content: last.content + event.delta,
									};
								}
								return updated;
							});
						} else if (event.type === "tool_result") {
							const toolEvent = event as ToolResultEvent;
							if (!toolEvent.successful) continue;

							let result = toolEvent.result;
							if (typeof result === "string") {
								try {
									result = JSON.parse(result);
								} catch {
									continue;
								}
							}

							const newRefs = parseToolResultToReferences(
								toolEvent.tool_name,
								result,
							);
							if (newRefs.length === 0) continue;

							setMessages((prev) => {
								const updated = [...prev];
								const last = updated[updated.length - 1];
								if (last?.role === "assistant") {
									const existing = last.references ?? [];
									updated[updated.length - 1] = {
										...last,
										references: deduplicateReferences([
											...existing,
											...newRefs,
										]),
									};
								}
								return updated;
							});
						}
					} catch {
						// Skip unparseable lines
					}
				}
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") {
				if (!abortControllerRef.current) {
					// Timeout — controller was cleared
					setError(
						"The request timed out. Please try again.",
					);
				}
				// Otherwise user cancelled — not an error
			} else {
				setError("Something went wrong. Please try again.");
			}
		} finally {
			clearTimeout(timeoutId);
			setIsStreaming(false);
			abortControllerRef.current = null;
		}
	}, []);

	const stopStreaming = useCallback(() => {
		abortControllerRef.current?.abort();
	}, []);

	const clearChat = useCallback(() => {
		setMessages([]);
		setError(null);
		clearConversationId();
		clearStoredMessages();
	}, []);

	return {
		messages,
		isStreaming,
		error,
		sendMessage,
		stopStreaming,
		clearChat,
	};
}
