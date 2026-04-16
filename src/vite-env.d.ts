/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_DEV_API_PROXY?: string;
  /** URL completa del endpoint OAuth de Google (anula path y base). */
  readonly VITE_GOOGLE_AUTH_URL?: string;
  /** Ruta en el back, p. ej. `/oauth2/authorization/google` (por defecto). */
  readonly VITE_GOOGLE_OAUTH_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
