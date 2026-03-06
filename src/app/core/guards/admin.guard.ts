import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protects admin routes: requires logged-in user with role Admin. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.accessToken || !auth.currentUser) {
    router.navigate(['/login']);
    return false;
  }
  if (auth.currentUser.role !== 'Admin') {
    router.navigate(['/forbidden']);
    return false;
  }
  return true;
};
