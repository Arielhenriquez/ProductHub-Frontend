import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-row-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-row-actions.component.html',
  styleUrl: './admin-row-actions.component.scss',
})
export class AdminRowActionsComponent {
  edit = output<void>();
  delete = output<void>();
}
