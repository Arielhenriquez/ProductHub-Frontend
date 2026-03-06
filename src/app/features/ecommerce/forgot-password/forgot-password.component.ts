import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  submitted = false;

  handleSubmit(): void {
    this.submitted = true;
    if (!this.email.trim()) return;
    this.isLoading = true;
    // Mock: backend integration pending
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
