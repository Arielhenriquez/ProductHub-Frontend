/**
 * ProductHub API types and DTOs.
 * Use these for API request/response typing and dependency injection tokens.
 */

export type {
  ApiResponse,
  PaginatedData,
  PaginationParams,
} from './api.types';

export type {
  CreateProductDto,
  UpdateProductDto,
  Product,
  ProductListItem,
} from './product.types';

export type { ProductImage } from './product-image.types';

export type { CategoryDto, Category } from './category.types';

export type {
  RegisterDto,
  LoginDto,
  AuthUser,
  LoginResponse,
  RegisterResponse,
  UserResponseDto,
  UpdateUserDto,
  ApiErrorBody,
} from './auth.types';
