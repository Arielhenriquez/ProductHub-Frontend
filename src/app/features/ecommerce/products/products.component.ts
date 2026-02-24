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
      this.selectedCategoryIds = qp['category'] ? [qp['category']] : [];
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
    this.productsService
      .getPaged({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        search: this.search || undefined,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.statusCode === 200 && res.data) {
            const data = res.data;
            this.products = (data.items ?? []).map((p) => this.normalizeProductItem(p));
            this.totalCount = data.totalRecords ?? data.totalCount ?? this.products.length;
            this.pageNumber = data.pageNumber ?? this.pageNumber;
            this.pageSize = data.pageSize ?? this.pageSize;
            this.applyCategoryFilter();
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

  private applyCategoryFilter(): void {
    if (this.selectedCategoryIds.length === 0) return;
    this.products = this.products.filter((p) => {
      const id = p.categoryId ?? p.categoryResponses?.[0]?.id ?? p.category?.id;
      return id && this.selectedCategoryIds.includes(id);
    });
    this.totalCount = this.products.length;
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
        category: ids.length ? ids[0] : null,
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
