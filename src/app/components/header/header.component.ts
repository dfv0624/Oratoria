import { Component, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly router = inject(Router);

  // Detect when we are on a practice route to display the back button
  private readonly navEnd$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd)
  );
  private readonly currentUrl = toSignal(this.navEnd$, { initialValue: null });

  isPracticeView(): boolean {
    const url = this.currentUrl()?.urlAfterRedirects || this.router.url;
    return url.includes('/practice/');
  }
}
