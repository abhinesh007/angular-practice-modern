import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, exhaustMap } from 'rxjs';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from './order.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: @ngrx/signals SignalStore (Enterprise Modular State)
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15 with NgRx Store):
 * 1. createAction('[Orders] Load Orders')
 * 2. createReducer(initialState, on(...))
 * 3. createEffect(() => this.actions$.pipe(ofType(...), switchMap(...)))
 * 4. createSelector(...)
 * // Result: 4 separate files, 150+ lines of ceremony just to fetch a list of orders!
 *
 * 🚀 MODERN WAY (Angular 18 - 22 with @ngrx/signals):
 * Single declarative, functional store slice composed of features:
 * 1. `withState()`: strongly-typed reactive state.
 * 2. `withComputed()`: derived computed signals.
 * 3. `withMethods()` + `rxMethod()`: async side-effects bridging RxJS pipelines to signals.
 * 4. `withHooks()`: automatic lifecycle hooks on initialization.
 * 5. `patchState()`: type-safe immutable updater.
 *
 * 📖 OFFICIAL DOCS: https://ngrx.io/guide/signals/signal-store
 * -----------------------------------------------------------------------------
 */

export type OrderFilter = 'all' | OrderStatus;

export interface PastOrdersState {
  orders: Order[];
  filter: OrderFilter;
  isLoading: boolean;
  error: string | null;
}

const initialState: PastOrdersState = {
  orders: [],
  filter: 'all',
  isLoading: false,
  error: null
};

export const PastOrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // 1. Computed Derived Signals
  withComputed(({ orders, filter }) => ({
    filteredOrders: computed(() => {
      const activeFilter = filter();
      const allOrders = orders();
      if (activeFilter === 'all') return allOrders;
      return allOrders.filter(o => o.status === activeFilter);
    }),

    totalOrdersCount: computed(() => orders().length),

    lifetimeSpent: computed(() =>
      orders()
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0)
    )
  })),

  // 2. Methods & Asynchronous RxJS Integration with rxMethod
  withMethods((store, orderService = inject(OrderService), toast = inject(ToastService)) => ({
    loadOrders: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap(() =>
          orderService.fetchPastOrders().pipe(
            tap({
              next: (orders) => {
                // Sort by date descending
                const sorted = [...orders].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                patchState(store, { orders: sorted, isLoading: false });
              },
              error: (err: Error) => {
                patchState(store, { error: err.message, isLoading: false });
                toast.error('Failed to load past orders', err.message);
              }
            })
          )
        )
      )
    ),

    setFilter(filter: OrderFilter): void {
      patchState(store, { filter });
    },

    cancelOrder(orderId: string): void {
      orderService.cancelOrder(orderId).subscribe({
        next: () => {
          patchState(store, (state) => ({
            orders: state.orders.map(o =>
              o.id === orderId ? { ...o, status: 'cancelled' } : o
            )
          }));
          toast.info('Order Cancelled', `Order #${orderId} was updated.`);
        },
        error: (err: Error) => {
          toast.error('Cancellation Error', err.message);
        }
      });
    }
  })),

  // 3. Lifecycle Hooks
  withHooks({
    onInit(store) {
      store.loadOrders();
    }
  })
);
