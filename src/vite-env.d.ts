/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** genia_server's API root, from .env.development / .env.production. */
  readonly VITE_API_BASE_URL: string
  /** Optional: the AI panel (tools/ai-panel), linked from the admin top bar. */
  readonly VITE_AI_PANEL_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
