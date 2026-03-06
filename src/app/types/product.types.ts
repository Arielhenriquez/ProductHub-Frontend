import type { ProductImage } from './product-image.types';

/**
 * Request body for POST /api/products (create product).
 */
export interface CreateProductDto {
  name: string;
  description?: string;
  price?: number;
  isActive: boolean;
  quantityInStock: number;
  categoryId: string;
}

/**
 * Request body for PUT /api/products/{id} (update product).
 * Same shape as create; all fields typically sent.
 */
export interface UpdateProductDto extends CreateProductDto {}

/**
 * Product entity as returned by the API (e.g. GET /api/products/{id} with images).
 * Backend may return categoryResponses (array) instead of category.
 */
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  isActive: boolean;
  quantityInStock: number;
  categoryId?: string;
  category?: { id: string; name: string; description?: string };
  categoryResponses?: Array<{ id: string; name: string; description?: string }>;
  images?: ProductImage[];
  createdDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Product list item (e.g. from GET /api/products paginated list).
 * API returns categoryResponses (array) and images (array); we use first category and main image.
 */
export interface ProductListItem {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  isActive: boolean;
  quantityInStock: number;
  categoryId?: string;
  /** Backend returns category as array */
  categoryResponses?: Array<{ id: string; name: string; description?: string }>;
  category?: { id: string; name: string };
  images?: ProductImage[];
  /** Main image URL for list/card display */
  mainImageUrl?: string;
  /** Backend may return createdDate or createdAt */
  createdDate?: string;
  createdAt?: string;
}
