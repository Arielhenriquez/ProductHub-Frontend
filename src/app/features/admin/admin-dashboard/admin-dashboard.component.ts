import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService, CategoriesService } from '../../../core';
import type { ProductListItem } from '../../../types';

function formatPrice(price?: number | null): string {
  if (price === null || price === undefined) return 'A negociar';
  return `$${Number(price).toFixed(2)}`;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  stats: StatCard[] = [];
  recentProducts: ProductListItem[] = [];
  loading = true;
  readonly formatPrice = formatPrice;

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.productsService.getPaged({ pageSize: 5, pageNumber: 1 }).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data) {
          const total = res.data.totalRecords ?? res.data.items?.length ?? 0;
          const items = res.data.items ?? [];
          const activeOnPage = items.filter((p) => p.isActive).length;
          this.recentProducts = items;
          this.categoriesService.getPaged({ pageSize: 1 }).subscribe({
            next: (catRes) => {
              this.loading = false;
              const catTotal = catRes.statusCode === 200 && catRes.data ? (catRes.data.totalRecords ?? catRes.data.items?.length ?? 0) : 0;
              this.stats = [
                { title: 'Total Productos', value: String(total), change: 'En catálogo', icon: '📦' },
                { title: 'Productos Activos', value: String(activeOnPage), change: items.length ? `${items.length} en esta página` : '—', icon: '📈' },
                { title: 'Categorías', value: String(catTotal), change: 'Todas activas', icon: '📁' },
                { title: 'Vistas de Productos', value: '—', change: '—', icon: '👁' },
              ];
            },
            error: () => {
              this.loading = false;
              this.stats = this.buildDefaultStats(total, activeOnPage);
            },
          });
        } else {
          this.loading = false;
          this.stats = this.buildDefaultStats(0, 0);
        }
      },
      error: () => {
        this.loading = false;
        this.stats = this.buildDefaultStats(0, 0);
      },
    });
  }

  private buildDefaultStats(total: number, active: number): StatCard[] {
    return [
      { title: 'Total Productos', value: String(total), change: '—', icon: '📦' },
      { title: 'Productos Activos', value: String(active), change: '—', icon: '📈' },
      { title: 'Categorías', value: '—', change: '—', icon: '📁' },
      { title: 'Vistas de Productos', value: '—', change: '—', icon: '👁' },
    ];
  }

  categoryName(p: ProductListItem): string {
    return p.category?.name ?? p.categoryResponses?.[0]?.name ?? '—';
  }
}
