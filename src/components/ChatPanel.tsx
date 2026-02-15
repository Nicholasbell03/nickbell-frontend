import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, Plus, X, Search, Square } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { ChatMessage } from "@/components/ChatMessage";

export function ChatPanel() {
	const {
		messages,
		isStreaming,
		error,
		sendMessage,
		stopStreaming,
		clearChat,
		isPanelOpen,
		closePanel,
	} = useChatContext();

	const [query, setQuery] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Focus input when panel opens
	useEffect(() => {
		if (isPanelOpen) {
			const timer = setTimeout(() => inputRef.current?.focus(), 300);
			return () => clearTimeout(timer);
		}
	}, [isPanelOpen]);

	// Escape to close
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isPanelOpen) {
				closePanel();
			}
		};
		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isPanelOpen, closePanel]);

	// Lock body scroll when open
	useEffect(() => {
		if (isPanelOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isPanelOpen]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!query.trim() || isStreaming) return;
			sendMessage(query.trim());
			setQuery("");
		},
		[query, isStreaming, sendMessage],
	);

	const handleNewChat = useCallback(() => {
		clearChat();
		setQuery("");
		inputRef.current?.focus();
	}, [clearChat]);

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
					isPanelOpen
						? "opacity-100"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={closePanel}
				aria-hidden="true"
			/>

			{/* Panel */}
			<div
				className={`fixed top-0 right-0 z-50 h-full w-full sm:w-3/5 max-w-[700px] flex flex-col bg-slate-950 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out ${
					isPanelOpen ? "translate-x-0" : "translate-x-full"
				}`}
				role="dialog"
				aria-label="Chat panel"
				aria-hidden={!isPanelOpen}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
							<MessageSquare className="h-4 w-4 text-white" />
						</div>
						<h2 className="text-base font-semibold text-slate-200">
							Nick.AI
						</h2>
					</div>
					<div className="flex items-center gap-2">
						{messages.length > 0 && (
							<button
								onClick={handleNewChat}
								className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/50 transition-colors"
								aria-label="New chat"
							>
								<Plus className="h-3.5 w-3.5" />
								New chat
							</button>
						)}
						<button
							onClick={closePanel}
							className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
							aria-label="Close chat"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
					{messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center px-6">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800/80 border border-slate-700/50 mb-4">
								<MessageSquare className="h-8 w-8 text-emerald-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-200 mb-2">
								Ask me anything about Nick
							</h3>
							<p className="text-sm text-slate-400 max-w-[280px]">
								I can tell you about his projects, blog posts,
								experience, and more.
							</p>
						</div>
					) : (
						<>
							{messages.map((message, index) => (
								<ChatMessage
									key={index}
									role={message.role}
									content={message.content}
									references={message.references}
									isStreaming={
										isStreaming &&
										message.role === "assistant" &&
										index === messages.length - 1
									}
								/>
							))}
							{isStreaming &&
								messages[messages.length - 1]?.role ===
									"user" && (
									<div className="flex gap-4 mb-6 animate-fade-in">
										<div className="flex items-center gap-1.5 pl-14">
											<div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
											<div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
											<div className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" />
										</div>
									</div>
								)}
							<div ref={messagesEndRef} />
						</>
					)}
				</div>

				{/* Error */}
				{error && (
					<div className="mx-4 mb-3 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-300 text-sm animate-fade-in">
						{error}
					</div>
				)}

				{/* Input */}
				<div className="px-4 pb-4 pt-2 border-t border-slate-800">
					<form onSubmit={handleSubmit}>
						<div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-700/50 focus-within:border-emerald-500/30 transition-colors">
							<Search className="absolute left-4 h-4 w-4 text-emerald-400" />
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Ask a question..."
								className="w-full py-3 pl-11 pr-12 bg-transparent text-slate-200 placeholder:text-slate-500 focus:outline-none text-sm"
								disabled={isStreaming}
							/>
							{isStreaming ? (
								<button
									type="button"
									onClick={stopStreaming}
									className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
									aria-label="Stop generating"
								>
									<Square className="h-3.5 w-3.5 fill-current" />
								</button>
							) : (
								query.trim() && (
									<button
										type="submit"
										className="absolute right-3 p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
										aria-label="Send message"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											className="h-4 w-4"
										>
											<path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
										</svg>
									</button>
								)
							)}
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
