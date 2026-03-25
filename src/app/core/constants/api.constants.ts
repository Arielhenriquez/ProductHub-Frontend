/**
 * ProductHub API configuration (ASP.NET Core REST API, JWT).
 * Token and user are stored in localStorage.
 */
export const BASE_URL = 'https://producthub-api.wittysea-8d0d5478.eastus.azurecontainerapps.io/api';

export const API_CONFIG = {
  get BASE_URL(): string {
    return BASE_URL;
  },
} as const;

export const AUTH_STORAGE_KEY = 'producthub_accessToken';
export const USER_STORAGE_KEY = 'producthub_user';

/** Parse 400 error body: "msg1 | msg2 | msg3" → ["msg1","msg2","msg3"] */
export function parseValidationErrors(body: { error?: string } | null): string[] {
  const msg = body?.error?.trim();
  if (!msg) return [];
  return msg.split(/\s*\|\s*/).filter(Boolean);
}
