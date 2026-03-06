import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../constants/api.constants';
import type { UserResponseDto, UpdateUserDto } from '../../types/auth.types';

const USERS_URL = `${BASE_URL}/Users`;

/** Paginated users response (GET /users). */
export interface UsersPageResponse {
  items: UserResponseDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  /** GET /api/Users?pageNumber=&pageSize=&search= (requires Admin). */
  getPagedUsers(pageNumber: number, pageSize: number, search?: string): Observable<{ data: UsersPageResponse }> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search?.trim()) params = params.set('search', search.trim());
    return this.http.get<{ data: UsersPageResponse }>(USERS_URL, { params });
  }

  /** GET /api/Users/:id (requires Admin). */
  getUserById(id: string): Observable<{ data: UserResponseDto }> {
    return this.http.get<{ data: UserResponseDto }>(`${USERS_URL}/${id}`);
  }

  /** PUT /api/Users/:id – unified update (FirstName, LastName, Email, Role?, IsActive?). */
  updateUser(id: string, dto: UpdateUserDto): Observable<{ data: UserResponseDto }> {
    const body = {
      firstName: dto.firstName.trim(),
      lastName: dto.lastName?.trim() || null,
      email: dto.email.trim(),
      ...(dto.role != null && { role: dto.role }),
      ...(dto.isActive != null && { isActive: dto.isActive }),
    };
    return this.http.put<{ data: UserResponseDto }>(`${USERS_URL}/${id}`, body);
  }

  /** DELETE /api/Users/:id (soft delete). */
  deleteUser(id: string): Observable<{ data: string }> {
    return this.http.delete<{ data: string }>(`${USERS_URL}/${id}`);
  }
}
