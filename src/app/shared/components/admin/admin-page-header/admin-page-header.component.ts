import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-page-header.component.html',
  styleUrl: './admin-page-header.component.scss',
})
export class AdminPageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
}
