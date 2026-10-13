import { Component, ChangeDetectionStrategy, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartStore } from '../../../cart/data-access/cart.store';
import { ToastService } from '../../../../core/services/toast.service';
import { ShippingFormComponent } from '../../ui/shipping-form/shipping-form.component';
import { PaymentMethod, Order } from '../../../../core/models/order.model';
import { InrPipe } from '../../../../shared/pipes/currency-inr.pipe';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Signal viewChild & Multi-Section Checkout
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * @ViewChild(ShippingFormComponent) shippingForm!: ShippingFormComponent;
 * ngAfterViewInit() { ... } // Timing bugs when child is inside *ngIf!
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * readonly shippingForm = viewChild.required(ShippingFormComponent);
 * // 1. Signal-based query: `shippingForm()` returns the child instance reactively.
 * // 2. No undefined lifecycle race conditions.
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/guide/signals/queries
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [RouterLink, ShippingFormComponent, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-5xl mx-auto pb-16">
      
      <!-- Back Navigation -->
      <nav class="mb-6">
        <a routerLink="/cart" class="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Return to Shopping Bag</span>
        </a>
      </nav>

      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-white">Secure Checkout</h1>
        <p class="text-xs text-gray-400 mt-1">Review shipping and confirm payment method</p>
      </div>

      <!-- Empty Cart Guard Fallback -->
      @if (cartStore.isEmpty()) {
        <div class="py-16 text-center rounded-3xl bg-gray-900/40 border border-gray-800 p-8 space-y-4">
          <h2 class="text-lg font-bold text-white">Your bag is empty</h2>
          <p class="text-xs text-gray-400">Add at least one product before proceeding to checkout.</p>
          <a routerLink="/" class="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
            Browse Catalog
          </a>
        </div>
      } @else {
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Checkout Forms Accordion -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- Step 1: Shipping Form (Signal Forms) -->
            <div class="p-6 rounded-3xl bg-gray-900/60 border border-gray-800/80 shadow-lg">
              <app-shipping-form #shippingComp />
            </div>

            <!-- Step 2: Payment Method Selector -->
            <div class="p-6 rounded-3xl bg-gray-900/60 border border-gray-800/80 shadow-lg space-y-4">
              <h3 class="text-base font-bold text-white flex items-center justify-between">
                <span>Payment Method</span>
                <span class="text-xs font-normal text-emerald-400 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  256-bit Encrypted Mock
                </span>
              </h3>

              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  (click)="paymentMethod.set('upi')"
                  [class.border-indigo-500]="paymentMethod() === 'upi'"
                  [class.bg-indigo-950\\/40]="paymentMethod() === 'upi'"
                  class="p-4 rounded-2xl border border-gray-800 bg-gray-950/60 text-center space-y-1.5 transition-all cursor-pointer hover:border-gray-700"
                >
                  <div class="font-bold text-xs text-white">Instant UPI</div>
                  <div class="text-[10px] text-gray-400">GPay, PhonePe, Paytm</div>
                </button>

                <button
                  type="button"
                  (click)="paymentMethod.set('card')"
                  [class.border-indigo-500]="paymentMethod() === 'card'"
                  [class.bg-indigo-950\\/40]="paymentMethod() === 'card'"
                  class="p-4 rounded-2xl border border-gray-800 bg-gray-950/60 text-center space-y-1.5 transition-all cursor-pointer hover:border-gray-700"
                >
                  <div class="font-bold text-xs text-white">Credit / Debit</div>
                  <div class="text-[10px] text-gray-400">Visa, MC, RuPay</div>
                </button>

                <button
                  type="button"
                  (click)="paymentMethod.set('cod')"
                  [class.border-indigo-500]="paymentMethod() === 'cod'"
                  [class.bg-indigo-950\\/40]="paymentMethod() === 'cod'"
                  class="p-4 rounded-2xl border border-gray-800 bg-gray-950/60 text-center space-y-1.5 transition-all cursor-pointer hover:border-gray-700"
                >
                  <div class="font-bold text-xs text-white">Cash on Delivery</div>
                  <div class="text-[10px] text-gray-400">Pay at doorstep</div>
                </button>
              </div>
            </div>

          </div>

          <!-- Right: Order Summary Sidebar -->
          <div class="lg:col-span-5 p-6 rounded-3xl bg-gray-900/70 border border-gray-800/80 space-y-6 shadow-xl sticky top-24">
            <h3 class="text-base font-bold text-white">Items in Order</h3>

            <!-- Mini List -->
            <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
              @for (item of cartStore.items(); track item.product.id) {
                <div class="flex items-center gap-3 text-xs">
                  <img [src]="item.product.imageUrl" [alt]="item.product.title" class="w-10 h-10 rounded-lg object-cover bg-gray-950 border border-gray-800 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-white truncate">{{ item.product.title }}</p>
                    <p class="text-[11px] text-gray-400">Qty: {{ item.quantity }} × {{ item.product.price | inr }}</p>
                  </div>
                  <div class="font-semibold text-white">
                    {{ (item.product.price * item.quantity) | inr }}
                  </div>
                </div>
              }
            </div>

            <!-- Price Breakdown -->
            <div class="pt-4 border-t border-gray-800 space-y-2 text-xs">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{{ cartStore.subtotal() | inr }}</span>
              </div>
              @if (cartStore.promoDiscount() > 0) {
                <div class="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{{ cartStore.promoDiscount() | inr }}</span>
                </div>
              }
              <div class="flex justify-between text-gray-300">
                <span>GST (18%)</span>
                <span>{{ cartStore.tax() | inr }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>{{ cartStore.shipping() === 0 ? 'FREE' : (cartStore.shipping() | inr) }}</span>
              </div>
              <div class="pt-2 border-t border-gray-800 flex justify-between items-baseline font-bold">
                <span class="text-sm text-white">Total Amount</span>
                <span class="text-xl text-white">{{ cartStore.grandTotal() | inr }}</span>
              </div>
            </div>

            <!-- Place Order Action -->
            <button
              type="button"
              (click)="submitOrder()"
              [disabled]="isSubmitting()"
              class="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wider uppercase shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              @if (isSubmitting()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Processing Order...</span>
              } @else {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Authorize &amp; Place Order • {{ cartStore.grandTotal() | inr }}</span>
              }
            </button>

          </div>

        </div>
      }

    </div>
  `
})
export class CheckoutPageComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly cartStore = inject(CartStore);

  // 🎓 Modern Signal Query for ViewChild
  readonly shippingForm = viewChild.required(ShippingFormComponent);

  // State Signals
  readonly paymentMethod = signal<PaymentMethod>('upi');
  readonly isSubmitting = signal<boolean>(false);

  submitOrder(): void {
    const shipping = this.shippingForm();

    if (!shipping.isShippingValid()) {
      shipping.markAllTouched();
      this.toast.error('Incomplete Shipping Address', 'Please fill in all required shipping fields.');
      return;
    }

    this.isSubmitting.set(true);

    const orderId = `ord-${Date.now().toString().slice(-4)}`;
    const newOrder: Order = {
      id: orderId,
      orderNumber: `ORD-2026-${orderId}`,
      date: new Date().toISOString(),
      status: 'processing',
      totalAmount: this.cartStore.grandTotal(),
      shippingAddress: shipping.shippingData(),
      paymentMethod: this.paymentMethod(),
      items: this.cartStore.items().map(i => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        imageUrl: i.product.imageUrl
      }))
    };

    // Post to mock json-server /api/orders
    this.http.post<Order>('/api/orders', newOrder).subscribe({
      next: (created) => {
        this.cartStore.clearCart();
        this.isSubmitting.set(false);
        this.toast.success('Order Placed Successfully!', `Order #${created.orderNumber} confirmed.`);
        this.router.navigate(['/checkout/success'], { state: { order: created } });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Order Submission Failed', err.message || 'Could not connect to mock server.');
      }
    });
  }
}
