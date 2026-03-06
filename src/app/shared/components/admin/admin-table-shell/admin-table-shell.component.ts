import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-table-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-table-shell.component.html',
  styleUrl: './admin-table-shell.component.scss',
})
export class AdminTableShellComponent {
  tableTitle = input.required<string>();
  loading = input<boolean>(false);
  error = input<string | null>(null);
}
