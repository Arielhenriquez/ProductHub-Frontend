import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, CategoriesService, ProductImagesService } from '../../../core';
import type { ProductListItem, Product, Category, CreateProductDto } from '../../../types';
import {
  AdminPageHeaderComponent,
  AdminStatsCardsComponent,
  AdminToolbarComponent,
  AdminTableShellComponent,
  AdminRowActionsComponent,
} from '../../../shared/components/admin';

const MAX_IMAGE_FILES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return 'A negociar';
  return `$${Number(price).toFixed(2)}`;
}

function validateImageFiles(files: File[]): string | null {
  if (files.length > MAX_IMAGE_FILES)
    return `Máximo ${MAX_IMAGE_FILES} archivos por subida.`;
  for (const f of files) {
    if (!IMAGE_TYPES.includes(f.type))
      return `"${f.name}" no es una imagen válida (JPEG, PNG, GIF, WebP).`;
    if (f.size > MAX_FILE_SIZE_BYTES)
      return `"${f.name}" supera 5 MB.`;
  }
  return null;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageHeaderComponent,
    AdminStatsCardsComponent,
    AdminToolbarComponent,
    AdminTableShellComponent,
    AdminRowActionsComponent,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productImagesService = inject(ProductImagesService);

  products: ProductListItem[] = [];
  categories: Category[] = [];
  searchQuery = '';
  filterCategory = 'all';
  filterStatus = 'all';
  dialogOpen = false;
  editingProduct: ProductListItem | null = null;
  /** Stored product id when editing - used for update, upload, delete, setMain */
  editingProductId: string | null = null;
  /** Full product with images when editing (from GET /api/products/{id}) */
  productDetail: Product | null = null;
  saving = false;
  uploadingImages = false;
  loading = true;
  error: string | null = null;

  /** Pending files to upload after creating a new product */
  pendingFiles: File[] = [];
  /** Object URLs for pending file previews (revoke on clear) */
  pendingPreviewUrls: string[] = [];
  /** Pending new files when editing (upload on save) */
  pendingNewFiles: File[] = [];
  pendingNewPreviewUrls: string[] = [];
  imageError: string | null = null;

  form = {
    name: '',
    description: '',
    price: '' as string | number,
    categoryId: '',
    isActive: true,
    quantityInStock: 0,
  };

  readonly formatPrice = formatPrice;
  readonly maxImageFiles = MAX_IMAGE_FILES;

  get activeProductsCount(): number {
    return this.products.filter((p) => p.isActive).length;
  }

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

  private loadProducts(cb?: () => void): void {
    this.loading = true;
    this.productsService.getPaged({ pageSize: 200, pageNumber: 1 }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.statusCode === 200 && res.data?.items) this.products = res.data.items;
        cb?.();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Error al cargar productos';
        cb?.();
      },
    });
  }

  openCreate(): void {
    this.editingProduct = null;
    this.editingProductId = null;
    this.productDetail = null;
    this.form = { name: '', description: '', price: '', categoryId: '', isActive: true, quantityInStock: 0 };
    this.clearPendingFiles();
    this.imageError = null;
    this.dialogOpen = true;
  }

  openEdit(p: ProductListItem): void {
    this.editingProduct = p;
    this.editingProductId = p.id;
    this.productDetail = null;
    this.form = {
      name: p.name,
      description: p.description ?? '',
      price: p.price ?? '',
      categoryId: p.categoryId ?? p.categoryResponses?.[0]?.id ?? p.category?.id ?? '',
      isActive: p.isActive,
      quantityInStock: p.quantityInStock ?? 0,
    };
    this.clearPendingNewFiles();
    this.imageError = null;
    this.dialogOpen = true;
    this.productsService.getById(p.id).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data) this.productDetail = res.data;
      },
    });
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.editingProduct = null;
    this.editingProductId = null;
    this.productDetail = null;
    this.clearPendingFiles();
    this.clearPendingNewFiles();
    this.imageError = null;
  }

  /** Product id to use for image operations (edit mode). */
  get productIdForImages(): string | null {
    return this.editingProductId ?? this.editingProduct?.id ?? this.productDetail?.id ?? null;
  }

  ngOnDestroy(): void {
    this.clearPendingFiles();
    this.clearPendingNewFiles();
  }

  private clearPendingFiles(): void {
    this.pendingPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.pendingPreviewUrls = [];
    this.pendingFiles = [];
  }

  private clearPendingNewFiles(): void {
    this.pendingNewPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.pendingNewPreviewUrls = [];
    this.pendingNewFiles = [];
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    input.value = '';
    this.imageError = validateImageFiles(files);
    if (this.imageError) return;
    this.clearPendingFiles();
    this.pendingFiles = files;
    this.pendingPreviewUrls = files.map((f) => URL.createObjectURL(f));
  }

  onNewFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    input.value = '';
    const current = this.pendingNewFiles.length + (this.productDetail?.images?.length ?? 0);
    if (current + files.length > MAX_IMAGE_FILES) {
      this.imageError = `Máximo ${MAX_IMAGE_FILES} imágenes en total.`;
      return;
    }
    this.imageError = validateImageFiles(files);
    if (this.imageError) return;
    files.forEach((f) => {
      this.pendingNewFiles.push(f);
      this.pendingNewPreviewUrls.push(URL.createObjectURL(f));
    });
  }

  removePendingFile(index: number): void {
    URL.revokeObjectURL(this.pendingPreviewUrls[index]);
    this.pendingPreviewUrls.splice(index, 1);
    this.pendingFiles.splice(index, 1);
  }

  removePendingNewFile(index: number): void {
    URL.revokeObjectURL(this.pendingNewPreviewUrls[index]);
    this.pendingNewPreviewUrls.splice(index, 1);
    this.pendingNewFiles.splice(index, 1);
  }

  deleteImage(imageId: string): void {
    const pid = this.productIdForImages;
    if (!pid) return;
    this.productImagesService.delete(pid, imageId).subscribe({
      next: () => {
        if (this.productDetail?.images)
          this.productDetail = {
            ...this.productDetail,
            images: this.productDetail.images.filter((img) => img.id !== imageId),
          };
      },
      error: (err) => (this.imageError = err?.error?.error ?? err?.message ?? 'Error al eliminar imagen'),
    });
  }

  setMainImage(imageId: string): void {
    const pid = this.productIdForImages;
    if (!pid) return;
    this.productImagesService.setMain(pid, imageId).subscribe({
      next: (res) => {
        if (this.productDetail?.images && res.data) {
          this.productDetail = {
            ...this.productDetail,
            images: this.productDetail.images.map((img) =>
              img.id === imageId ? { ...img, isMain: true } : { ...img, isMain: false }
            ),
          };
        }
      },
      error: (err) => (this.imageError = err?.error?.error ?? err?.message ?? 'Error al establecer imagen principal'),
    });
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
    this.loading = true;
    this.imageError = null;

    if (this.editingProduct && this.editingProductId) {
      const idForUpdate = this.editingProductId;
      this.productsService.updateProduct(idForUpdate, dto).subscribe({
        next: (res) => {
          if (res.statusCode !== 200 && res.statusCode !== 201) {
            this.saving = false;
            this.loading = false;
            return;
          }
          const productId = res.data?.id ?? idForUpdate;
          if (!productId) {
            this.saving = false;
            this.loading = false;
            this.imageError = 'No se pudo obtener el ID del producto.';
            return;
          }
          if (this.pendingNewFiles.length > 0) {
            this.uploadingImages = true;
            this.productImagesService.uploadProductImages(productId, this.pendingNewFiles).subscribe({
              next: () => {
                this.saving = false;
                this.uploadingImages = false;
                this.loadProducts(() => this.closeDialog());
              },
              error: (err) => {
                this.saving = false;
                this.uploadingImages = false;
                this.loading = false;
                this.imageError =
                  err?.error?.error ?? err?.message ?? 'Error al subir imágenes. El producto se guardó correctamente.';
              },
            });
          } else {
            this.saving = false;
            this.loadProducts(() => this.closeDialog());
          }
        },
        error: (err) => {
          this.saving = false;
          this.loading = false;
          this.imageError = err?.error?.error ?? err?.message ?? 'Error al guardar el producto';
        },
      });
    } else {
      this.productsService.createProduct(dto).subscribe({
        next: (res) => {
          const ok = res.statusCode === 200 || res.statusCode === 201;
          if (!ok) {
            this.saving = false;
            this.loading = false;
            return;
          }
          const productId = res.data?.id ?? (res as { id?: string; data?: { id?: string } })?.data?.id ?? (res as { id?: string })?.id;
          if (!productId) {
            this.saving = false;
            this.loading = false;
            this.imageError = 'No se pudo obtener el ID del producto creado.';
            return;
          }
          if (this.pendingFiles.length > 0) {
            this.uploadingImages = true;
            this.productImagesService.uploadProductImages(productId, this.pendingFiles).subscribe({
              next: () => {
                this.saving = false;
                this.uploadingImages = false;
                this.loadProducts(() => this.closeDialog());
              },
              error: (err) => {
                this.saving = false;
                this.uploadingImages = false;
                this.loading = false;
                this.imageError =
                  'Producto creado correctamente, pero falló la subida de imágenes. Puedes editarlo más tarde para añadirlas.';
              },
            });
          } else {
            this.saving = false;
            this.loadProducts(() => this.closeDialog());
          }
        },
        error: (err) => {
          this.saving = false;
          this.loading = false;
          this.imageError = err?.error?.error ?? err?.message ?? 'Error al crear el producto';
        },
      });
    }
  }

  deleteProduct(p: ProductListItem): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    this.loading = true;
    this.productsService.delete(p.id).subscribe({
      next: () => this.loadProducts(),
      error: () => (this.loading = false),
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
