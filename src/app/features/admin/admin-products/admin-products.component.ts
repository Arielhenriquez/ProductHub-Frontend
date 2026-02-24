import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, CategoriesService } from '../../../core';
import type { ProductListItem, Category, CreateProductDto } from '../../../types';

function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return 'A negociar';
  return `$${Number(price).toFixed(2)}`;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  products: ProductListItem[] = [];
  categories: Category[] = [];
  searchQuery = '';
  filterCategory = 'all';
  filterStatus = 'all';
  dialogOpen = false;
  editingProduct: ProductListItem | null = null;
  saving = false;
  loading = true;
  error: string | null = null;

  form = {
    name: '',
    description: '',
    price: '' as string | number,
    categoryId: '',
    isActive: true,
    quantityInStock: 0,
  };

  readonly formatPrice = formatPrice;

  get filteredProducts(): ProductListItem[] {
    return this.products.filter((p) => {
      const matchSearch =
        !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.description?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false);
      const catId = p.categoryId ?? p.categoryResponses?.[0]?.id ?? p.category?.id;
      const matchCat = this.filterCategory === 'all' || catId === this.filterCategory;
      const matchStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && p.isActive) ||
        (this.filterStatus === 'inactive' && !p.isActive);
      return matchSearch && matchCat && matchStatus;
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  private loadCategories(): void {
    this.categoriesService.getPaged({ pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data?.items) this.categories = res.data.items;
      },
    });
  }

  private loadProducts(): void {
    this.loading = true;
    this.productsService.getPaged({ pageSize: 200, pageNumber: 1 }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.statusCode === 200 && res.data?.items) this.products = res.data.items;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Error al cargar productos';
      },
    });
  }

  openCreate(): void {
    this.editingProduct = null;
    this.form = { name: '', description: '', price: '', categoryId: '', isActive: true, quantityInStock: 0 };
    this.dialogOpen = true;
  }

  openEdit(p: ProductListItem): void {
    this.editingProduct = p;
    this.form = {
      name: p.name,
      description: p.description ?? '',
      price: p.price ?? '',
      categoryId: p.categoryId ?? p.categoryResponses?.[0]?.id ?? p.category?.id ?? '',
      isActive: p.isActive,
      quantityInStock: p.quantityInStock ?? 0,
    };
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.editingProduct = null;
  }

  submit(): void {
    const price = this.form.price === '' || this.form.price === null ? undefined : Number(this.form.price);
    if (!this.form.name.trim() || !this.form.categoryId) return;
    const dto: CreateProductDto = {
      name: this.form.name.trim(),
      description: this.form.description.trim() || undefined,
      price,
      isActive: this.form.isActive,
      quantityInStock: Math.max(0, this.form.quantityInStock),
      categoryId: this.form.categoryId,
    };
    this.saving = true;
    if (this.editingProduct) {
      this.productsService.update(this.editingProduct.id, dto).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.statusCode === 200 && res.data) {
            this.products = this.products.map((x) => (x.id === res.data!.id ? { ...x, ...res.data } : x));
            this.closeDialog();
          }
        },
        error: () => (this.saving = false),
      });
    } else {
      this.productsService.create(dto).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.statusCode === 200 && res.data) this.products = [res.data as ProductListItem, ...this.products];
          this.closeDialog();
        },
        error: () => (this.saving = false),
      });
    }
  }

  deleteProduct(p: ProductListItem): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    this.productsService.delete(p.id).subscribe({
      next: () => (this.products = this.products.filter((x) => x.id !== p.id)),
    });
  }

  categoryName(p: ProductListItem): string {
    return p.category?.name ?? p.categoryResponses?.[0]?.name ?? '—';
  }

  imageUrl(p: ProductListItem): string {
    return p.mainImageUrl ?? p.images?.find((i) => i.isMain)?.url ?? p.images?.[0]?.url ?? '/assets/images/placeholder.svg';
  }

  onImageError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el?.src) el.src = '/assets/images/placeholder.svg';
  }
}
