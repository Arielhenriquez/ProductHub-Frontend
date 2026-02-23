import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  Id: number;
  Name: string;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss'
})
export class ProductFiltersComponent {
  priceMax = 1000;
  selectedCategories: number[] = [];
  categories: Category[] = [
    { Id: 1, Name: 'Electronics' },
    { Id: 2, Name: 'Fashion' },
    { Id: 3, Name: 'Home & Garden' },
    { Id: 4, Name: 'Sports' }
  ];

  toggleCategory(categoryId: number) {
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    } else {
      this.selectedCategories = [...this.selectedCategories, categoryId];
    }
  }

  isCategorySelected(categoryId: number) {
    return this.selectedCategories.includes(categoryId);
  }

  clearFilters() {
    this.selectedCategories = [];
    this.priceMax = 1000;
  }
}
