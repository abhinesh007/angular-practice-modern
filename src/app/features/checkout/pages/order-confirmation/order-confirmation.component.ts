import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../../../core/models/order.model';
import { InrPipe } from '../../../../shared/pipes/currency-inr.pipe';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto py-8 pb-16">
      
      <div class="p-8 sm:p-12 rounded-3xl bg-gray-900/60 border border-gray-800/80 text-center space-y-6 shadow-2xl">
        
        <!-- Animated Success Badge -->
        <div class="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div class="space-y-2">
          <span class="text-xs uppercase tracking-wider font-bold text-emerald-400">Order Confirmed</span>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-white">Thank You For Your Order!</h1>
          <p class="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            Your payment has been authorized and your items are being prepared for dispatch.
          </p>
        </div>

        @if (order; as ord) {
          <!-- Order Summary Card -->
          <div class="p-6 rounded-2xl bg-gray-950/70 border border-gray-800 text-left space-y-4 text-xs">
            
            <div class="flex flex-wrap items-center justify-between pb-3 border-b border-gray-800 gap-2">
              <div>
                <span class="text-gray-400 block text-[11px]">Order Identifier</span>
                <span class="font-mono font-bold text-white text-sm">{{ ord.orderNumber }}</span>
              </div>
              <div>
                <span class="text-gray-400 block text-[11px]">Status</span>
                <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold uppercase text-[10px] border border-indigo-500/30">
                  {{ ord.status }}
                </span>
              </div>
              <div>
                <span class="text-gray-400 block text-[11px]">Payment</span>
                <span class="font-semibold text-white uppercase">{{ ord.paymentMethod }}</span>
              </div>
            </div>

            <!-- Items -->
            <div class="space-y-2.5 py-1">
              <span class="text-gray-400 font-semibold block text-[11px]">Ordered Items:</span>
              @for (item of ord.items; track item.productId) {
                <div class="flex items-center justify-between">
                  <span class="text-gray-200">{{ item.quantity }}× {{ item.title }}</span>
                  <span class="font-medium text-white">{{ (item.price * item.quantity) | inr }}</span>
                </div>
              }
            </div>

            <!-- Delivery Address -->
            <div class="pt-3 border-t border-gray-800 text-gray-300 leading-relaxed">
              <span class="text-gray-400 font-semibold block text-[11px] mb-1">Delivering to:</span>
              <p class="font-medium text-white">{{ ord.shippingAddress.fullName }} ({{ ord.shippingAddress.phone }})</p>
              <p>{{ ord.shippingAddress.street }}, {{ ord.shippingAddress.city }} - {{ ord.shippingAddress.postalCode }}</p>
            </div>

            <div class="pt-3 border-t border-gray-800 flex justify-between items-baseline font-bold">
              <span class="text-white text-sm">Grand Total Paid</span>
              <span class="text-lg text-emerald-400">{{ ord.totalAmount | inr }}</span>
            </div>

          </div>
        }

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            routerLink="/orders"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Track in Past Orders (&#64;ngrx/signals)
          </a>
          <a
            routerLink="/"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium border border-gray-700 transition-colors"
          >
            Continue Shopping
          </a>
        </div>

      </div>

    </div>
  `
})
export class OrderConfirmationComponent {
  private readonly router = inject(Router);
  readonly order: Order | null;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    this.order = (nav?.extras.state?.['order'] as Order) || (history.state?.['order'] as Order) || null;
  }
}
