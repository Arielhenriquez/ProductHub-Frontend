/**
 * Product image as returned by the API (e.g. on Product.images or after upload).
 */
export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
}
