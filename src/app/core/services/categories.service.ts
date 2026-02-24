import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../constants/api.constants';
import type {
  ApiResponse,
  Category,
  CategoryDto,
  PaginatedData,
  PaginationParams,
} from '../../types';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly url = `${BASE_URL}/categories`;

  constructor(private readonly http: HttpClient) {}

  /** GET /api/categories/paged */
  getPaged(params?: PaginationParams): Observable<ApiResponse<PaginatedData<Category>>> {
    let httpParams = new HttpParams();
    if (params?.pageSize != null) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.pageNumber != null) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.search != null && params.search !== '') httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiResponse<PaginatedData<Category>>>(`${this.url}/paged`, { params: httpParams });
  }

  /** GET /api/categories/{id} */
  getById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.url}/${id}`);
  }

  /** POST /api/categories */
  create(dto: CategoryDto): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.url, dto);
  }

  /** PUT /api/categories/{id} */
  update(id: string, dto: CategoryDto): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.url}/${id}`, dto);
  }

  /** DELETE /api/categories/{id} (soft delete) */
  delete(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }
}
