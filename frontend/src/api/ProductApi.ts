import { apiClient } from "./client";
import type { Product } from "../types/product";

const getProducts = async () => {
    const response = await apiClient.get<Product[]>("/api/products");

    return response.data;
};

const getProductById = async (productId: number) => {
    const response = await apiClient.get<Product>(`/api/products/${productId}`);

    return response.data;
};

export {getProducts, getProductById}