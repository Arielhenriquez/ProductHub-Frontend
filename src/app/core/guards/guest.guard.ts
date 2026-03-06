import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Decode JWT exp claim; return null if invalid. */
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

function isTokenValid(token: string): boolean {
  const exp = getJwtExp(token);
  if (exp == null) return true;
  return Math.floor(Date.now() / 1000) < exp - 60;
}

/**
 * Guest-only routes (login, register, forgot-password).
 * If user has valid token → redirect to home. If expired token → clear and allow.
 */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const token = auth.accessToken;

  if (!token) return true;

  if (!isTokenValid(token)) {
    auth.clearSession();
    return true;
  }

  if (auth.currentUser) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
