/**
 * Chat context — internal to the ChatIsland React tree.
 * Only ChatPanel and ChatWidget should import this.
 * Other islands must use Nano Stores ($chatActions) instead.
 */
import { createContext, useContext } from 'react';
import type { useChat } from '@/hooks/useChat';

export interface ChatContextValue {
  messages: ReturnType<typeof useChat>['messages'];
  isStreaming: ReturnType<typeof useChat>['isStreaming'];
  hasFirstToken: ReturnType<typeof useChat>['hasFirstToken'];
  error: ReturnType<typeof useChat>['error'];
  sendMessage: ReturnType<typeof useChat>['sendMessage'];
  stopStreaming: ReturnType<typeof useChat>['stopStreaming'];
  clearChat: ReturnType<typeof useChat>['clearChat'];
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  heroInputVisible: boolean;
  setHeroInputVisible: (visible: boolean) => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatIsland');
  }
  return context;
}
