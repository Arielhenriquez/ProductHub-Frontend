import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);

  email = '';
  isLoading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  handleSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (!this.email.trim()) return;

    this.isLoading = true;
    this.auth.forgotPassword({ email: this.email.trim() }).subscribe((result) => {
      this.isLoading = false;
      if (result.success) {
        this.successMessage = 'Si el email está registrado, te enviaremos un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada.';
      } else {
        this.errorMessage = result.error;
      }
    });
  }
}
