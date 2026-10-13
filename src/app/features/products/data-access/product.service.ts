import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductReview, Category } from '../../../core/models/product.model';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Functional HTTP Data Access
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * constructor(private http: HttpClient) {}
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * private readonly http = inject(HttpClient);
 *
 * 💡 WHY THIS DECISION WAS MADE:
 * 1. Functional DI eliminates constructor boilerplate.
 * 2. Works natively alongside rxResource() and signal queries.
 * 3. HttpClient uses browser Fetch API under the hood (via provideHttpClient(withFetch())).
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/http
 * - https://angular.dev/guide/signals/rxjs-interop#rxresource
 * -----------------------------------------------------------------------------
 */

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getProducts(category = 'all', searchQuery = ''): Observable<Product[]> {
    let params = new HttpParams();

    if (category && category !== 'all') {
      params = params.set('category', category);
    }

    if (searchQuery && searchQuery.trim()) {
      params = params.set('q', searchQuery.trim());
    }

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getReviews(productId: string): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(`${this.baseUrl}/reviews`, {
      params: new HttpParams().set('productId', productId)
    });
  }
}
