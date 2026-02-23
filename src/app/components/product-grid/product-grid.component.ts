import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product, formatPrice } from '../../models/product.model';

const categoryNames: Record<number, string> = {
  1: 'Electronics',
  2: 'Fashion',
  3: 'Home & Garden',
  4: 'Sports'
};

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent implements OnInit {
  favorites: number[] = [];
  products: Product[] = [
    { Id: 1, Name: 'Wireless Headphones Pro', Description: 'Premium wireless headphones with active noise cancellation', Price: 299.99, CategoryId: 1, ImageUrl: '/assets/images/wireless-headphones.png', IsActive: true, CreatedAt: new Date('2024-01-15') },
    { Id: 2, Name: 'Smart Watch Series 5', Description: 'Advanced smartwatch with health tracking features', Price: 449.99, CategoryId: 1, ImageUrl: '/assets/images/smartwatch-lifestyle.png', IsActive: true, CreatedAt: new Date('2024-01-20') },
    { Id: 3, Name: 'Premium Leather Jacket', Description: 'Stylish leather jacket made from genuine leather', Price: 189.99, CategoryId: 2, ImageUrl: '/assets/images/classic-leather-jacket.png', IsActive: true, CreatedAt: new Date('2024-02-01') },
    { Id: 4, Name: 'Designer Sunglasses', Description: 'Trendy sunglasses with UV protection', Price: 159.99, CategoryId: 2, ImageUrl: '/assets/images/designer-sunglasses.png', IsActive: true, CreatedAt: new Date('2024-02-05') },
    { Id: 5, Name: 'Modern Table Lamp', Description: 'Contemporary table lamp with adjustable brightness', Price: 79.99, CategoryId: 3, ImageUrl: '/assets/images/modern-table-lamp.jpg', IsActive: true, CreatedAt: new Date('2024-02-10') },
    { Id: 6, Name: 'Yoga Mat Premium', Description: 'High-quality yoga mat with excellent grip', Price: 49.99, CategoryId: 4, ImageUrl: '/assets/images/rolled-yoga-mat.png', IsActive: true, CreatedAt: new Date('2024-02-15') },
    { Id: 7, Name: 'Coffee Maker Deluxe', Description: 'Professional coffee maker with programmable settings', Price: 129.99, CategoryId: 3, ImageUrl: '/assets/images/modern-coffee-maker.png', IsActive: true, CreatedAt: new Date('2024-02-20') },
    { Id: 8, Name: 'Executive Office Chair', Description: 'Price negotiable - Contact us for details', Price: null, CategoryId: 3, ImageUrl: '/assets/images/running-shoes.jpg', IsActive: true, CreatedAt: new Date('2024-02-25') }
  ];
  activeProducts: Product[] = [];
  sortValue = 'featured';
  formatPrice = formatPrice;

  ngOnInit() {
    this.activeProducts = this.products.filter(p => p.IsActive);
  }

  toggleFavorite(id: number) {
    if (this.favorites.includes(id)) {
      this.favorites = this.favorites.filter(f => f !== id);
    } else {
      this.favorites = [...this.favorites, id];
    }
  }

  isFavorite(id: number) {
    return this.favorites.includes(id);
  }

  getCategoryName(categoryId: number) {
    return categoryNames[categoryId] || 'Unknown';
  }
}
