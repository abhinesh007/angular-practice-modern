import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PastOrdersStore, OrderFilter } from '../../data-access/past-orders.store';
import { InrPipe } from '../../../../shared/pipes/currency-inr.pipe';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Consuming @ngrx/signals in Components
 * -----------------------------------------------------------------------------
 * The store methods and signals are injected and consumed directly:
 * `store.filteredOrders()`, `store.lifetimeSpent()`, `store.setFilter('delivered')`.
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-past-orders-page',
  standalone: true,
  imports: [RouterLink, DatePipe, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-6xl mx-auto pb-16 space-y-8">
      
      <!-- Page Header & Metrics Banner -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-800/80">
        <div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-mono border border-purple-500/20 mb-2">
            <span>&#64;ngrx/signals SignalStore</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white">Order History &amp; Tracking</h1>
          <p class="text-xs text-gray-400 mt-1">Review past orders, statuses, and live tracking</p>
        </div>

        <!-- Lifetime Metrics Cards (Computed in @ngrx/signals Store) -->
        <div class="flex items-center gap-4">
          <div class="px-5 py-3 rounded-2xl bg-gray-900/80 border border-gray-800 text-center">
            <span class="block text-[10px] uppercase font-bold text-gray-400">Total Orders</span>
            <span class="text-lg font-extrabold text-white">{{ store.totalOrdersCount() }}</span>
          </div>
          <div class="px-5 py-3 rounded-2xl bg-gray-900/80 border border-gray-800 text-center">
            <span class="block text-[10px] uppercase font-bold text-gray-400">Lifetime Spend</span>
            <span class="text-lg font-extrabold text-emerald-400">{{ store.lifetimeSpent() | inr }}</span>
          </div>
        </div>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1">
        @for (f of filterOptions; track f.key) {
          <button
            type="button"
            (click)="store.setFilter(f.key)"
            [class.bg-purple-600]="store.filter() === f.key"
            [class.text-white]="store.filter() === f.key"
            [class.shadow-lg]="store.filter() === f.key"
            [class.shadow-purple-600\\/30]="store.filter() === f.key"
            [class.bg-gray-900\\/80]="store.filter() !== f.key"
            [class.text-gray-300]="store.filter() !== f.key"
            class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-gray-800 transition-all cursor-pointer hover:bg-gray-800/80"
          >
            {{ f.label }}
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (store.isLoading()) {
        <div class="space-y-4">
          @for (n of [1, 2]; track n) {
            <div class="p-6 rounded-3xl bg-gray-900/40 border border-gray-800 animate-pulse space-y-4">
              <div class="h-4 w-40 bg-gray-800 rounded"></div>
              <div class="h-12 w-full bg-gray-800 rounded-xl"></div>
              <div class="h-4 w-28 bg-gray-800 rounded"></div>
            </div>
          }
        </div>
      }

      <!-- Orders List with Modern @for & @empty -->
      @if (!store.isLoading()) {
        <div class="space-y-6">
          @for (order of store.filteredOrders(); track order.id) {
            <div class="p-6 sm:p-7 rounded-3xl bg-gray-900/60 border border-gray-800/80 shadow-lg space-y-5 transition-all hover:border-gray-700">
              
              <!-- Order Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800/80 gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2.5">
                    <span class="font-mono font-bold text-base text-white">{{ order.orderNumber }}</span>
                    <!-- Status Badge -->
                    <span
                      class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border"
                      [class.bg-emerald-500\\/15]="order.status === 'delivered'"
                      [class.text-emerald-300]="order.status === 'delivered'"
                      [class.border-emerald-500\\/30]="order.status === 'delivered'"
                      [class.bg-sky-500\\/15]="order.status === 'shipped'"
                      [class.text-sky-300]="order.status === 'shipped'"
                      [class.border-sky-500\\/30]="order.status === 'shipped'"
                      [class.bg-amber-500\\/15]="order.status === 'processing'"
                      [class.text-amber-300]="order.status === 'processing'"
                      [class.border-amber-500\\/30]="order.status === 'processing'"
                      [class.bg-rose-500\\/15]="order.status === 'cancelled'"
                      [class.text-rose-300]="order.status === 'cancelled'"
                      [class.border-rose-500\\/30]="order.status === 'cancelled'"
                    >
                      {{ order.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400">
                    Placed on {{ order.date | date:'mediumDate' }} • Payment: <strong class="uppercase">{{ order.paymentMethod }}</strong>
                  </p>
                </div>

                <!-- Total Amount & Cancel Trigger -->
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <span class="block text-[11px] text-gray-400">Order Total</span>
                    <span class="text-lg font-extrabold text-white">{{ order.totalAmount | inr }}</span>
                  </div>

                  @if (order.status === 'processing') {
                    <button
                      type="button"
                      (click)="store.cancelOrder(order.id)"
                      class="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 transition-colors"
                    >
                      Cancel
                    </button>
                  }
                </div>
              </div>

              <!-- Order Line Items -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                @for (item of order.items; track item.productId) {
                  <div class="flex items-center gap-3 p-3 rounded-2xl bg-gray-950/50 border border-gray-800/60">
                    <img [src]="item.imageUrl" [alt]="item.title" class="w-12 h-12 rounded-xl object-cover bg-gray-900 border border-gray-800 shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-xs text-white truncate">{{ item.title }}</p>
                      <p class="text-[11px] text-gray-400">Qty: {{ item.quantity }} × {{ item.price | inr }}</p>
                    </div>
                  </div>
                }
              </div>

              <!-- Shipping Info Footer -->
              <div class="text-xs text-gray-400 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-800/40">
                <span>Shipping Address: {{ order.shippingAddress.street }}, {{ order.shippingAddress.city }} - {{ order.shippingAddress.postalCode }}</span>
                <span>Contact: {{ order.shippingAddress.fullName }} ({{ order.shippingAddress.phone }})</span>
              </div>

            </div>
          } @empty {
            <div class="py-16 text-center rounded-3xl bg-gray-900/40 border border-gray-800 p-8 space-y-4">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-800 flex items-center justify-center text-gray-400">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">No Orders Found</h2>
              <p class="text-xs text-gray-400">
                No orders match the "{{ store.filter() }}" filter criteria.
              </p>
              <div class="flex items-center justify-center gap-3">
                <button
                  type="button"
                  (click)="store.setFilter('all')"
                  class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
                >
                  Reset Filter to All
                </button>
                <a
                  routerLink="/"
                  class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                >
                  Browse Catalog
                </a>
              </div>
            </div>
          }
        </div>
      }

    </div>
  `
})
export class PastOrdersPageComponent {
  readonly store = inject(PastOrdersStore);

  readonly filterOptions: { key: OrderFilter; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];
}
