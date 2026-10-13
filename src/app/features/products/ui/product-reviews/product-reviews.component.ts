import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../data-access/product.service';
import { ProductReview } from '../../../../core/models/product.model';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: rxResource API & Deferred Views Target
 * -----------------------------------------------------------------------------
 *
 * ❓ WHAT IT IS:
 * 1. Loaded on-demand using `@defer (on interaction)` in the parent PDP.
 * 2. Directly leverages `rxResource()` tied to the reactive `productId()` input signal.
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * ngOnChanges(changes) {
 *   if (changes['productId']) {
 *     this.sub = this.service.getReviews(this.productId).subscribe(r => this.reviews = r);
 *   }
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * readonly reviewsResource = rxResource({
 *   request: () => this.productId(),
 *   loader: ({ request }) => this.productService.getReviews(request)
 * });
 * // Automatically re-fetches whenever productId() signal changes!
 * // Exposes `.value()`, `.isLoading()`, `.error()` directly as Signals.
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/guide/signals/rxjs-interop#rxresource
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-8 border-t border-gray-800/80 pt-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-white">Verified Customer Reviews</h3>
          <p class="text-xs text-gray-400 mt-0.5">Real feedback from authenticated owners</p>
        </div>
        <button
          type="button"
          (click)="reviewsResource.reload()"
          class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-800 transition-colors border border-gray-700/60 flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <!-- Loading State -->
      @if (reviewsResource.isLoading()) {
        <div class="space-y-4">
          @for (n of [1, 2]; track n) {
            <div class="p-5 rounded-2xl bg-gray-900/40 border border-gray-800 animate-pulse">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-gray-800"></div>
                <div class="space-y-1.5">
                  <div class="h-3 w-28 bg-gray-800 rounded"></div>
                  <div class="h-2 w-16 bg-gray-800 rounded"></div>
                </div>
              </div>
              <div class="h-3 w-3/4 bg-gray-800 rounded mb-2"></div>
              <div class="h-3 w-1/2 bg-gray-800 rounded"></div>
            </div>
          }
        </div>
      }

      <!-- Error State -->
      @if (reviewsResource.error()) {
        <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm">
          Failed to load reviews. Please click refresh to try again.
        </div>
      }

      <!-- Reviews Content -->
      @if (!reviewsResource.isLoading() && reviewsResource.value(); as reviews) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (review of reviews; track review.id) {
            <div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700/80 transition-colors">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
                    {{ review.author.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-200">{{ review.author }}</div>
                    <div class="text-[11px] text-gray-400">{{ review.date }}</div>
                  </div>
                </div>

                <!-- Stars -->
                <div class="flex items-center gap-0.5">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <svg
                      class="w-3.5 h-3.5"
                      [class.fill-amber-400]="star <= review.rating"
                      [class.fill-gray-700]="star > review.rating"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  }
                </div>
              </div>

              <h4 class="text-sm font-bold text-white mb-1.5">{{ review.title }}</h4>
              <p class="text-xs text-gray-300 leading-relaxed">{{ review.comment }}</p>
            </div>
          } @empty {
            <div class="col-span-2 p-8 text-center rounded-2xl bg-gray-900/30 border border-gray-800 text-gray-400 text-sm">
              No reviews available yet for this product. Be the first to review!
            </div>
          }
        </div>
      }

    </div>
  `
})
export class ProductReviewsComponent {
  private readonly productService = inject(ProductService);
  readonly productId = input.required<string>();

  readonly reviewsResource = rxResource<ProductReview[], string>({
    params: () => this.productId(),
    stream: ({ params }) => this.productService.getReviews(params)
  });
}
