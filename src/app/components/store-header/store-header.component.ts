import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-store-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-header.component.html',
  styleUrl: './store-header.component.scss',
})
export class StoreHeaderComponent {
  isLoggedIn = false;
  mobileOpen = false;

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }
}
