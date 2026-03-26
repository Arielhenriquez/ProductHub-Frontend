import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading.isLoading()) {
      <div class="global-spinner-overlay">
        <div class="global-spinner">
          <div class="global-spinner__ring"></div>
        </div>
      </div>
    }
  `,
  styles: [`
    .global-spinner-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(2px);
      pointer-events: none;
    }

    .global-spinner__ring {
      width: 3rem;
      height: 3rem;
      border: 3px solid #e5e7eb;
      border-top-color: #2563eb;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class GlobalSpinnerComponent {
  readonly loading = inject(LoadingService);
}
