import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AdminStatItem {
  value: number | string;
  label: string;
  icon?: string;
  iconBg?: string;
}

@Component({
  selector: 'app-admin-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-stats-cards.component.html',
  styleUrl: './admin-stats-cards.component.scss',
})
export class AdminStatsCardsComponent {
  stats = input.required<AdminStatItem[]>();
}
