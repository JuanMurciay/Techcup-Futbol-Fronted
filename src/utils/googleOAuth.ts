/**
 * Redirección al flujo OAuth de Google gestionado por el backend (p. ej. Spring Security:
 * `/oauth2/authorization/google`).
 *
 * Configura el path con `VITE_GOOGLE_OAUTH_PATH` o la URL completa con `VITE_GOOGLE_AUTH_URL`.
 * En desarrollo sin `VITE_API_URL`, se usa el mismo origen del front y el proxy de Vite (`/oauth2` → back).
 */

export function getGoogleOAuthRedirectUrl(): string {
  const explicit = import.meta.env.VITE_GOOGLE_AUTH_URL?.trim();
  if (explicit) return explicit;

  const pathRaw = import.meta.env.VITE_GOOGLE_OAUTH_PATH?.trim() || '/oauth2/authorization/google';
  const path = pathRaw.startsWith('/') ? pathRaw : `/${pathRaw}`;

  const apiBase = import.meta.env.VITE_API_URL?.trim();
  if (apiBase) {
    return `${apiBase.replace(/\/$/, '')}${path}`;
  }

  if (import.meta.env.DEV) {
    return `${window.location.origin}${path}`;
  }

  return `https://localhost:8443${path}`;
}

export function redirectToGoogleLogin(): void {
  window.location.assign(getGoogleOAuthRedirectUrl());
}
