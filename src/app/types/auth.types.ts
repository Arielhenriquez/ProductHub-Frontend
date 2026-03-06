/**
 * Auth API request/response types (JWT, ASP.NET Core).
 */

export interface RegisterDto {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

/** User as returned after login (user.name may be "firstName lastName"). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

/** User as returned by GET /users and GET /users/:id */
export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: 'Admin' | 'User';
  isActive: boolean;
  createdDate: string;
}

/** DTO for PUT /api/Users/{id} – unified update (FirstName, LastName, Email, Role?, IsActive?). */
export interface UpdateUserDto {
  firstName: string;
  lastName?: string | null;
  email: string;
  role?: 'Admin' | 'User';
  isActive?: boolean;
}

export interface RegisterResponse {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  role: 'Admin' | 'User';
  createdDate: string;
}

/** API error body (400, 404, etc.) */
export interface ApiErrorBody {
  error?: string;
  message?: string;
}
