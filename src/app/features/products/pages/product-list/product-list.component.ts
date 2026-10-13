import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../data-access/product.service';
import { CartStore } from '../../../cart/data-access/cart.store';
import { Product, Category } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../ui/product-card/product-card.component';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Landing Catalog Shell & rxResource API
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * export class ProductListComponent implements OnInit, OnDestroy {
 *   products: Product[] = [];
 *   loading = true;
 *   private destroy$ = new Subject<void>();
 *   ngOnInit() {
 *     combineLatest([this.category$, this.search$]).pipe(
 *       debounceTime(300),
 *       switchMap(([cat, search]) => this.service.get(cat, search)),
 *       takeUntil(this.destroy$)
 *     ).subscribe(data => { this.products = data; this.loading = false; });
 *   }
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * 1. Signals hold filter criteria: `selectedCategory`, `searchQuery`.
 * 2. `rxResource()` binds directly to the signal expressions:
 *    request: () => ({ category: this.selectedCategory(), search: this.searchQuery() })
 *    Whenever either signal mutates, rxResource automatically re-triggers the loader!
 * 3. Native Control Flow: `@if`, `@for (...; track ...)`, `@empty`.
 * 4. Zero subscriptions and zero memory leaks.
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/signals/rxjs-interop#rxresource
 * - https://angular.dev/guide/templates/control-flow
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-10 pb-16">
      
      <!-- Hero Banner -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-gray-900 to-purple-950 border border-gray-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Angular 22 Zoneless Reactive Showcase
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Tech Essentials. <br />
            <span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Powered Purely by Signals.
            </span>
          </h1>

          <p class="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
            Explore curated studio audio, mechanical workstations, ultra-light peripherals, and wearables. Zero Zone.js DOM monkey-patching, zero subscription memory leaks.
          </p>

          <!-- Search Bar -->
          <div class="pt-4 flex items-center gap-3 max-w-md">
            <div class="relative flex-1">
              <input
                type="text"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                placeholder="Search headphones, laptops, gear..."
                class="w-full pl-10 pr-9 py-3 rounded-xl bg-gray-950/80 border border-gray-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-white placeholder-gray-400 outline-none transition-all shadow-inner"
              />
              <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="searchQuery.set('')"
                  class="absolute right-3 top-3 text-gray-400 hover:text-white p-0.5 rounded-full"
                  aria-label="Clear search"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <section class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        @if (categoriesResource.value(); as categories) {
          @for (cat of categories; track cat.id) {
            <button
              type="button"
              (click)="selectedCategory.set(cat.id)"
              [class.bg-indigo-600]="selectedCategory() === cat.id"
              [class.text-white]="selectedCategory() === cat.id"
              [class.shadow-lg]="selectedCategory() === cat.id"
              [class.shadow-indigo-600\\/30]="selectedCategory() === cat.id"
              [class.bg-gray-900\\/80]="selectedCategory() !== cat.id"
              [class.text-gray-300]="selectedCategory() !== cat.id"
              [class.hover:bg-gray-800]="selectedCategory() !== cat.id"
              class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-gray-800 transition-all duration-200 cursor-pointer active:scale-95"
            >
              {{ cat.name }}
            </button>
          }
        }
      </section>

      <!-- Main Products Grid with Modern Control Flow -->
      <section>
        
        <!-- Loading Skeletons -->
        @if (productsResource.isLoading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (n of [1, 2, 3, 4, 5, 6, 7, 8]; track n) {
              <div class="rounded-2xl bg-gray-900/50 border border-gray-800 p-4 space-y-4 animate-pulse">
                <div class="aspect-square rounded-xl bg-gray-800/80 animate-shimmer"></div>
                <div class="space-y-2">
                  <div class="h-3 w-1/3 bg-gray-800 rounded"></div>
                  <div class="h-4 w-3/4 bg-gray-800 rounded"></div>
                  <div class="h-3 w-1/2 bg-gray-800 rounded"></div>
                </div>
                <div class="flex items-center justify-between pt-2">
                  <div class="h-5 w-20 bg-gray-800 rounded"></div>
                  <div class="h-8 w-16 bg-gray-800 rounded-xl"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Error State -->
        @if (productsResource.error()) {
          <div class="p-8 rounded-2xl bg-rose-950/30 border border-rose-800/50 text-center space-y-3">
            <h3 class="text-base font-bold text-rose-300">Error Connecting to Mock Server</h3>
            <p class="text-xs text-rose-200">
              Ensure json-server is active on port 3001. You can restart it via:
              <code class="px-2 py-1 rounded bg-black/40 font-mono text-[11px]">npm run mock:api</code>
            </p>
            <button
              type="button"
              (click)="productsResource.reload()"
              class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              Retry Connection
            </button>
          </div>
        }

        <!-- Success Products Grid -->
        @if (!productsResource.isLoading() && productsResource.value(); as products) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of products; track product.id) {
              <app-product-card
                [product]="product"
                (addToCart)="cartStore.addItem($event)"
              />
            } @empty {
              <!-- Modern @empty block built into @for -->
              <div class="col-span-full py-16 text-center space-y-4 rounded-3xl bg-gray-900/40 border border-gray-800/80">
                <div class="w-16 h-16 mx-auto rounded-2xl bg-gray-800/80 flex items-center justify-center text-gray-400">
                  <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div class="space-y-1">
                  <h3 class="text-lg font-bold text-white">No Matching Products</h3>
                  <p class="text-xs text-gray-400">
                    We couldn't find any products matching "{{ searchQuery() }}" in this category.
                  </p>
                </div>
                <button
                  type="button"
                  (click)="resetFilters()"
                  class="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
                >
                  Clear Filters &amp; Search
                </button>
              </div>
            }
          </div>
        }

      </section>

    </div>
  `
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  readonly cartStore = inject(CartStore);

  // Filter Signals
  readonly selectedCategory = signal<string>('all');
  readonly searchQuery = signal<string>('');

  // 🎓 MODERN ANGULAR rxResource API (Angular 21/22):
  // Automatically tracks params() signals. Whenever selectedCategory or searchQuery changes,
  // rxResource executes stream() reactively.
  readonly productsResource = rxResource<Product[], { category: string; search: string }>({
    params: () => ({
      category: this.selectedCategory(),
      search: this.searchQuery()
    }),
    stream: ({ params }) =>
      this.productService.getProducts(params.category, params.search)
  });

  readonly categoriesResource = rxResource<Category[], undefined>({
    stream: () => this.productService.getCategories()
  });

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
  }
}
