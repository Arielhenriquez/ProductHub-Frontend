import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-toolbar.component.html',
  styleUrl: './admin-toolbar.component.scss',
})
export class AdminToolbarComponent {
  searchPlaceholder = input<string>('Buscar...');
  searchValue = input<string>('');
  searchValueChange = output<string>();
  searchSubmit = output<void>();
}
