export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "ferticompost-cart";

export function formatPrice(amount: number): string {
  return `${amount.toFixed(0)} DH`;
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
