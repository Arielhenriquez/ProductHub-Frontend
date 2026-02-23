import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-store-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-footer.component.html',
  styleUrl: './store-footer.component.scss'
})
export class StoreFooterComponent {
  currentYear = new Date().getFullYear();
}
