import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_STORAGE_KEY } from '../constants/api.constants';
import { AuthService } from '../services/auth.service';

/** Decode JWT payload and return exp (expiration) in seconds, or null if invalid. */
function getJwtExp(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True if token exists and is not expired (with 60s buffer). */
function isTokenValid(token: string): boolean {
  const exp = getJwtExp(token);
  if (exp == null) return true; // no exp claim → assume valid
  return Math.floor(Date.now() / 1000) < exp - 60;
}

/**
 * ProtectedRoute: no token or expired JWT → clear storage and redirect to /login.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const token = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (!isTokenValid(token)) {
    auth.clearSession();
    router.navigate(['/login'], { queryParams: { expired: 'true' } });
    return false;
  }

  return true;
};
