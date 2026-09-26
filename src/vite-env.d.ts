/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** genia_server's API root, from .env.development / .env.production. */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
