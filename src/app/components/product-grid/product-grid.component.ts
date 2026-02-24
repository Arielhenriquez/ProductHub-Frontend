import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { ProductListItem } from '../../types';

function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return 'A negociar';
  return `$${Number(price).toFixed(2)}`;
}

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
})
export class ProductGridComponent {
  products = input<ProductListItem[]>([]);
  totalCount = input<number>(0);
  pageNumber = input<number>(1);
  pageSize = input<number>(12);

  pageChange = output<number>();

  formatPrice = formatPrice;

  get list(): ProductListItem[] {
    return this.products() ?? [];
  }

  get total(): number {
    return this.totalCount() ?? 0;
  }

  get page(): number {
    return this.pageNumber() ?? 1;
  }

  get size(): number {
    return this.pageSize() ?? 12;
  }

  get totalPages(): number {
    const s = this.size;
    return s > 0 ? Math.ceil(this.total / s) : 0;
  }

  imageUrl(product: ProductListItem): string {
    return (
      product.mainImageUrl ??
      product.images?.find((i) => i.isMain)?.url ??
      product.images?.[0]?.url ??
      '/assets/images/placeholder.svg'
    );
  }

  categoryName(product: ProductListItem): string {
    return (
      product.category?.name ??
      product.categoryResponses?.[0]?.name ??
      ''
    );
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.pageChange.emit(p);
  }

  /** Fallback when image fails to load (e.g. 409 Azure Blob, CORS, missing). */
  onImageError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el?.src) el.src = '/assets/images/placeholder.svg';
  }
}
