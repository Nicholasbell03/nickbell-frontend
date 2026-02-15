import Markdown from "react-markdown";
import { ContentReferenceCard } from "@/components/ContentReferenceCard";
import { useStreamedText } from "@/hooks/useStreamedText";
import type { ContentReference } from "@/types/chat";

const MAX_REFERENCES = 4;

interface ChatMessageProps {
	role: "user" | "assistant";
	content: string;
	isStreaming?: boolean;
	references?: ContentReference[];
}

export const ChatMessage = ({
	role,
	content,
	isStreaming,
	references,
}: ChatMessageProps) => {
	const isUser = role === "user";
	const displayedContent = useStreamedText(content, !!isStreaming && !isUser);
	const isBufferDrained = displayedContent.length >= content.length;
	const showReferences =
		!isUser && !isStreaming && isBufferDrained && references && references.length > 0;

	return (
		<div
			className={`flex mb-4 animate-fade-in ${isUser ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`max-w-[85%] overflow-hidden ${isUser ? "items-end" : "items-start"} flex flex-col`}
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
							<Markdown>{displayedContent}</Markdown>
							{(isStreaming ||
								displayedContent.length < content.length) && (
								<span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-text-bottom" />
							)}
						</div>
					)}
				</div>

				{showReferences && (
					<div className="mt-3 w-full space-y-2 animate-fade-in">
						<p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
							Relevant to your query
						</p>
						<div className="grid gap-2">
							{references.slice(0, MAX_REFERENCES).map((ref) => (
								<ContentReferenceCard
									key={`${ref.type}:${ref.slug}`}
									reference={ref}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
