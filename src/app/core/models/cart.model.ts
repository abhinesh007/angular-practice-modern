import { Product } from './product.model';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Cart Data Models
 * -----------------------------------------------------------------------------
 * Represents item state stored in the signal-based CartStore.
 * -----------------------------------------------------------------------------
 */

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  grandTotal: number;
}
