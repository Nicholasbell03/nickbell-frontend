import { MessageSquare } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";

export function ChatWidget() {
	const { messages, isPanelOpen, heroInputVisible, openPanel } =
		useChatContext();

	const isVisible = !heroInputVisible && !isPanelOpen;

	return (
		<button
			onClick={openPanel}
			className={`fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 ${
				isVisible
					? "opacity-100 scale-100"
					: "opacity-0 scale-75 pointer-events-none"
			}`}
			aria-label="Open chat"
			aria-hidden={!isVisible}
			tabIndex={isVisible ? 0 : -1}
		>
			<MessageSquare className="h-6 w-6" />
			{messages.length > 0 && (
				<span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-white border-2 border-emerald-500" />
			)}
		</button>
	);
}
