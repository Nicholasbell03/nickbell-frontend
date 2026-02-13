import { useCallback, useRef, useState } from "react";
import { chatApi } from "@/services/api";
import type { ChatMessage } from "@/types/chat";

const CONVERSATION_ID_KEY = "chat_conversation_id";

export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

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
		const userMessage: ChatMessage = { role: "user", content: text };
		setMessages((prev) => [...prev, userMessage]);
		setIsStreaming(true);
		setError(null);

		const abortController = new AbortController();
		abortControllerRef.current = abortController;

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
						if (event.type === "text_delta" && event.delta) {
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
						}
					} catch {
						// Skip unparseable lines
					}
				}
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") {
				// User cancelled — not an error
			} else {
				setError("Something went wrong. Please try again.");
			}
		} finally {
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
