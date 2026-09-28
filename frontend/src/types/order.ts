interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED";

interface Order {
  orderId: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderCreateRequest {
  addressId: number;
}

export type {
  OrderItem,
  OrderStatus,
  PaymentStatus,
  Order,
  OrderCreateRequest,
};