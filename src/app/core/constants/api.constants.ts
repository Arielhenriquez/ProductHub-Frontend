/**
 * ProductHub API configuration (ASP.NET Core REST API, JWT).
 * Token and user are stored in localStorage.
 *
 * Set useLocalApi to true for local development, false for production.
 */
const useLocalApi = false;

const localApiUrl = 'https://localhost:7133/api';
const productionApiUrl = 'https://producthub-api.wittysea-8d0d5478.eastus.azurecontainerapps.io/api';

export const BASE_URL = useLocalApi ? localApiUrl : productionApiUrl;

export const API_CONFIG = {
  localApiUrl,
  productionApiUrl,
  get BASE_URL(): string {
    return BASE_URL;
  },
} as const;

export const AUTH_STORAGE_KEY = 'producthub_accessToken';
export const USER_STORAGE_KEY = 'producthub_user';
export const SELLER_WHATSAPP = '+18094367341';

/** Parse 400 error body: "msg1 | msg2 | msg3" → ["msg1","msg2","msg3"] */
export function parseValidationErrors(body: { error?: string } | null): string[] {
  const msg = body?.error?.trim();
  if (!msg) return [];
  return msg.split(/\s*\|\s*/).filter(Boolean);
}
