/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Order & Shipping Data Models
 * -----------------------------------------------------------------------------
 * Used in both the Signal Forms checkout module and the @ngrx/signals PastOrdersStore.
 * -----------------------------------------------------------------------------
 */

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
}

export type PaymentMethod = 'card' | 'upi' | 'cod';
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
}
