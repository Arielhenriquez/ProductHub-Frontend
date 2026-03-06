import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  };
  error: string | null = null;
  errors: string[] = [];
  fieldErrors: Record<string, string> = {};

  private static readonly FIRST_NAME_MAX = 100;
  private static readonly LAST_NAME_MAX = 100;
  private static readonly EMAIL_MAX = 200;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  handleSubmit(): void {
    this.error = null;
    this.errors = [];
    this.fieldErrors = {};

    if (this.formData.password !== this.formData.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Las contraseñas no coinciden';
      return;
    }
    if (!this.formData.acceptTerms) {
      this.error = 'Debes aceptar los términos y condiciones';
      return;
    }
    if (!this.formData.firstName.trim()) {
      this.fieldErrors['firstName'] = 'El nombre es obligatorio.';
      return;
    }
    if (this.formData.firstName.length > RegisterComponent.FIRST_NAME_MAX) {
      this.fieldErrors['firstName'] = `El nombre no puede superar ${RegisterComponent.FIRST_NAME_MAX} caracteres.`;
      return;
    }
    if (this.formData.lastName && this.formData.lastName.length > RegisterComponent.LAST_NAME_MAX) {
      this.fieldErrors['lastName'] = `El apellido no puede superar ${RegisterComponent.LAST_NAME_MAX} caracteres.`;
      return;
    }
    if (!this.formData.email.trim()) {
      this.fieldErrors['email'] = 'El email es obligatorio.';
      return;
    }
    if (this.formData.email.length > RegisterComponent.EMAIL_MAX) {
      this.fieldErrors['email'] = `El email no puede superar ${RegisterComponent.EMAIL_MAX} caracteres.`;
      return;
    }
    if (!RegisterComponent.EMAIL_REGEX.test(this.formData.email.trim())) {
      this.fieldErrors['email'] = 'Formato de email no válido.';
      return;
    }
    if (this.formData.password.length < 8) {
      this.fieldErrors['password'] = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.isLoading = true;
    this.auth
      .register({
        firstName: this.formData.firstName.trim(),
        lastName: this.formData.lastName.trim() || undefined,
        email: this.formData.email.trim(),
        password: this.formData.password,
      })
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.success) {
            this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
          } else {
            this.error = result.error;
            this.errors = result.errors ?? [];
          }
        },
        error: () => {
          this.isLoading = false;
          this.error = 'Error de conexión. Intenta de nuevo.';
        },
      });
  }
}
