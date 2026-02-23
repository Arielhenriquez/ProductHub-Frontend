// Categories table
export interface Category {
  Id: number;
  Name: string;
  Description?: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

// Products table
export interface Product {
  Id: number;
  Name: string;
  Description?: string;
  Price?: number | null;
  CategoryId: number;
  ImageUrl?: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
  Category?: Category;
}

// AdminUsers table
export interface AdminUser {
  Id: number;
  Name: string;
  Email: string;
  PasswordHash: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

// Users table for normal registered users
export interface User {
  Id: number;
  Name: string;
  Email: string;
  PasswordHash: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) {
    return 'A negociar';
  }
  return `$${price.toFixed(2)}`;
}

export function isProductVisible(product: Product): boolean {
  return product.IsActive === true;
}
