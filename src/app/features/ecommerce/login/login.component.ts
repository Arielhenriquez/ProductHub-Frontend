import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  showPassword = false;
  isLoading = false;
  formData = { email: '', password: '', rememberMe: false };
  error: string | null = null;
  errors: string[] = [];
  registered = false;
  expired = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((qp) => {
      this.registered = qp['registered'] === 'true';
      this.expired = qp['expired'] === 'true';
    });
  }

  handleSubmit(): void {
    this.error = null;
    this.errors = [];
    if (!this.formData.email.trim() || !this.formData.password) {
      this.error = 'Email y contraseña son obligatorios.';
      return;
    }
    this.isLoading = true;
    this.auth.login({ email: this.formData.email.trim(), password: this.formData.password }).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.success) {
          this.auth.navigateAfterLogin();
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
