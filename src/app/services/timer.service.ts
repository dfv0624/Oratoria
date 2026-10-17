import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  readonly elapsedSeconds = signal<number>(0);

  readonly formattedTime = computed(() => {
    const totalSecs = this.elapsedSeconds();
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  });

  readonly isRunning = signal<boolean>(false);

  start(): void {
    if (!this.isBrowser || this.isRunning()) return;
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      this.elapsedSeconds.update((s) => s + 1);
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning.set(false);
  }

  reset(): void {
    this.stop();
    this.elapsedSeconds.set(0);
  }
}
