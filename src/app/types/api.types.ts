/**
 * Wrapped response format returned by all ProductHub API endpoints.
 * Backend uses statusCode + message; we treat statusCode === 200 as success.
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Shape of `data` for paginated endpoints.
 * Backend returns totalRecords and totalPages.
 */
export interface PaginatedData<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
  totalRecords?: number;
  /** @deprecated use totalRecords */
  totalCount?: number;
}

/**
 * Query params for paginated list endpoints.
 */
export interface PaginationParams {
  pageSize?: number;
  pageNumber?: number;
  search?: string;
}
