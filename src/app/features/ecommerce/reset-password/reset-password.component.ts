import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  handleSubmit(): void {
    if (!this.password.trim() || this.password !== this.confirmPassword) return;
    this.isLoading = true;
    // Mock: backend integration pending
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
