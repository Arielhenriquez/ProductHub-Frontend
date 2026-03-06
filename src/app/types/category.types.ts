/**
 * Request body for POST /api/categories and PUT /api/categories/{id}.
 */
export interface CategoryDto {
  name: string;
  description: string;
}

/**
 * Category entity as returned by the API (e.g. GET /api/categories/{id}).
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  /** Backend may return createdDate or createdAt */
  createdDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
