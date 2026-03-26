import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoreHeaderComponent } from '../../../components/store-header/store-header.component';
import { StoreFooterComponent } from '../../../components/store-footer/store-footer.component';
import { ProductGridComponent } from '../../../components/product-grid/product-grid.component';
import { ProductFiltersComponent } from '../../../components/product-filters/product-filters.component';
import { CategoriesService, ProductsService } from '../../../core';
import type { Category, ProductListItem } from '../../../types';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StoreHeaderComponent,
    StoreFooterComponent,
    ProductGridComponent,
    ProductFiltersComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  products: ProductListItem[] = [];
  categories: Category[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 12;
  search = '';
  selectedCategoryIds: string[] = [];

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe((qp) => {
      this.pageNumber = Math.max(1, Number(qp['page']) || 1);
      this.search = (qp['search'] as string) ?? '';
      this.selectedCategoryIds = qp['category'] ? String(qp['category']).split(',').filter(Boolean) : [];
      this.loadProducts();
    });
  }

  private loadCategories(): void {
    this.categoriesService.getPaged({ pageSize: 50 }).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data?.items) this.categories = res.data.items;
      },
      error: () => (this.categories = []),
    });
  }

  private loadProducts(): void {
    this.loading = true;
    this.error = null;
    const hasFilter = this.selectedCategoryIds.length > 0;

    this.productsService
      .getPaged({
        // When filtering by category, fetch all products so client-side filter
        // covers every page — not just the current 12-item slice.
        pageSize: hasFilter ? 500 : this.pageSize,
        pageNumber: hasFilter ? 1 : this.pageNumber,
        search: this.search || undefined,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.statusCode === 200 && res.data) {
            const data = res.data;
            let items = (data.items ?? []).map((p) => this.normalizeProductItem(p));

            if (hasFilter) {
              items = items.filter((p) => {
                const id = p.categoryId ?? p.categoryResponses?.[0]?.id ?? p.category?.id;
                return id && this.selectedCategoryIds.includes(String(id));
              });
              this.totalCount = items.length;
              // Client-side pagination over filtered results
              const start = (this.pageNumber - 1) * this.pageSize;
              this.products = items.slice(start, start + this.pageSize);
            } else {
              this.products = items;
              this.totalCount = data.totalRecords ?? data.totalCount ?? items.length;
              this.pageNumber = data.pageNumber ?? this.pageNumber;
              this.pageSize = data.pageSize ?? this.pageSize;
            }
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.message ?? 'Error al cargar productos';
          this.products = [];
        },
      });
  }

  /** Map API item (categoryResponses, images) to view shape (category, mainImageUrl, categoryId). */
  private normalizeProductItem(p: ProductListItem): ProductListItem {
    const category = p.categoryResponses?.[0];
    const mainImage = p.images?.find((i) => i.isMain) ?? p.images?.[0];
    return {
      ...p,
      categoryId: p.categoryId ?? category?.id,
      category: category ? { id: category.id, name: category.name } : p.category,
      mainImageUrl: p.mainImageUrl ?? mainImage?.url,
    };
  }

  onSearchChange(value: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: value || null, page: 1 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onCategoriesChange(ids: string[]): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: ids.length ? ids.join(',') : null,
        page: 1,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
