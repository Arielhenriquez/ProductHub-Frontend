import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StoreHeaderComponent } from '../../../components/store-header/store-header.component';
import { StoreFooterComponent } from '../../../components/store-footer/store-footer.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StoreHeaderComponent, StoreFooterComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  selectedImage = 0;
  isFavorite = false;
  activeTab: 'features' | 'specs' | 'reviews' = 'features';

  product = {
    id: 1,
    name: 'Auriculares Inalámbricos Pro',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 234,
    images: ['/assets/images/placeholder.svg', '/assets/images/placeholder.svg', '/assets/images/placeholder.svg', '/assets/images/placeholder.svg'],
    description: 'Experimenta una calidad de sonido premium con nuestros Auriculares Inalámbricos Pro. Con cancelación activa de ruido, 30 horas de batería y comodidad suprema para usar todo el día.',
    features: [
      'Cancelación Activa de Ruido',
      '30 horas de batería',
      'Almohadillas de cuero premium',
      'Conectividad Bluetooth 5.0',
      'Micrófono integrado',
      'Diseño plegable con estuche'
    ],
    specifications: {
      'Tamaño del Driver': '40mm',
      'Respuesta de Frecuencia': '20Hz - 20kHz',
      'Impedancia': '32 Ohms',
      'Peso': '250g',
      'Tiempo de Carga': '2 horas',
      'Versión Bluetooth': '5.0'
    }
  };

  whatsappNumber = '1234567890';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // TODO: Load product by ID
  }

  handleWhatsAppContact() {
    const message = encodeURIComponent(`Hola! Estoy interesado en: ${this.product.name} - Precio: $${this.product.price}`);
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  selectImage(index: number) {
    this.selectedImage = index;
  }

  getSpecsArray(): { key: string; value: string }[] {
    return Object.entries(this.product.specifications).map(([key, value]) => ({ key, value }));
  }

  Math = Math;
}
