import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Category } from '../../types';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss',
})
export class ProductFiltersComponent {
  categories = input<Category[]>([]);
  search = input<string>('');
  selectedCategoryIds = input<string[]>([]);

  searchChange = output<string>();
  categoriesChange = output<string[]>();

  priceMax = 1000;

  get categoryList(): Category[] {
    return this.categories() ?? [];
  }

  toggleCategory(categoryId: string): void {
    const current = this.selectedCategoryIds() ?? [];
    const next = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    this.categoriesChange.emit(next);
  }

  isCategorySelected(categoryId: string): boolean {
    return (this.selectedCategoryIds() ?? []).includes(categoryId);
  }

  onSearchInput(value: string): void {
    this.searchChange.emit(value?.trim() ?? '');
  }

  clearFilters(): void {
    this.priceMax = 1000;
    this.searchChange.emit('');
    this.categoriesChange.emit([]);
  }
}
