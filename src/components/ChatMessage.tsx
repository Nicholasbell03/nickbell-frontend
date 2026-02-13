import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";
import Markdown from "react-markdown";

interface ChatMessageProps {
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
}

export const ChatMessage = ({
	role,
	content,
	isStreaming,
}: ChatMessageProps) => {
	const isUser = role === "user";

	return (
		<div
			className={`flex gap-4 mb-6 animate-fade-in ${isUser ? "flex-row-reverse" : "flex-row"}`}
		>
			<Avatar
				className={`h-10 w-10 flex-shrink-0 ${isUser ? "ring-2 ring-emerald-500/30" : "ring-2 ring-teal-500/30"}`}
			>
				<AvatarFallback
					className={`${isUser ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-slate-700 to-slate-600"} text-white text-sm font-semibold`}
				>
					{isUser ? "U" : <Bot className="h-5 w-5" />}
				</AvatarFallback>
			</Avatar>

			<div
				className={`flex-1 max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}
			>
				<div
					className={`rounded-2xl px-5 py-3 backdrop-blur-sm ${
						isUser
							? "bg-gradient-to-br from-emerald-600/90 to-teal-600/90 text-white ml-auto"
							: "bg-slate-800/90 text-slate-200 border border-slate-700/50"
					}`}
				>
					{isUser ? (
						<p className="text-sm leading-relaxed whitespace-pre-wrap">
							{content}
						</p>
					) : (
						<div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline">
							<Markdown>{content}</Markdown>
							{isStreaming && (
								<span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-text-bottom" />
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
