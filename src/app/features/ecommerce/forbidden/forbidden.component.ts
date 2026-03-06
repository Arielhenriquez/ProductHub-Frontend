import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="forbidden">
      <h1>Acceso denegado</h1>
      <p>No tienes permiso para ver esta página.</p>
      <a routerLink="/">Volver a la tienda</a>
    </div>
  `,
  styles: [
    `
      .forbidden {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
      }
      .forbidden h1 {
        margin: 0;
        font-size: 1.5rem;
      }
      .forbidden p {
        margin: 0;
        color: #6b7280;
      }
      .forbidden a {
        color: #2563eb;
        text-decoration: none;
      }
    `,
  ],
})
export class ForbiddenComponent {}
