import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoreHeaderComponent } from '../../../components/store-header/store-header.component';
import { StoreFooterComponent } from '../../../components/store-footer/store-footer.component';
import { ProductsService } from '../../../core';
import type { Product } from '../../../types';

function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return 'A negociar';
  return `$${Number(price).toFixed(2)}`;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StoreHeaderComponent, StoreFooterComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  product: Product | null = null;
  selectedImageIndex = 0;
  isFavorite = false;
  loading = false;
  error: string | null = null;

  readonly formatPrice = formatPrice;
  readonly whatsappNumber = '1234567890';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/products']);
      return;
    }
    this.loadProduct(id);
  }

  private loadProduct(id: string): void {
    this.loading = true;
    this.error = null;
    this.productsService.getById(id).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.statusCode === 200 && res.data) {
          const data = res.data;
          const cat = data.categoryResponses?.[0];
          this.product = {
            ...data,
            category: data.category ?? (cat ? { id: cat.id, name: cat.name, description: cat.description } : undefined),
          };
          this.selectedImageIndex = this.getMainImageIndex();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Error al cargar el producto';
      },
    });
  }

  private getMainImageIndex(): number {
    if (!this.product?.images?.length) return 0;
    const main = this.product.images.find((img) => img.isMain);
    return main ? this.product.images.indexOf(main) : 0;
  }

  get imageUrls(): string[] {
    if (!this.product?.images?.length) return ['/assets/images/placeholder.svg'];
    return this.product.images
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => img.url);
  }

  get currentImageUrl(): string {
    const urls = this.imageUrls;
    return urls[this.selectedImageIndex] ?? urls[0];
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  handleWhatsAppContact(): void {
    if (!this.product) return;
    const message = encodeURIComponent(
      `Hola! Estoy interesado en: ${this.product.name} - Precio: ${this.formatPrice(this.product.price)}`
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  /** Fallback when image fails to load (e.g. 409 Azure Blob). */
  onImageError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el?.src) el.src = '/assets/images/placeholder.svg';
  }
}
