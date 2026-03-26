import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { BASE_URL, AUTH_STORAGE_KEY, USER_STORAGE_KEY, parseValidationErrors } from '../constants/api.constants';
import type {
  AuthUser,
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  ResetPasswordDto,
  ResetPasswordResponse,
  ApiErrorBody,
} from '../../types/auth.types';

const AUTH_URL = `${BASE_URL}/Auth`;

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errors?: string[] };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUser$ = new BehaviorSubject<AuthUser | null>(this.loadStoredUser());

  readonly user$ = this.currentUser$.asObservable();

  constructor() {
    this.syncUserFromStorage();
  }

  private loadStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AuthUser;
    } catch {
      // ignore
    }
    return null;
  }

  private syncUserFromStorage(): void {
    const user = this.loadStoredUser();
    if (user !== this.currentUser$.value) this.currentUser$.next(user);
  }

  get currentUser(): AuthUser | null {
    return this.currentUser$.value;
  }

  get accessToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.accessToken && !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  /** POST /auth/register. On 201 redirect to /login. */
  register(dto: RegisterDto): Observable<AuthResult<RegisterResponse>> {
    return this.http.post<{ data?: RegisterResponse } & RegisterResponse>(`${AUTH_URL}/register`, dto).pipe(
      map((res) => ({ success: true as const, data: res.data ?? res })),
      catchError((err) => {
        const body = (err.error || {}) as ApiErrorBody;
        const errors = parseValidationErrors(body);
        const message = body.error ?? body.message ?? err.statusText ?? 'Error al registrar';
        return of({ success: false as const, error: message, errors: errors.length ? errors : undefined });
      })
    );
  }

  /** POST /auth/login. On success stores token/user and redirect to private home. */
  login(dto: LoginDto): Observable<AuthResult<LoginResponse>> {
    return this.http.post<{ data?: LoginResponse } & LoginResponse>(`${AUTH_URL}/login`, dto).pipe(
      tap((res) => {
        const data = res.data ?? res;
        if (data?.accessToken && data?.user) {
          localStorage.setItem(AUTH_STORAGE_KEY, data.accessToken);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
          this.currentUser$.next(data.user);
        }
      }),
      map((res) => {
        const data = res.data ?? res;
        return { success: true as const, data };
      }),
      catchError((err) => {
        const body = (err.error || {}) as ApiErrorBody;
        const errors = parseValidationErrors(body);
        const message = body.data?.message ?? body.error ?? body.message ?? err.statusText ?? 'Error al iniciar sesión';
        return of({ success: false as const, error: message, errors: errors.length ? errors : undefined });
      })
    );
  }

  /** POST /Auth/forgot-password. Requests a password reset email. */
  forgotPassword(dto: ForgotPasswordDto): Observable<AuthResult<ForgotPasswordResponse>> {
    return this.http.post<ForgotPasswordResponse>(`${AUTH_URL}/forgot-password`, dto).pipe(
      map((res) => ({ success: true as const, data: res })),
      catchError((err) => {
        const body = (err.error || {}) as ApiErrorBody;
        const errors = parseValidationErrors(body);
        const message = body.error ?? body.message ?? err.statusText ?? 'Error al enviar el enlace';
        return of({ success: false as const, error: message, errors: errors.length ? errors : undefined });
      })
    );
  }

  /** POST /Auth/reset-password. Resets the password using a token. */
  resetPassword(dto: ResetPasswordDto): Observable<AuthResult<ResetPasswordResponse>> {
    return this.http.post<ResetPasswordResponse>(`${AUTH_URL}/reset-password`, dto).pipe(
      map((res) => ({ success: true as const, data: res })),
      catchError((err) => {
        const body = (err.error || {}) as ApiErrorBody;
        const errors = parseValidationErrors(body);
        const message = body.error ?? body.message ?? err.statusText ?? 'Error al restablecer la contraseña';
        return of({ success: false as const, error: message, errors: errors.length ? errors : undefined });
      })
    );
  }

  /** Clear token and user from storage and state (no navigation). */
  clearSession(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.currentUser$.next(null);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /** Redirect after login to store home (dashboard at /). */
  navigateAfterLogin(): void {
    this.router.navigate(['/']);
  }
}
