import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core';
import { StoreHeaderComponent } from '../../../components/store-header/store-header.component';
import { StoreFooterComponent } from '../../../components/store-footer/store-footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StoreHeaderComponent, StoreFooterComponent],
  template: `
    <div class="ecommerce-layout">
      <app-store-header />
      <main class="ecommerce-main">
        <div class="dashboard">
          <h1 class="dashboard__title">Bienvenido, {{ (auth.user$ | async)?.name ?? 'Usuario' }}</h1>
          <p class="dashboard__subtitle">Ruta privada principal. Explora productos o el panel de administración.</p>
          <div class="dashboard__actions">
            <a routerLink="/products" class="dashboard__btn dashboard__btn--primary">Ver productos</a>
            @if ((auth.user$ | async)?.role === 'Admin') {
              <a routerLink="/admin/dashboard" class="dashboard__btn dashboard__btn--outline">Panel Admin</a>
            }
          </div>
        </div>
      </main>
      <app-store-footer />
    </div>
  `,
  styles: [
    `
      .ecommerce-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .ecommerce-main {
        flex: 1;
      }
      .dashboard {
        max-width: 32rem;
        margin: 0 auto;
        padding: 3rem 1rem;
        text-align: center;
      }
      .dashboard__title {
        font-size: 1.875rem;
        font-weight: 700;
        margin: 0 0 0.5rem;
      }
      .dashboard__subtitle {
        color: #6b7280;
        margin: 0 0 2rem;
      }
      .dashboard__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .dashboard__btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
      }
      .dashboard__btn--primary {
        background: #2563eb;
        color: #fff;
      }
      .dashboard__btn--outline {
        border: 1px solid #2563eb;
        color: #2563eb;
      }
    `,
  ],
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
}
