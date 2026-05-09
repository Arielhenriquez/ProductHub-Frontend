import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private count = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  readonly isLoading = signal(false);

  show(): void {
    this.count++;
    if (this.count === 1 && !this.timer) {
      this.timer = setTimeout(() => {
        if (this.count > 0) this.isLoading.set(true);
        this.timer = null;
      }, 400);
    }
  }

  hide(): void {
    this.count = Math.max(0, this.count - 1);
    if (this.count === 0) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.isLoading.set(false);
    }
  }
}
