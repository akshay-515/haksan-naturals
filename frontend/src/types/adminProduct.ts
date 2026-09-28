interface AdminProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export type { AdminProductRequest };