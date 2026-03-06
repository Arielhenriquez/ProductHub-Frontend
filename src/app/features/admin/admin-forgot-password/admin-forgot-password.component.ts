import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-forgot-password.component.html',
  styleUrl: './admin-forgot-password.component.scss',
})
export class AdminForgotPasswordComponent {
  email = '';
  isLoading = false;

  handleSubmit(): void {
    if (!this.email.trim()) return;
    this.isLoading = true;
    // Mock: backend integration pending
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
