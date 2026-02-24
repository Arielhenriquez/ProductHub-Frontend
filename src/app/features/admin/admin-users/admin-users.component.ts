import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent {
  users: AppUser[] = [
    { id: 1, name: 'Carlos Rodríguez', email: 'carlos@admin.com', role: 'admin', isActive: true, createdAt: new Date('2024-01-01') },
    { id: 2, name: 'María López', email: 'maria@admin.com', role: 'admin', isActive: true, createdAt: new Date('2024-01-01') },
    { id: 3, name: 'Pedro Sánchez', email: 'pedro@gmail.com', role: 'user', isActive: true, createdAt: new Date('2024-02-10') },
    { id: 4, name: 'Ana Fernández', email: 'ana.f@hotmail.com', role: 'user', isActive: true, createdAt: new Date('2024-02-18') },
    { id: 5, name: 'Juan Martínez', email: 'juanm@gmail.com', role: 'user', isActive: false, createdAt: new Date('2024-03-05') },
    { id: 6, name: 'Sofía Torres', email: 'sofia.t@yahoo.com', role: 'user', isActive: true, createdAt: new Date('2024-03-12') },
  ];

  searchQuery = '';
  filterRole = 'all';
  filterStatus = 'all';

  get filteredUsers(): AppUser[] {
    return this.users.filter((u) => {
      const matchSearch =
        !this.searchQuery ||
        u.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchRole = this.filterRole === 'all' || u.role === this.filterRole;
      const matchStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && u.isActive) ||
        (this.filterStatus === 'inactive' && !u.isActive);
      return matchSearch && matchRole && matchStatus;
    });
  }

  get totalAdmins(): number {
    return this.users.filter((u) => u.role === 'admin').length;
  }

  get totalUsers(): number {
    return this.users.filter((u) => u.role === 'user').length;
  }

  get totalActive(): number {
    return this.users.filter((u) => u.isActive).length;
  }

  toggleStatus(u: AppUser): void {
    if (u.role === 'admin') return;
    u.isActive = !u.isActive;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
