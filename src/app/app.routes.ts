import { Routes } from '@angular/router';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Functional Routes & Standalone Lazy Loading
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * const routes: Routes = [{
 *   path: 'products',
 *   loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
 * }];
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * `loadComponent: () => import(...)`
 * Eliminates intermediate NgModule wrappers. Bundler automatically splits each page
 * into an independent code chunk.
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/guide/routing/common-router-tasks#lazy-loading
 * -----------------------------------------------------------------------------
 */

export const routes: Routes = [
  {
    path: '',
    title: 'NovaStore - Modern Angular Catalog',
    loadComponent: () =>
      import('./features/products/pages/product-list/product-list.component').then(
        m => m.ProductListComponent
      )
  },
  {
    path: 'products/:id',
    title: 'Product Details - NovaStore',
    loadComponent: () =>
      import('./features/products/pages/product-detail/product-detail.component').then(
        m => m.ProductDetailComponent
      )
  },
  {
    path: 'cart',
    title: 'Shopping Bag - NovaStore',
    loadComponent: () =>
      import('./features/cart/pages/cart-page/cart-page.component').then(
        m => m.CartPageComponent
      )
  },
  {
    path: 'checkout',
    title: 'Secure Checkout - NovaStore',
    loadComponent: () =>
      import('./features/checkout/pages/checkout-page/checkout-page.component').then(
        m => m.CheckoutPageComponent
      )
  },
  {
    path: 'checkout/success',
    title: 'Order Receipt - NovaStore',
    loadComponent: () =>
      import(
        './features/checkout/pages/order-confirmation/order-confirmation.component'
      ).then(m => m.OrderConfirmationComponent)
  },
  {
    path: 'orders',
    title: 'Order History & Tracking - NovaStore',
    loadComponent: () =>
      import('./features/orders/pages/past-orders/past-orders-page.component').then(
        m => m.PastOrdersPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
