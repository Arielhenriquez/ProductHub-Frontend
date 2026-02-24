/**
 * ProductHub API configuration.
 * Set PORT to match your backend (e.g. 5000, 5001).
 */
const PORT = 7133;

export const API_CONFIG = {
  PORT,
  get BASE_URL(): string {
    return `https://localhost:${this.PORT}/api`;
  },
} as const;

/** Base URL for ProductHub API. Update API_CONFIG.PORT to match your backend. */
export const BASE_URL = `https://localhost:${PORT}/api`;
