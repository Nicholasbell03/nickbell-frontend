/**
 * Cloudflare Turnstile bot protection for the AI chat.
 *
 * The chat endpoint costs real money per request (paid LLM), so every
 * message must carry a fresh, single-use Turnstile token in the
 * `X-Turnstile-Token` header, which the backend verifies with Siteverify.
 *
 * - Disabled entirely when PUBLIC_TURNSTILE_SITE_KEY is unset (local dev):
 *   no script, no widget, no header.
 * - The script loads lazily on first chat interaction, not on page load.
 * - One widget is rendered with `execution: 'execute'` +
 *   `appearance: 'interaction-only'`, so it stays invisible unless Cloudflare
 *   decides a visitor must solve an interactive challenge.
 * - Each message resets and re-executes the widget for a new token.
 */

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Max wait for script load + non-interactive challenge. */
const TOKEN_TIMEOUT_MS = 10_000;

/** Extended wait once a visitor is shown an interactive challenge to solve. */
const INTERACTIVE_TIMEOUT_MS = 120_000;

const LOAD_FAILED_MESSAGE =
  "We couldn't load the security check needed to use the chat. If you use a content or script blocker, please allow challenges.cloudflare.com and try again.";
const VERIFICATION_FAILED_MESSAGE =
  "We couldn't verify your browser. Please refresh the page and try again.";
const TIMEOUT_MESSAGE =
  'The security check took too long to complete. Please try again.';

interface TurnstileRenderOptions {
  sitekey: string;
  execution?: 'render' | 'execute';
  appearance?: 'always' | 'execute' | 'interaction-only';
  size?: 'normal' | 'flexible' | 'compact';
  theme?: 'auto' | 'light' | 'dark';
  retry?: 'auto' | 'never';
  'refresh-expired'?: 'auto' | 'manual' | 'never';
  'response-field'?: boolean;
  callback?: (token: string) => void;
  'error-callback'?: (errorCode: string) => boolean | void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  'before-interactive-callback'?: () => void;
}

interface TurnstileApi {
  render(container: HTMLElement | string, options: TurnstileRenderOptions): string | undefined;
  execute(container: HTMLElement | string): void;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** A Turnstile failure whose message is safe to show to the visitor. */
export class TurnstileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TurnstileError';
  }
}

interface Widget {
  api: TurnstileApi;
  id: string;
  container: HTMLDivElement;
  executed: boolean;
}

interface PendingRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
  onInteractive: () => void;
}

const siteKey = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();

let scriptPromise: Promise<TurnstileApi> | null = null;
let widget: Widget | null = null;
let pending: PendingRequest | null = null;

/** Whether Turnstile is configured for this build. */
export function isTurnstileEnabled(): boolean {
  return siteKey !== '';
}

function loadScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  const script = document.createElement('script');
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error('Turnstile script loaded without an API'));
    };
    script.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    // Allow a later attempt (e.g. a blocker was disabled) to retry the load.
    scriptPromise = null;
    script.remove();
    throw error;
  });

  return scriptPromise;
}

function hideWidget(container: HTMLElement): void {
  // visibility (not display: none) keeps the iframe laid out and working.
  container.style.visibility = 'hidden';
}

/**
 * Return the rendered widget, (re)creating it if needed. Astro's view
 * transitions replace <body>, which detaches the container on navigation,
 * so a disconnected container means the widget must be rendered again.
 */
function getWidget(api: TurnstileApi): Widget {
  if (widget?.container.isConnected) return widget;

  if (widget) {
    try {
      api.remove(widget.id);
    } catch {
      // Widget already gone along with its DOM
    }
    widget = null;
  }

  const container = document.createElement('div');
  container.dataset.turnstile = 'chat';
  // Above the chat panel (z-50) so an interactive challenge is reachable.
  Object.assign(container.style, {
    position: 'fixed',
    left: '50%',
    bottom: '6rem',
    transform: 'translateX(-50%)',
    zIndex: '60',
  });
  document.body.appendChild(container);

  const id = api.render(container, {
    sitekey: siteKey,
    execution: 'execute',
    appearance: 'interaction-only',
    theme: 'dark',
    retry: 'never',
    'refresh-expired': 'manual',
    'response-field': false,
    callback: (token) => {
      hideWidget(container);
      pending?.resolve(token);
    },
    'error-callback': () => {
      pending?.reject(new TurnstileError(VERIFICATION_FAILED_MESSAGE));
      // Returning true marks the error as handled by us.
      return true;
    },
    'timeout-callback': () => {
      pending?.reject(new TurnstileError(TIMEOUT_MESSAGE));
    },
    'before-interactive-callback': () => {
      pending?.onInteractive();
    },
  });

  if (!id) {
    container.remove();
    throw new Error('Turnstile widget failed to render');
  }

  widget = { api, id, container, executed: false };
  return widget;
}

/**
 * Warm up Turnstile (load the script and render the idle widget) so the
 * first message doesn't pay the full cost. Call on first chat interaction.
 * Safe to call repeatedly; a no-op when Turnstile is disabled.
 */
export function preloadTurnstile(): void {
  if (!isTurnstileEnabled() || typeof window === 'undefined') return;
  loadScript()
    .then(getWidget)
    .catch(() => {
      // Surfaced (with a friendly message) when a token is actually requested.
    });
}

/**
 * Obtain a fresh single-use Turnstile token for one chat message.
 *
 * Resolves to null when Turnstile is disabled. Rejects with a TurnstileError
 * (user-facing message) if the script is blocked, the challenge fails or it
 * times out, and with an AbortError DOMException if `signal` aborts.
 */
export function getTurnstileToken(signal?: AbortSignal): Promise<string | null> {
  if (!isTurnstileEnabled()) return Promise.resolve(null);

  // Only one token request can be in flight on the single widget.
  pending?.reject(new TurnstileError(VERIFICATION_FAILED_MESSAGE));

  return new Promise<string>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>;

    const settle = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      if (pending === request) pending = null;
    };

    const request: PendingRequest = {
      resolve: (token) => {
        settle();
        resolve(token);
      },
      reject: (error) => {
        settle();
        reject(error);
      },
      onInteractive: () => {
        // A human now needs time to solve the challenge — don't cut them off.
        clearTimeout(timer);
        timer = setTimeout(onTimeout, INTERACTIVE_TIMEOUT_MS);
      },
    };

    function onTimeout() {
      request.reject(new TurnstileError(TIMEOUT_MESSAGE));
    }

    function onAbort() {
      request.reject(new DOMException('Aborted', 'AbortError'));
    }

    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    pending = request;
    timer = setTimeout(onTimeout, TOKEN_TIMEOUT_MS);
    signal?.addEventListener('abort', onAbort, { once: true });

    loadScript()
      .then((api) => {
        if (pending !== request) return; // Already timed out or aborted

        const current = getWidget(api);
        // Tokens are single-use: clear the previous one before re-executing.
        if (current.executed) api.reset(current.id);
        current.executed = true;
        current.container.style.visibility = 'visible';
        api.execute(current.container);
      })
      .catch(() => {
        request.reject(new TurnstileError(LOAD_FAILED_MESSAGE));
      });
  });
}
