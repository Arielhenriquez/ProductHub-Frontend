/**
 * ProductHub API configuration (ASP.NET Core REST API, JWT).
 * Token and user are stored in localStorage.
 */
const PORT = 7133;
const USE_HTTPS = true;

export const API_CONFIG = {
  PORT,
  USE_HTTPS,
  get BASE_URL(): string {
    return `${USE_HTTPS ? 'https' : 'http'}://localhost:${this.PORT}/api`;
  },
} as const;

/** Base URL for ProductHub API. */
export const BASE_URL = `${USE_HTTPS ? 'https' : 'http'}://localhost:${PORT}/api`;

export const AUTH_STORAGE_KEY = 'producthub_accessToken';
export const USER_STORAGE_KEY = 'producthub_user';

/** Parse 400 error body: "msg1 | msg2 | msg3" → ["msg1","msg2","msg3"] */
export function parseValidationErrors(body: { error?: string } | null): string[] {
  const msg = body?.error?.trim();
  if (!msg) return [];
  return msg.split(/\s*\|\s*/).filter(Boolean);
}
