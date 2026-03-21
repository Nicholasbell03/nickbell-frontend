/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Server-side only: Backend API URL */
  readonly API_URL: string;
  /** Client-side: Backend API URL (exposed to browser) */
  readonly PUBLIC_API_URL: string;
  /** Client-side: Cloudflare analytics token */
  readonly PUBLIC_CF_ANALYTICS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
