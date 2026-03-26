import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriesService } from '../../../core';
import type { Category, CategoryDto } from '../../../types';
import {
  AdminPageHeaderComponent,
  AdminStatsCardsComponent,
  AdminToolbarComponent,
  AdminTableShellComponent,
  AdminRowActionsComponent,
} from '../../../shared/components/admin';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-admin-categories',
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
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss',
})
export class AdminCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categories: Category[] = [];
  searchQuery = '';
  dialogOpen = false;
  editingCategory: Category | null = null;
  saving = false;
  loading = true;
  error: string | null = null;

  form = { name: '', description: '' };

  get filteredCategories(): Category[] {
    if (!this.searchQuery.trim()) return this.categories;
    const q = this.searchQuery.toLowerCase();
    return this.categories.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q) ?? false)
    );
  }

  get activeCount(): number {
    return this.categories.filter((c) => c.isActive !== false).length;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.categoriesService.getPaged({ pageSize: 100 }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.statusCode === 200 && res.data?.items) this.categories = res.data.items;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message ?? 'Error al cargar categorías';
      },
    });
  }

  openCreate(): void {
    this.editingCategory = null;
    this.form = { name: '', description: '' };
    this.dialogOpen = true;
  }

  openEdit(c: Category): void {
    this.editingCategory = c;
    this.form = { name: c.name, description: c.description ?? '' };
    this.dialogOpen = true;
  }

  closeDialog(): void {
    this.dialogOpen = false;
    this.editingCategory = null;
  }

  submit(): void {
    if (!this.form.name.trim()) return;
    const dto: CategoryDto = { name: this.form.name.trim(), description: this.form.description.trim() || '' };
    this.saving = true;
    if (this.editingCategory) {
      this.categoriesService.update(this.editingCategory.id, dto).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.statusCode === 200 && res.data)
            this.categories = this.categories.map((x) => (x.id === res.data!.id ? { ...x, ...res.data } : x));
          this.closeDialog();
        },
        error: () => (this.saving = false),
      });
    } else {
      this.categoriesService.create(dto).subscribe({
        next: (res) => {
          this.saving = false;
          if (res.statusCode === 200 && res.data) this.categories = [res.data, ...this.categories];
          this.closeDialog();
        },
        error: () => (this.saving = false),
      });
    }
  }

  deleteCategory(c: Category): void {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: `"${c.name}" será eliminada permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.categoriesService.delete(c.id).subscribe({
        next: () => {
          this.categories = this.categories.filter((x) => x.id !== c.id);
          Swal.fire({ title: 'Eliminada', text: 'La categoría fue eliminada.', icon: 'success', timer: 1800, showConfirmButton: false });
        },
      });
    });
  }
}
