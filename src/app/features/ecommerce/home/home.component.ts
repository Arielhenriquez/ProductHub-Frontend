import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreHeaderComponent } from '../../../components/store-header/store-header.component';
import { StoreFooterComponent } from '../../../components/store-footer/store-footer.component';
import { CategoriesService, ProductsService } from '../../../core';
import type { Category, ProductListItem } from '../../../types';

function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return 'A negociar';
  return `$${Number(price).toFixed(2)}`;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, StoreHeaderComponent, StoreFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  featuredProducts: ProductListItem[] = [];
  categories: Category[] = [];
  loadingProducts = false;
  loadingCategories = false;

  readonly formatPrice = formatPrice;

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  private loadFeaturedProducts(): void {
    this.loadingProducts = true;
    this.productsService.getPaged({ pageSize: 6, pageNumber: 1 }).subscribe({
      next: (res) => {
        this.loadingProducts = false;
        if (res.statusCode === 200 && res.data?.items) this.featuredProducts = res.data.items;
      },
      error: () => (this.loadingProducts = false),
    });
  }

  private loadCategories(): void {
    this.loadingCategories = true;
    this.categoriesService.getPaged({ pageSize: 6 }).subscribe({
      next: (res) => {
        this.loadingCategories = false;
        if (res.statusCode === 200 && res.data?.items) this.categories = res.data.items;
      },
      error: () => (this.loadingCategories = false),
    });
  }

  productImageUrl(p: ProductListItem): string {
    return (
      p.mainImageUrl ??
      p.images?.find((i) => i.isMain)?.url ??
      p.images?.[0]?.url ??
      '/assets/images/placeholder.svg'
    );
  }

  /** Fallback when image fails to load (e.g. 409 Azure Blob). */
  onImageError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el?.src) el.src = '/assets/images/placeholder.svg';
  }
}
