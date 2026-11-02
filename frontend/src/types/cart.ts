interface CartItem {
  itemId: number;
  productId: number;
  productName: string;
  price: number;
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