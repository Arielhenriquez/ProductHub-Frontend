import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../constants/api.constants';
import type {
  ApiResponse,
  CreateProductDto,
  PaginatedData,
  PaginationParams,
  Product,
  ProductListItem,
  UpdateProductDto,
} from '../../types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly url = `${BASE_URL}/products`;

  constructor(private readonly http: HttpClient) {}

  /** GET /api/products (paginated list) */
  getPaged(params?: PaginationParams): Observable<ApiResponse<PaginatedData<ProductListItem>>> {
    let httpParams = new HttpParams();
    if (params?.pageSize != null) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params?.pageNumber != null) httpParams = httpParams.set('pageNumber', params.pageNumber);
    if (params?.search != null && params.search !== '') httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiResponse<PaginatedData<ProductListItem>>>(this.url, { params: httpParams });
  }

  /** GET /api/products/{id} (single product with images) */
  getById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.url}/${id}`);
  }

  /** POST /api/products - creates product and returns created product with id */
  createProduct(dto: CreateProductDto): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.url, dto);
  }

  /** PUT /api/products/{id} */
  updateProduct(id: string, dto: UpdateProductDto): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.url}/${id}`, dto);
  }

  /** DELETE /api/products/{id} (soft delete) */
  delete(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.url}/${id}`);
  }
}
