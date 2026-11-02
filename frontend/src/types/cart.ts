interface CartItem {
  itemId: number;
  productId: number;
  productName: string;
  price: number; // Effective price (discounted when available)
  originalPrice?: number | null;
  imageUrl: string | null;
  quantity: number;
  subtotal: number;
  stock?: number;
}

interface Cart {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
}

export type { CartItem, Cart };