import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
          this.error = this.toSpanish(result.error ?? '');
          this.errors = (result.errors ?? []).map((e) => this.toSpanish(e));
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Error de conexión. Intenta de nuevo.';
      },
    });
  }

  private toSpanish(msg: string): string {
    const map: Record<string, string> = {
      // Exact backend messages
      'Invalid email or password.': 'Email o contraseña incorrectos.',
      'Invalid email or password': 'Email o contraseña incorrectos.',
      'Invalid credentials': 'Email o contraseña incorrectos.',
      'User not found': 'No existe una cuenta con ese email.',
      'User not found.': 'No existe una cuenta con ese email.',
      'Account is disabled': 'Tu cuenta está desactivada. Contacta al administrador.',
      'Account is disabled.': 'Tu cuenta está desactivada. Contacta al administrador.',
      'Account is not active': 'Tu cuenta está desactivada. Contacta al administrador.',
      'Account is not active.': 'Tu cuenta está desactivada. Contacta al administrador.',
      'Unauthorized': 'No autorizado. Verifica tus credenciales.',
      'Too many requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
      'Email already exists': 'Ya existe una cuenta con ese email.',
      'Email already exists.': 'Ya existe una cuenta con ese email.',
    };
    return map[msg] ?? map[msg.replace(/\.$/, '')] ?? 'Email o contraseña incorrectos.';
  }
}
