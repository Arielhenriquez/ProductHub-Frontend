import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  token = '';
  invalidToken = false;

  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  submitted = false;
  passwordErrors: string[] = [];
  errorMessage = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.invalidToken = true;
    } else {
      this.token = token;
    }
  }

  handleSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.passwordErrors = this.validatePasswordPolicy(this.password);

    if (this.passwordErrors.length > 0) return;
    if (this.password !== this.confirmPassword) return;

    this.isLoading = true;
    this.auth.resetPassword({ token: this.token, newPassword: this.password, confirmPassword: this.confirmPassword }).subscribe((result) => {
      this.isLoading = false;
      if (result.success) {
        this.router.navigate(['/login'], { queryParams: { reset: 'true' } });
      } else {
        this.errorMessage = result.error;
      }
    });
  }

  private validatePasswordPolicy(password: string): string[] {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Mínimo 8 caracteres.');
    if (!/[A-Z]/.test(password)) errors.push('Al menos una letra mayúscula.');
    if (!/[0-9]/.test(password)) errors.push('Al menos un número.');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('Al menos un carácter especial.');
    return errors;
  }
}
