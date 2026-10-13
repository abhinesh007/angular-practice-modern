import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Application Providers & Zoneless Configuration
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * @NgModule({
 *   declarations: [AppComponent],
 *   imports: [BrowserModule, AppRoutingModule, HttpClientModule],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule {}
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * Bootstrapped via ApplicationConfig with functional provider functions:
 * 1. `provideExperimentalZonelessChangeDetection()` removes zone.js entirely!
 * 2. `withComponentInputBinding()` automatically maps route params (:id), query params,
 *    and resolved route data directly into component `input()` signals.
 * 3. `withViewTransitions()` enables native CSS page transition animations.
 * 4. `provideHttpClient(withFetch())` uses modern browser Fetch API instead of XMLHttpRequest.
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/experimental/zoneless
 * - https://angular.dev/guide/routing/common-router-tasks#binding-component-inputs-to-route-parameters
 * -----------------------------------------------------------------------------
 */

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    )
  ]
};
