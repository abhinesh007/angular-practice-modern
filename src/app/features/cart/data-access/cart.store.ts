import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem } from '../../../core/models/cart.model';
import { Product } from '../../../core/models/product.model';
import { ToastService } from '../../../core/services/toast.service';

const CART_STORAGE_KEY = 'nova_cart_items';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Native Signal Store (Service with Signals)
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * export class CartService {
 *   private items$ = new BehaviorSubject<CartItem[]>([]);
 *   readonly items = this.items$.asObservable();
 *   readonly itemCount$ = this.items$.pipe(map(items => ...));
 *   readonly total$ = combineLatest([this.items$, this.tax$]).pipe(map(...));
 *   // Required AsyncPipe or manual subscriptions in every consuming component!
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * We use core Angular Signals:
 * 1. `signal<T>()` holds writable state.
 * 2. `computed()` holds automatically memoized, synchronously evaluated derived state.
 * 3. `effect()` synchronizes state with browser storage or external systems.
 *
 * 💡 WHY THIS DECISION WAS MADE:
 * 1. Zero external library dependencies (pure @angular/core).
 * 2. Zoneless compatible: signal mutations notify the Angular scheduler directly.
 * 3. No memory leaks: reading `store.itemCount()` in templates has no RxJS subscription overhead.
 * 4. Memoization: `computed()` only recalculates when dependent signals change.
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/signals
 * - https://angular.dev/guide/signals/computed
 * -----------------------------------------------------------------------------
 */

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly toast = inject(ToastService);

  // 1. Core Writable Signals
  readonly items = signal<CartItem[]>(this.loadInitialCart());
  readonly promoDiscount = signal<number>(0);
  readonly appliedPromoCode = signal<string | null>(null);

  // 2. Computed Derivations
  readonly itemCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  readonly tax = computed(() =>
    Math.round(this.subtotal() * 0.18) // 18% standard GST
  );

  readonly shipping = computed(() => {
    const sub = this.subtotal();
    if (sub === 0 || sub > 1999) return 0; // Free shipping over ₹1,999
    return 149;
  });

  readonly grandTotal = computed(() => {
    const discountedSubtotal = Math.max(0, this.subtotal() - this.promoDiscount());
    if (this.items().length === 0) return 0;
    return discountedSubtotal + this.tax() + this.shipping();
  });

  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    // 3. Signal Effect: Synchronize Cart state with localStorage
    effect(() => {
      const currentItems = this.items();
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentItems));
      } catch (e) {
        console.warn('Failed to persist cart items to localStorage', e);
      }
    });
  }

  // 4. Action Methods (Immutable State Updates via signal.update())
  addItem(product: Product, quantity = 1): void {
    if (quantity <= 0) return;

    this.items.update(currentItems => {
      const existingIndex = currentItems.findIndex(i => i.product.id === product.id);

      if (existingIndex > -1) {
        const updated = [...currentItems];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      }

      return [...currentItems, { product, quantity }];
    });

    this.toast.success('Added to Cart', `${product.title} (${quantity}x) added to your shopping bag.`);
  }

  removeItem(productId: string): void {
    const item = this.items().find(i => i.product.id === productId);
    this.items.update(currentItems => currentItems.filter(i => i.product.id !== productId));

    if (item) {
      this.toast.info('Item Removed', `${item.product.title} was removed from your cart.`);
    }
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update(currentItems =>
      currentItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }

  applyPromo(code: string): boolean {
    const normalized = code.trim().toUpperCase();

    if (normalized === 'MODERN20') {
      const discount = Math.round(this.subtotal() * 0.20);
      this.promoDiscount.set(discount);
      this.appliedPromoCode.set('MODERN20');
      this.toast.success('Promo Applied', '20% discount applied with code MODERN20!');
      return true;
    }

    if (normalized === 'SAVE500') {
      const discount = 500;
      this.promoDiscount.set(discount);
      this.appliedPromoCode.set('SAVE500');
      this.toast.success('Promo Applied', '₹500 flat discount applied with code SAVE500!');
      return true;
    }

    this.toast.error('Invalid Code', 'Try MODERN20 (20% off) or SAVE500 (₹500 off).');
    return false;
  }

  removePromo(): void {
    this.promoDiscount.set(0);
    this.appliedPromoCode.set(null);
    this.toast.info('Promo Removed', 'Discount was removed from your order.');
  }

  clearCart(): void {
    this.items.set([]);
    this.promoDiscount.set(0);
    this.appliedPromoCode.set(null);
  }

  private loadInitialCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Return empty fallback on storage parse error
    }
    return [];
  }
}
