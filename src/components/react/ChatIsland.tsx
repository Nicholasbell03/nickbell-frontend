import { useEffect, useCallback, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { $isPanelOpen, $heroInputVisible, $hasExistingConversation, $chatActions, $isStreaming } from '@/stores/chat';
import { useStore } from '@nanostores/react';
import { ChatContext } from './chatContext';
import { ChatPanel } from './ChatPanel';
import { ChatWidget } from './ChatWidget';

/**
 * Self-contained chat island. Wraps the full chat system (provider + panel + widget)
 * and syncs state to Nano Stores for cross-island communication with HeroChat.
 *
 * Placed in Layout.astro with client:load + transition:persist="chat"
 * so it persists across page navigations via View Transitions.
 */
export default function ChatIsland() {
  const chat = useChat();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const heroInputVisible = useStore($heroInputVisible);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  // $heroInputVisible defaults true (widget hidden) to match SSR output, but
  // only HeroChat on the homepage ever updates it. On a direct load of any
  // other page it would stay true forever, permanently hiding the widget.
  useEffect(() => {
    if (window.location.pathname !== '/') {
      $heroInputVisible.set(false);
    }
  }, []);

  // Sync panel state to Nano Store
  useEffect(() => {
    $isPanelOpen.set(isPanelOpen);
  }, [isPanelOpen]);

  // Sync streaming state to Nano Store so HeroChat can block concurrent sends
  useEffect(() => {
    $isStreaming.set(chat.isStreaming);
  }, [chat.isStreaming]);

  // Reset on unmount so an island removed mid-stream can't leave the store
  // stuck true, which would permanently disable HeroChat submits.
  useEffect(() => {
    return () => {
      $isStreaming.set(false);
    };
  }, []);

  // Sync conversation existence to Nano Store
  useEffect(() => {
    $hasExistingConversation.set(chat.messages.length > 0);
  }, [chat.messages.length]);

  // Register actions for other islands (HeroChat) to call
  useEffect(() => {
    $chatActions.set({
      sendMessage: chat.sendMessage,
      openPanel,
      closePanel,
      clearChat: chat.clearChat,
    });
    return () => { $chatActions.set(null); };
  }, [chat.sendMessage, chat.clearChat, openPanel, closePanel]);

  return (
    <ChatContext.Provider
      value={{
        ...chat,
        isPanelOpen,
        openPanel,
        closePanel,
        togglePanel: () => setIsPanelOpen(prev => !prev),
        heroInputVisible,
        setHeroInputVisible: (visible: boolean) => $heroInputVisible.set(visible),
      }}
    >
      <ChatPanel />
      <ChatWidget />
    </ChatContext.Provider>
  );
}
