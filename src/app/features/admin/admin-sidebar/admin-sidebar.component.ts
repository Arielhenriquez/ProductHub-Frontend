import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  navItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Panel Principal', icon: '▣' },
    { href: '/admin/products', label: 'Productos', icon: '📦' },
    { href: '/admin/categories', label: 'Categorías', icon: '📁' },
    { href: '/admin/users', label: 'Usuarios', icon: '👥' },
  ];

  isActive(href: string): boolean {
    const url = this.router.url;
    return url === href || url.startsWith(href + '/');
  }

  logout(): void {
    this.auth.logout();
  }
}
