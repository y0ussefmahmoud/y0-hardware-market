// ===== CSRF Client Helpers =====
// Read CSRF cookie and attach to authenticated API requests

export function getCsrfHeaders(): Record<string, string> {
  if (typeof document === 'undefined') return {};

  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]+)/);
  if (!match) return {};

  return { 'X-CSRF-Token': decodeURIComponent(match[1]) };
}

export function csrfFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const csrfHeaders = getCsrfHeaders();

  if (csrfHeaders['X-CSRF-Token']) {
    headers.set('X-CSRF-Token', csrfHeaders['X-CSRF-Token']);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: init.credentials ?? 'include',
  });
}
