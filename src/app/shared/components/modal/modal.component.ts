import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  title   = input.required<string>();
  subtitle = input<string>('');
  size    = input<ModalSize>('md');
  closeOnBackdrop = input<boolean>(true);

  close = output<void>();

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) this.close.emit();
  }
}
