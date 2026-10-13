import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../../features/cart/data-access/cart.store';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Standalone Shell & Signal Consumption
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * export class NavbarComponent implements OnInit, OnDestroy {
 *   count = 0;
 *   private sub!: Subscription;
 *   constructor(private cartService: CartService) {}
 *   ngOnInit() {
 *     this.sub = this.cartService.count$.subscribe(c => this.count = c);
 *   }
 *   ngOnDestroy() { this.sub?.unsubscribe(); }
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * readonly cartStore = inject(CartStore);
 * // In template: {{ cartStore.itemCount() }}
 * // Zero subscriptions, zero lifecycle hook ceremony, automatic zoneless updates!
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/guide/di
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-gray-950/85 border-b border-gray-800/80 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Brand Logo -->
          <a routerLink="/" class="flex items-center gap-2.5 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              NovaStore
            </span>
            <span class="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v22 Signals
            </span>
          </a>

          <!-- Navigation Links -->
          <nav class="flex items-center gap-1 sm:gap-2">
            <a
              routerLink="/"
              routerLinkActive="bg-gray-800/80 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
            >
              Catalog
            </a>

            <a
              routerLink="/orders"
              routerLinkActive="bg-gray-800/80 text-white"
              class="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors flex items-center gap-1.5"
            >
              <span>Past Orders</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/20 font-mono">
                &#64;ngrx
              </span>
            </a>

            <!-- Cart Navigation with Real-time Signal Badge -->
            <a
              routerLink="/cart"
              routerLinkActive="ring-2 ring-indigo-500/40 bg-gray-800/80"
              class="relative ml-1 p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all flex items-center group"
              aria-label="View Shopping Cart"
            >
              <svg class="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>

              <!-- Signal-computed badge -->
              @if (cartStore.itemCount() > 0) {
                <span class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-[11px] font-bold flex items-center justify-center shadow-lg shadow-pink-500/30 animate-pulse">
                  {{ cartStore.itemCount() }}
                </span>
              }
            </a>
          </nav>

        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly cartStore = inject(CartStore);
}
