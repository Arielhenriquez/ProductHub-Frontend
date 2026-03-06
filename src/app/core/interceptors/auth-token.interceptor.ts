import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_STORAGE_KEY } from '../constants/api.constants';

/** Adds Bearer token from localStorage to every request. */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};
