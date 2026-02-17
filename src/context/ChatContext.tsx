import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import { useChat } from "@/hooks/useChat";

interface ChatContextValue {
	// Chat state & actions from useChat
	messages: ReturnType<typeof useChat>["messages"];
	isStreaming: ReturnType<typeof useChat>["isStreaming"];
	error: ReturnType<typeof useChat>["error"];
	sendMessage: ReturnType<typeof useChat>["sendMessage"];
	stopStreaming: ReturnType<typeof useChat>["stopStreaming"];
	clearChat: ReturnType<typeof useChat>["clearChat"];
	// Panel UI state
	isPanelOpen: boolean;
	openPanel: () => void;
	closePanel: () => void;
	togglePanel: () => void;
	// Hero input visibility (for widget logic)
	heroInputVisible: boolean;
	setHeroInputVisible: (visible: boolean) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
	const chat = useChat();
	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [heroInputVisible, setHeroInputVisible] = useState(false);

	const openPanel = useCallback(() => setIsPanelOpen(true), []);
	const closePanel = useCallback(() => setIsPanelOpen(false), []);
	const togglePanel = useCallback(() => setIsPanelOpen((prev) => !prev), []);

	return (
		<ChatContext.Provider
			value={{
				...chat,
				isPanelOpen,
				openPanel,
				closePanel,
				togglePanel,
				heroInputVisible,
				setHeroInputVisible,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChatContext(): ChatContextValue {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
}
