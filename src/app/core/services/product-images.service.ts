import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BASE_URL } from '../constants/api.constants';
import type { ApiResponse, ProductImage } from '../../types';

@Injectable({ providedIn: 'root' })
export class ProductImagesService {
  private readonly baseUrl = `${BASE_URL}/products`;

  constructor(private readonly http: HttpClient) {}

  /**
   * POST /api/products/{productId}/images
   * Upload one or more images (multipart/form-data, field: "files").
   */
  upload(productId: string, files: File | File[]): Observable<ApiResponse<ProductImage[]>> {
    const formData = new FormData();
    const list = Array.isArray(files) ? files : [files];
    list.forEach((file) => formData.append('files', file, file.name));

    return this.http.post<ApiResponse<ProductImage[]>>(
      `${this.baseUrl}/${productId}/images`,
      formData
    );
  }

  /**
   * DELETE /api/products/{productId}/images/{imageId}
   */
  delete(productId: string, imageId: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${this.baseUrl}/${productId}/images/${imageId}`
    );
  }

  /**
   * PUT /api/products/{productId}/images/{imageId}/set-main
   * Mark this image as the main product image.
   */
  setMain(productId: string, imageId: string): Observable<ApiResponse<ProductImage>> {
    return this.http.put<ApiResponse<ProductImage>>(
      `${this.baseUrl}/${productId}/images/${imageId}/set-main`,
      {}
    );
  }
}
