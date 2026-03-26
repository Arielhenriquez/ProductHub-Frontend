import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsersService } from '../../../core';
import type { UserResponseDto, UpdateUserDto } from '../../../types/auth.types';
import {
  AdminPageHeaderComponent,
  AdminStatsCardsComponent,
  AdminToolbarComponent,
  AdminTableShellComponent,
  AdminRowActionsComponent,
} from '../../../shared/components/admin';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

const EMAIL_MAX = 200;
const FIRST_NAME_MAX = 100;
const LAST_NAME_MAX = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminPageHeaderComponent,
    AdminStatsCardsComponent,
    AdminToolbarComponent,
    AdminTableShellComponent,
    AdminRowActionsComponent,
    ModalComponent,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  private readonly usersService = inject(UsersService);
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  users: UserResponseDto[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 10;
  searchQuery = '';
  filterRole = 'all';
  filterStatus = 'all';
  loading = false;
  error: string | null = null;
  dialogOpen = false;
  editingUser: UserResponseDto | null = null;
  saving = false;
  editForm = {
    firstName: '',
    lastName: '' as string | null,
    email: '',
    role: 'User' as 'Admin' | 'User',
    isActive: true,
  };
  editFormError: string | null = null;
  editFieldErrors: Record<string, string> = {};

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.totalCount / this.pageSize) : 0;
  }

  get filteredUsers(): UserResponseDto[] {
    return this.users.filter((u) => {
      const matchRole = this.filterRole === 'all' || u.role.toLowerCase() === this.filterRole;
      const matchStatus =
        this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && u.isActive) ||
        (this.filterStatus === 'inactive' && !u.isActive);
      return matchRole && matchStatus;
    });
  }

  get totalAdmins(): number {
    return this.users.filter((u) => u.role === 'Admin').length;
  }

  get totalUsers(): number {
    return this.users.filter((u) => u.role === 'User').length;
  }

  get totalActive(): number {
    return this.users.filter((u) => u.isActive).length;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
  }

  onSearchQueryChange(value: string): void {
    this.searchQuery = value;
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.searchDebounceTimer = null;
      this.pageNumber = 1;
      this.loadUsers();
    }, SEARCH_DEBOUNCE_MS);
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.usersService.getPagedUsers(this.pageNumber, this.pageSize, this.searchQuery || undefined).subscribe({
      next: (res) => {
        this.loading = false;
        this.users = res.data?.items ?? [];
        this.totalCount = res.data?.totalRecords ?? res.data?.totalCount ?? this.users.length;
        this.pageNumber = res.data?.pageNumber ?? this.pageNumber;
        this.pageSize = res.data?.pageSize ?? this.pageSize;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 403) {
          this.error = 'No tienes permiso para ver usuarios.';
        } else {
          this.error = err.error?.error ?? err.message ?? 'Error al cargar usuarios';
        }
      },
    });
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.pageNumber = p;
    this.loadUsers();
  }

  openEdit(user: UserResponseDto): void {
    this.editingUser = user;
    this.editForm = {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      role: user.role ?? 'User',
      isActive: user.isActive ?? true,
    };
    this.editFormError = null;
    this.editFieldErrors = {};
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.editingUser = null;
    this.editFormError = null;
    this.editFieldErrors = {};
  }

  private validateEditForm(): boolean {
    this.editFormError = null;
    this.editFieldErrors = {};
    const f = this.editForm;
    if (!f.firstName?.trim()) {
      this.editFieldErrors['firstName'] = 'El nombre es obligatorio.';
      return false;
    }
    if (f.firstName.length > FIRST_NAME_MAX) {
      this.editFieldErrors['firstName'] = `El nombre no puede superar ${FIRST_NAME_MAX} caracteres.`;
      return false;
    }
    if (f.lastName != null && f.lastName.length > LAST_NAME_MAX) {
      this.editFieldErrors['lastName'] = `El apellido no puede superar ${LAST_NAME_MAX} caracteres.`;
      return false;
    }
    if (!f.email?.trim()) {
      this.editFieldErrors['email'] = 'El email es obligatorio.';
      return false;
    }
    if (f.email.length > EMAIL_MAX) {
      this.editFieldErrors['email'] = `El email no puede superar ${EMAIL_MAX} caracteres.`;
      return false;
    }
    if (!EMAIL_REGEX.test(f.email.trim())) {
      this.editFieldErrors['email'] = 'Formato de email no válido.';
      return false;
    }
    return true;
  }

  saveEdit(): void {
    if (!this.editingUser?.id) return;
    if (!this.validateEditForm()) return;
    this.saving = true;
    this.editFormError = null;
    const dto: UpdateUserDto = {
      firstName: this.editForm.firstName.trim(),
      lastName: this.editForm.lastName?.trim() || undefined,
      email: this.editForm.email.trim(),
      role: this.editForm.role,
      isActive: this.editForm.isActive,
    };
    this.usersService.updateUser(this.editingUser.id, dto).subscribe({
      next: (res) => {
        this.saving = false;
        this.users = this.users.map((u) => (u.id === res.data.id ? res.data : u));
        this.closeDialog();
      },
      error: (err) => {
        this.saving = false;
        this.editFormError = err.error?.error ?? err.message ?? 'Error al guardar';
      },
    });
  }

  deleteUser(user: UserResponseDto): void {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `"${name}" será eliminado permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== user.id);
          this.totalCount = Math.max(0, this.totalCount - 1);
          Swal.fire({ title: 'Eliminado', text: 'El usuario fue eliminado.', icon: 'success', timer: 1800, showConfirmButton: false });
        },
        error: (err) => {
          this.error = err.error?.error ?? err.message ?? 'Error al eliminar';
        },
      });
    });
  }

  fullName(user: UserResponseDto): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }

  initials(user: UserResponseDto): string {
    const first = user.firstName?.charAt(0) ?? '';
    const last = user.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || '?';
  }
}
