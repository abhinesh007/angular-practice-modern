import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../data-access/cart.store';
import { InrPipe } from '../../../../shared/pipes/currency-inr.pipe';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Reactive Signal Cart Page
 * -----------------------------------------------------------------------------
 * All state modifications trigger instantaneous, fine-grained DOM updates
 * without Zone.js.
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-6xl mx-auto pb-16">
      
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-white">Your Shopping Bag</h1>
          <p class="text-xs text-gray-400 mt-1">
            {{ cartStore.itemCount() }} item{{ cartStore.itemCount() === 1 ? '' : 's' }} in bag
          </p>
        </div>

        @if (!cartStore.isEmpty()) {
          <button
            type="button"
            (click)="cartStore.clearCart()"
            class="text-xs text-gray-400 hover:text-rose-400 transition-colors p-2"
          >
            Clear Entire Bag
          </button>
        }
      </div>

      <!-- Empty Cart State -->
      @if (cartStore.isEmpty()) {
        <div class="py-20 text-center rounded-3xl bg-gray-900/40 border border-gray-800 p-8 space-y-4">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-800 flex items-center justify-center text-gray-400">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white">Your Shopping Bag is Empty</h2>
          <p class="text-xs text-gray-400 max-w-sm mx-auto">
            Discover cutting-edge audio, computing, and peripherals in our catalog.
          </p>
          <a
            routerLink="/"
            class="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Explore Catalog
          </a>
        </div>
      } @else {
        
        <!-- Cart Layout: Grid with Items on Left & Order Summary on Right -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Line Items List -->
          <div class="lg:col-span-8 space-y-4">
            @for (item of cartStore.items(); track item.product.id) {
              <div class="p-4 sm:p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-md">
                
                <!-- Thumbnail -->
                <a [routerLink]="['/products', item.product.id]" class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shrink-0">
                  <img [src]="item.product.imageUrl" [alt]="item.product.title" class="w-full h-full object-cover" />
                </a>

                <!-- Title & Meta -->
                <div class="flex-1 min-w-0 text-center sm:text-left space-y-1">
                  <span class="text-[10px] uppercase font-bold text-indigo-400">{{ item.product.category }}</span>
                  <a [routerLink]="['/products', item.product.id]" class="block font-semibold text-white text-sm hover:text-indigo-400 transition-colors truncate">
                    {{ item.product.title }}
                  </a>
                  <div class="text-xs text-gray-400">
                    Unit Price: {{ item.product.price | inr }}
                  </div>
                </div>

                <!-- Quantity Stepper -->
                <div class="flex items-center border border-gray-700 rounded-xl bg-gray-950/60 p-1">
                  <button
                    type="button"
                    (click)="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                    class="w-7 h-7 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span class="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                    {{ item.quantity }}
                  </span>
                  <button
                    type="button"
                    (click)="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                    class="w-7 h-7 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <!-- Line Total & Delete -->
                <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div class="text-base font-bold text-white">
                    {{ (item.product.price * item.quantity) | inr }}
                  </div>
                  <button
                    type="button"
                    (click)="cartStore.removeItem(item.product.id)"
                    class="text-xs text-gray-400 hover:text-rose-400 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

              </div>
            }
          </div>

          <!-- Right: Order Summary Breakdown & Promo Code -->
          <div class="lg:col-span-4 p-6 rounded-3xl bg-gray-900/70 border border-gray-800/80 space-y-6 shadow-xl sticky top-24">
            <h3 class="text-base font-bold text-white">Order Summary</h3>

            <!-- Price Breakdown -->
            <div class="space-y-3 text-xs">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal ({{ cartStore.itemCount() }} items)</span>
                <span class="font-semibold text-white">{{ cartStore.subtotal() | inr }}</span>
              </div>

              @if (cartStore.promoDiscount() > 0) {
                <div class="flex justify-between text-emerald-400">
                  <span>Discount ({{ cartStore.appliedPromoCode() }})</span>
                  <span class="font-semibold">-{{ cartStore.promoDiscount() | inr }}</span>
                </div>
              }

              <div class="flex justify-between text-gray-300">
                <span>Estimated GST (18%)</span>
                <span class="font-semibold text-white">{{ cartStore.tax() | inr }}</span>
              </div>

              <div class="flex justify-between text-gray-300">
                <span>Shipping</span>
                @if (cartStore.shipping() === 0) {
                  <span class="font-semibold text-emerald-400">FREE</span>
                } @else {
                  <span class="font-semibold text-white">{{ cartStore.shipping() | inr }}</span>
                }
              </div>

              <div class="pt-3 border-t border-gray-800 flex justify-between items-baseline">
                <span class="text-sm font-bold text-white">Grand Total</span>
                <span class="text-xl font-extrabold text-white">{{ cartStore.grandTotal() | inr }}</span>
              </div>
            </div>

            <!-- Promo Code Input -->
            <div class="pt-4 border-t border-gray-800 space-y-2">
              <label class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Promo Code</label>
              @if (cartStore.appliedPromoCode()) {
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
                  <span>Applied: <strong>{{ cartStore.appliedPromoCode() }}</strong></span>
                  <button type="button" (click)="cartStore.removePromo()" class="text-xs hover:text-white underline">
                    Remove
                  </button>
                </div>
              } @else {
                <div class="flex gap-2">
                  <input
                    type="text"
                    [value]="promoInput()"
                    (input)="promoInput.set($any($event.target).value)"
                    placeholder="MODERN20 or SAVE500"
                    class="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-950 border border-gray-700 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    (click)="applyPromo()"
                    class="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
              }
            </div>

            <!-- Checkout CTA -->
            <a
              routerLink="/checkout"
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs tracking-wide uppercase text-center block shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Proceed to Checkout • {{ cartStore.grandTotal() | inr }}
            </a>

          </div>

        </div>
      }

    </div>
  `
})
export class CartPageComponent {
  readonly cartStore = inject(CartStore);
  readonly promoInput = signal<string>('');

  applyPromo(): void {
    const code = this.promoInput();
    if (code) {
      if (this.cartStore.applyPromo(code)) {
        this.promoInput.set('');
      }
    }
  }
}
