import { Component, ChangeDetectionStrategy, inject, input, model, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../data-access/product.service';
import { CartStore } from '../../../cart/data-access/cart.store';
import { InrPipe } from '../../../../shared/pipes/currency-inr.pipe';
import { Product } from '../../../../core/models/product.model';
import { ProductReviewsComponent } from '../../ui/product-reviews/product-reviews.component';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: withComponentInputBinding & Signal Model & @defer
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * export class ProductDetailComponent implements OnInit {
 *   id!: string;
 *   quantity = 1;
 *   constructor(private route: ActivatedRoute) {}
 *   ngOnInit() {
 *     this.route.paramMap.subscribe(params => this.id = params.get('id')!);
 *   }
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * 1. `readonly id = input.required<string>();`
 *    -> Route param `:id` automatically bound into this Signal input!
 * 2. `readonly quantity = model<number>(1);`
 *    -> Writable two-way signal model primitive replacing EventEmitter pairs.
 * 3. `@defer (on interaction(btn))`
 *    -> Micro-chunk lazy loading of the heavy reviews component without routing modules!
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/routing/common-router-tasks#binding-component-inputs-to-route-parameters
 * - https://angular.dev/guide/signals/model-inputs
 * - https://angular.dev/guide/defer
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, InrPipe, ProductReviewsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-6xl mx-auto pb-16">
      
      <!-- Back Navigation Breadcrumb -->
      <nav class="mb-6">
        <a routerLink="/" class="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Catalog</span>
        </a>
      </nav>

      <!-- Loading State -->
      @if (productResource.isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-3xl bg-gray-900/40 border border-gray-800 animate-pulse">
          <div class="aspect-square rounded-2xl bg-gray-800/80 animate-shimmer"></div>
          <div class="space-y-4">
            <div class="h-4 w-24 bg-gray-800 rounded"></div>
            <div class="h-8 w-3/4 bg-gray-800 rounded"></div>
            <div class="h-4 w-full bg-gray-800 rounded"></div>
            <div class="h-8 w-32 bg-gray-800 rounded"></div>
            <div class="h-12 w-48 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (productResource.error()) {
        <div class="p-10 rounded-3xl bg-rose-950/30 border border-rose-800/60 text-center space-y-4">
          <h2 class="text-xl font-bold text-rose-300">Product Not Found</h2>
          <p class="text-xs text-rose-200">The requested product could not be loaded from the catalog.</p>
          <a routerLink="/" class="inline-block px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold">
            Return to Store
          </a>
        </div>
      }

      <!-- Loaded Product Showcase -->
      @if (!productResource.isLoading() && productResource.value(); as product) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-gray-900/50 border border-gray-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
          
          <!-- Left: Gallery & Thumbnails -->
          <div class="lg:col-span-6 space-y-4">
            <!-- Main Hero Image -->
            <div class="aspect-square rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shadow-inner group">
              <img
                [src]="currentImageUrl() || product.imageUrl"
                [alt]="product.title"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Thumbnail Carousel -->
            @if (product.gallery && product.gallery.length > 1) {
              <div class="flex items-center gap-3 overflow-x-auto pb-1">
                @for (img of product.gallery; track img; let idx = $index) {
                  <button
                    type="button"
                    (click)="selectedImageIndex.set(idx)"
                    [class.ring-2]="selectedImageIndex() === idx"
                    [class.ring-indigo-500]="selectedImageIndex() === idx"
                    class="w-16 h-16 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 cursor-pointer shrink-0 transition-all hover:opacity-100"
                    [class.opacity-60]="selectedImageIndex() !== idx"
                  >
                    <img [src]="img" [alt]="product.title + ' view ' + (idx + 1)" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Right: Details, Specs & Cart Controls -->
          <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div class="space-y-4">
              <!-- Category & Badges -->
              <div class="flex items-center gap-2">
                <span class="text-xs uppercase tracking-wider font-semibold text-indigo-400">
                  {{ product.category }}
                </span>
                @if (product.badge) {
                  <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                    {{ product.badge }}
                  </span>
                }
                @if (product.inStock) {
                  <span class="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    In Stock ({{ product.stockCount }} units)
                  </span>
                }
              </div>

              <!-- Title & Tagline -->
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {{ product.title }}
              </h1>
              <p class="text-sm text-gray-300 italic">
                {{ product.tagline }}
              </p>

              <!-- Star Rating -->
              <div class="flex items-center gap-2">
                <div class="flex items-center">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <svg
                      class="w-4 h-4 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  }
                </div>
                <span class="text-xs font-semibold text-white">{{ product.rating }}</span>
                <span class="text-xs text-gray-400">({{ product.ratingCount }} reviews)</span>
              </div>

              <!-- Price Box -->
              <div class="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 flex items-baseline gap-3">
                <div class="text-3xl font-extrabold text-white">
                  {{ product.price | inr }}
                </div>
                @if (product.originalPrice > product.price) {
                  <div class="text-sm text-gray-400 line-through">
                    {{ product.originalPrice | inr }}
                  </div>
                  <div class="text-xs font-semibold text-emerald-400">
                    Save {{ (product.originalPrice - product.price) | inr }} ({{ product.discountPercent }}%)
                  </div>
                }
              </div>

              <!-- Description -->
              <p class="text-sm text-gray-300 leading-relaxed">
                {{ product.description }}
              </p>

              <!-- Specifications Grid -->
              @if (specsList().length > 0) {
                <div class="pt-2">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Technical Specifications</h3>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    @for (spec of specsList(); track spec.key) {
                      <div class="p-2.5 rounded-xl bg-gray-950/40 border border-gray-800/80">
                        <span class="block text-gray-400 text-[11px]">{{ spec.key }}</span>
                        <span class="font-medium text-gray-200 mt-0.5">{{ spec.value }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

            </div>

            <!-- Add to Cart & Signal Model Quantity Counter -->
            <div class="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              <!-- Signal Model Quantity Stepper -->
              <div class="flex items-center justify-between border border-gray-700/80 rounded-xl bg-gray-950/60 p-1">
                <button
                  type="button"
                  (click)="decrementQty()"
                  [disabled]="quantity() <= 1"
                  class="w-9 h-9 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span class="px-4 text-sm font-bold text-white min-w-[32px] text-center">
                  {{ quantity() }}
                </span>
                <button
                  type="button"
                  (click)="incrementQty()"
                  [disabled]="quantity() >= product.stockCount"
                  class="w-9 h-9 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <!-- Add to Cart CTA -->
              <button
                type="button"
                (click)="addToCart(product)"
                class="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add to Shopping Bag • {{ (product.price * quantity()) | inr }}</span>
              </button>

            </div>

          </div>

        </div>

        <!-- 🎓 MODERN ANGULAR @defer VIEW: Lazy-loads reviews on interaction -->
        @defer (on interaction(loadReviewsBtn)) {
          <app-product-reviews [productId]="product.id" />
        } @placeholder {
          <div class="mt-8 p-8 text-center rounded-3xl bg-gray-900/40 border border-gray-800/80 space-y-3">
            <h4 class="text-sm font-semibold text-gray-200">Interested in what owners think?</h4>
            <button
              #loadReviewsBtn
              type="button"
              class="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 transition-all hover:scale-105"
            >
              Load Customer Reviews (Lazy &#64;defer Chunk)
            </button>
          </div>
        } @loading (minimum 300ms) {
          <div class="mt-8 p-8 rounded-3xl bg-gray-900/30 border border-gray-800 text-center animate-pulse">
            <div class="h-4 w-48 bg-gray-800 rounded mx-auto mb-2"></div>
            <div class="text-xs text-gray-500">Loading deferred reviews module chunk...</div>
          </div>
        } @error {
          <div class="mt-8 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs text-center">
            Failed to load deferred reviews view chunk.
          </div>
        }
      }

    </div>
  `
})
export class ProductDetailComponent {
  private readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStore);

  // 🎓 Route param `:id` automatically bound into this Signal input via withComponentInputBinding()!
  readonly id = input.required<string>();

  // 🎓 Modern Signal Model Primitive for Two-way Quantity Binding
  readonly quantity = model<number>(1);

  // State Signals
  readonly selectedImageIndex = signal<number>(0);

  // Reactive Resource tied to the id() input signal (Angular 21/22 rxResource)
  readonly productResource = rxResource<Product, string>({
    params: () => this.id(),
    stream: ({ params }) => this.productService.getProductById(params)
  });

  readonly currentImageUrl = computed(() => {
    const product = this.productResource.value();
    if (!product || !product.gallery) return null;
    return product.gallery[this.selectedImageIndex()] || product.imageUrl;
  });

  readonly specsList = computed(() => {
    const product = this.productResource.value();
    if (!product || !product.specs) return [];
    return Object.entries(product.specs).map(([key, value]) => ({ key, value }));
  });

  incrementQty(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQty(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(product: any): void {
    this.cartStore.addItem(product, this.quantity());
  }
}
