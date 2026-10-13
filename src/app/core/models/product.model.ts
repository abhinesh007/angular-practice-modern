/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: TypeScript Domain Models & Strict Typing
 * -----------------------------------------------------------------------------
 *
 * ❓ WHAT IT IS:
 * Clean, immutable interfaces representing domain entities across signals,
 * services, and UI components.
 *
 * 💡 WHY THIS DESIGN:
 * Modern Angular (v18-v22) with TypeScript strict mode benefits tremendously
 * from exact typings: signals like `signal<Product[]>()` and `computed()`
 * infer types flawlessly across the reactive graph without type assertions.
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/style-guide
 * -----------------------------------------------------------------------------
 */

export interface ProductSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: string;
  rating: number;
  ratingCount: number;
  inStock: boolean;
  stockCount: number;
  badge?: string;
  imageUrl: string;
  gallery: string[];
  specs: ProductSpecs;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
