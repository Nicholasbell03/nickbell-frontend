import { atom } from 'nanostores';

/** Whether the chat panel slide-out is open. */
export const $isPanelOpen = atom(false);

/**
 * Whether the hero chat input is visible in the viewport.
 * Defaults true to match SSR output (widget hidden); ChatIsland corrects it
 * on mount for non-home pages, where HeroChat never mounts to manage it.
 */
export const $heroInputVisible = atom(true);

/** Whether a chat response is currently streaming. */
export const $isStreaming = atom(false);

/** Whether an existing conversation has messages. */
export const $hasExistingConversation = atom(false);

/**
 * Action bridge — ChatIsland registers its methods on mount.
 * Other islands (HeroChat) call these to interact with chat.
 */
export const $chatActions = atom<{
  sendMessage: (text: string) => void;
  openPanel: () => void;
  closePanel: () => void;
  clearChat: () => void;
} | null>(null);
