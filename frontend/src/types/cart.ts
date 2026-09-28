interface CartItem {
  itemId: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  subtotal: number;
}

interface Cart {
  cartId: number;
  items: CartItem[];
  totalAmount: number;
}

export type { CartItem, Cart };