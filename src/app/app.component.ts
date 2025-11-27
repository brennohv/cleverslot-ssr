import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, RouteConfigLoadEnd, Router } from '@angular/router';
import { filter, map, startWith, tap } from 'rxjs';
import { SpinnerComponent } from 'ba-ngrx-signal-based';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent, AsyncPipe],
  template: ` <router-outlet>
    <!-- @if (isLoading$ | async) {
    <div class="mf-loading-backdrop">
      <div class="d-flex align-items-center mf-loading-content">
        <lib-spinner />
      </div>
    </div>
    } -->
  </router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private loadEnd = false;
  private navEnd = false;

  constructor(private router: Router) {}

  isLoading$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd
    ),
    tap((event) => {
      if (event instanceof RouteConfigLoadEnd) {
        this.loadEnd = true;
      }

      if (event instanceof NavigationEnd) {
        this.navEnd = true;
      }
    }),
    map(() => !(this.loadEnd && this.navEnd)),
    startWith(true)
  );
}
