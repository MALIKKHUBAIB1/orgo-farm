import { apiGet } from "./api";
import { products as fallbackProducts, type Product } from "./products";

export function loadProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/api/products", fallbackProducts);
}