# NovaStore — Modern Angular (v22 Zoneless & Signals)

[![Angular](https://img.shields.io/badge/Angular-22.x-dd0031?style=flat-square&logo=angular)](https://angular.dev)
[![Zoneless](https://img.shields.io/badge/Change%20Detection-Stable%20Zoneless-blueviolet?style=flat-square)](https://angular.dev/guide/experimental/zoneless)
[![State](https://img.shields.io/badge/State-Native%20Signals%20%2B%20%40ngrx%2Fsignals-38bdf8?style=flat-square)](https://ngrx.io/guide/signals)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%20Strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

A modern, production-grade E-Commerce showcase application built specifically for seasoned Angular engineers (v2–v15) looking to master the modern paradigms of **Angular v18 through v22**.

It demonstrates a 100% standalone, zoneless application with fine-grained reactive signals, dual-store state management, native signal-based forms, and compiler-level deferred loading (`@defer`).

---

## 📚 Deep-Dive Companion Guides

This repository includes two comprehensive architectural guides:

* 📋 **[PLAN.md](./PLAN.md)** — Architectural design blueprint, specifications, component schemas, and step-by-step roadmap.
* 🎓 **[Tutorial.md](./Tutorial.md)** — In-depth architectural tutorial with Mermaid sequence diagrams, data flow charts, zoneless scheduler mechanics, and a seasoned developer's Rosetta Stone.

### 🔗 Quick Links to Guide Sections

| Topic | [PLAN.md](./PLAN.md) Reference | [Tutorial.md](./Tutorial.md) Reference |
| :--- | :--- | :--- |
| **Mental Model & Shifts** | [Executive Summary & Paradigm Shifts](./PLAN.md#1-executive-summary--paradigm-shifts-the-modern-angular-mindset) | [The Modern Mental Model](./Tutorial.md#1-executive-summary--the-modern-mental-model) |
| **Bootstrapping & Config** | [Technology Stack & Tooling](./PLAN.md#2-technology-stack--tooling) | [Bootstrapping & Config Walkthrough](./Tutorial.md#2-bootstrapping--application-configuration) |
| **Directory Architecture** | [Architecture & Directory Tree](./PLAN.md#3-architecture--project-directory-structure) | [Feature-Sliced Architecture & Layering](./Tutorial.md#3-architecture--feature-sliced-directory-structure) |
| **Core Signals (`signal`, `computed`, `effect`)** | [Shopping Cart Signal Store](./PLAN.md#feature-3-shopping-cart-architecture-reactive-signal-store) | [Core Signal Primitives Deep-Dive](./Tutorial.md#41-core-signal-primitives-signal-computed-effect) |
| **Component Primitives (`input`, `output`, `model`, `viewChild`)** | [Product Card & PDP Specs](./PLAN.md#feature-2-product-details-page-pdp) | [Functional Component Primitives](./Tutorial.md#42-functional-component-primitives-input-output-model-viewchild) |
| **Native Control Flow & `@defer`** | [Catalog & PDP Defer Views](./PLAN.md#feature-1-landing-page--product-catalog-catalog-shell) | [Control Flow & Deferred Loading](./Tutorial.md#43-native-control-flow--deferred-views-defer) |
| **Resource API (`rxResource`)** | [Product Data Access](./PLAN.md#feature-1-landing-page--product-catalog-catalog-shell) | [Resource API Async Data Fetching](./Tutorial.md#44-asynchronous-data-fetching-with-the-resource-api-rxresource) |
| **Dual State (`CartStore` vs `@ngrx/signals`)** | [Past Orders & NgRx Specs](./PLAN.md#feature-5-past-orders--order-history-demonstrating-ngrxsignals-signalstore) | [Dual State Management Architecture](./Tutorial.md#45-dual-state-management-architecture) |
| **Signal Forms** | [Shipping Form Specification](./PLAN.md#feature-4-checkout-flow--form-architecture-signal-forms-at-shipping) | [Signal-Driven Forms Implementation](./Tutorial.md#46-signal-driven-forms-zero-formgroup-overhead) |
| **Data & Communication Flows** | [Summary of Enforced Practices](./PLAN.md#8-summary-of-modern-best-practices-enforced) | [End-to-End E-Commerce Flowcharts](./Tutorial.md#5-communication--data-flow-diagrams) |
| **Zoneless Mechanics** | [Zoneless Evaluation](./PLAN.md#1-executive-summary--paradigm-shifts-the-modern-angular-mindset) | [How Zoneless Works Under the Hood](./Tutorial.md#6-zoneless-change-detection-mechanics) |
| **Old vs Modern Cheat Sheet** | [Paradigm Shift Cheat Sheet](./PLAN.md#paradigm-shift-cheat-sheet-legacy-vs-modern) | [The Seasoned Developer's Rosetta Stone](./Tutorial.md#7-the-seasoned-developers-rosetta-stone-old-vs-modern) |

---

## ⚡ Key Modern Paradigms in This Codebase

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Modern Angular 22 Engine                        │
├────────────────────────────┬───────────────────────────────────────────┤
│ Stable Zoneless CD         │ provideZonelessChangeDetection()          │
│                            │ Zero zone.js overhead / monkey-patching   │
├────────────────────────────┼───────────────────────────────────────────┤
│ Dual State Management      │ • Native Signals: CartStore               │
│                            │ • @ngrx/signals: PastOrdersStore          │
├────────────────────────────┼───────────────────────────────────────────┤
│ Declarative Async Data     │ rxResource() tied to reactive params()    │
│                            │ Replaces manual switchMap / AsyncPipe     │
├────────────────────────────┼───────────────────────────────────────────┤
│ Pure Signal Forms          │ createFormField() with computed errors    │
│                            │ Zero ReactiveFormsModule / FormGroup      │
├────────────────────────────┼───────────────────────────────────────────┤
│ Built-In Control Flow      │ @if, @for (...; track ...), @empty, @let  │
├────────────────────────────┼───────────────────────────────────────────┤
│ Fine-Grained Lazy Loading  │ @defer (on interaction) micro-chunking    │
└────────────────────────────┴───────────────────────────────────────────┘
```

---

## 🛍️ Application Features & Pages

1. **Product Catalog & Landing Page** (`/`):
   * Dynamic search bar with reactive signal queries.
   * Category filter pills (`Audio`, `Laptops`, `Wearables`, `Gaming`, `Accessories`).
   * Product cards with signal inputs (`input.required<Product>()`) and outputs (`output<Product>()`).
   * Built-in `@for` loop with `@empty` zero-results state.

2. **Product Details Page (PDP)** (`/products/:id`):
   * **Router Input Binding**: Route param `:id` automatically injected into `id = input.required<string>()` via `withComponentInputBinding()`.
   * **Signal Model**: Two-way quantity counter using `quantity = model<number>(1)`.
   * **Deferred Customer Reviews**: Heavy reviews component lazily loaded only on interaction using `@defer (on interaction(loadReviewsBtn))` with `@placeholder` and `@loading` shimmer skeletons.

3. **Shopping Bag** (`/cart`):
   * Backed by `CartStore` (`signal()`, `computed()`, `effect()`).
   * Line items table with quantity increment/decrement, deletion, and auto-sync to `localStorage`.
   * Promo code field (`MODERN20` for 20% off, `SAVE500` for flat ₹500 off).
   * Synchronous derived pricing: subtotal, discount, 18% GST, free shipping thresholds.

4. **Checkout Page** (`/checkout`):
   * **Signal Forms**: Shipping address validated using pure signal primitives with `@let` local template scoping.
   * Payment method selection (`Instant UPI`, `Credit/Debit`, `Cash on Delivery`).
   * Signal-based `viewChild.required(ShippingFormComponent)` query.
   * Submits order to mock backend, clears the cart, and routes to `/checkout/success`.

5. **Past Orders & Order Tracking** (`/orders`):
   * Powered by **`@ngrx/signals`** (`PastOrdersStore`).
   * Features `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, `rxMethod()`, and `withHooks({ onInit })`.
   * Real-time metrics banner (Total Orders count, Lifetime Spend).
   * Status filter buttons (`All`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
   * Order cancellation for active processing orders.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20+` or `v22+`
* **npm**: `v10+`

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start the Mock Backend (`json-server`)
Runs the REST API on port `3001` with products, categories, reviews, and pre-seeded orders:
```bash
npm run mock:api
```

### 3. Start the Angular Dev Server
In a separate terminal, launch the dev server:
```bash
npx ng serve --port 4300
```

Open your browser at **`http://localhost:4300`**.

---

## 🏗️ Project Architecture Map

```text
src/app/
├── core/                           # Singletons, layout shells, global contracts
│   ├── layout/
│   │   ├── navbar/                 # Signal-driven navbar with cart badge
│   │   └── footer/                 # Modern footer
│   ├── models/                     # Strongly-typed domain models (Product, Cart, Order)
│   └── services/                   # Signal-based global ToastService
│
├── features/                       # Domain slices
│   ├── products/                   # Catalog, PDP, reviews, ProductService, rxResource
│   ├── cart/                       # Native Signal Store (CartStore) & Cart Page
│   ├── checkout/                   # Signal Forms ShippingForm, CheckoutPage, Confirmation
│   └── orders/                     # @ngrx/signals PastOrdersStore & PastOrdersPage
│
├── shared/                         # Cross-cutting UI primitives & utilities
│   ├── forms/                      # createFormField() & functional validators
│   ├── pipes/                      # Standalone InrPipe
│   └── ui/                         # ToastComponent
│
├── app.config.ts                   # provideZonelessChangeDetection, provideRouter, provideHttpClient
├── app.routes.ts                   # Lazy standalone loadComponent routes
└── styles.css                      # Tailwind CSS v4 design tokens and keyframe animations
```

---

## 📊 Build & Bundle Performance

A production build compiles in **under 3 seconds** with zero `zone.js` dependencies:

```bash
Initial chunk files | Names                        |  Raw size | Estimated transfer size
styles-XZJWIO6H.css | styles                       |  56.74 kB |                 7.30 kB
main-QMGV3XCJ.js    | main                         |   9.33 kB |                 2.71 kB
                    | Initial total (NO zone.js!)  | 352.63 kB |                90.55 kB

Lazy chunk files:
- checkout-page-component:      15.89 kB
- past-orders-page-component:   13.09 kB
- product-list-component:       12.81 kB
- product-detail-component:     11.38 kB
- cart-page-component:           9.24 kB
- product-reviews-component:     4.74 kB  <-- @defer on interaction micro-chunk
- order-confirmation-component:  4.43 kB
```

---

## 📄 License & Author

Developed by **Abhinesh Gour** as an advanced practical reference for Modern Angular.
Licensed under the [MIT License](LICENSE).
