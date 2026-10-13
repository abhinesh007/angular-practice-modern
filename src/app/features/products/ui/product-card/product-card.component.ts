import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { InrPipe } from '../../../../shared/pipes/currency-inr.pipe';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Signal Inputs & Signal Outputs
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * export class ProductCardComponent {
 *   @Input({ required: true }) product!: Product;
 *   @Output() addToCart = new EventEmitter<Product>();
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * readonly product = input.required<Product>();
 * readonly addToCart = output<Product>();
 *
 * 💡 WHY THIS DECISION WAS MADE:
 * 1. `input()` returns a Signal! You can derive computed signals from it synchronously
 *    without ngOnChanges or setter boilerplate.
 * 2. `output()` is a lightweight function dispatcher, eliminating RxJS Subject allocation.
 * 3. Type inference is strictly enforced and cleaner to read.
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/signals/inputs
 * - https://angular.dev/guide/components/outputs
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, InrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative flex flex-col rounded-2xl bg-gray-900/70 border border-gray-800/80 hover:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
      
      <!-- Top Image & Badges -->
      <a [routerLink]="['/products', product().id]" class="relative block aspect-square overflow-hidden bg-gray-950">
        <img
          [src]="product().imageUrl"
          [alt]="product().title"
          loading="lazy"
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        <!-- Category & Discount Tags -->
        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          @if (product().badge) {
            <span class="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-indigo-600 text-white shadow-md">
              {{ product().badge }}
            </span>
          }
          @if (product().discountPercent > 0) {
            <span class="px-2 py-1 text-[11px] font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              -{{ product().discountPercent }}%
            </span>
          }
        </div>

        <!-- Rating Pill -->
        <div class="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-950/85 backdrop-blur-md text-xs font-semibold text-amber-300 border border-gray-800">
          <svg class="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{{ product().rating }}</span>
          <span class="text-gray-400 text-[10px]">({{ product().ratingCount }})</span>
        </div>
      </a>

      <!-- Card Content -->
      <div class="p-5 flex flex-col flex-1">
        <div class="text-xs font-medium uppercase tracking-wider text-indigo-400 mb-1">
          {{ product().category }}
        </div>

        <a [routerLink]="['/products', product().id]" class="hover:text-indigo-400 transition-colors">
          <h3 class="font-semibold text-base text-gray-100 line-clamp-1">
            {{ product().title }}
          </h3>
        </a>

        <p class="text-xs text-gray-400 line-clamp-2 mt-1 mb-4 flex-1">
          {{ product().tagline }}
        </p>

        <!-- Pricing & Action Button -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-800/80">
          <div>
            <div class="text-lg font-bold text-white">
              {{ product().price | inr }}
            </div>
            @if (product().originalPrice > product().price) {
              <div class="text-xs text-gray-400 line-through">
                {{ product().originalPrice | inr }}
              </div>
            }
          </div>

          <button
            type="button"
            (click)="onAddClick($event)"
            class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
            aria-label="Add to cart"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  `
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly addToCart = output<Product>();

  onAddClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.addToCart.emit(this.product());
  }
}
