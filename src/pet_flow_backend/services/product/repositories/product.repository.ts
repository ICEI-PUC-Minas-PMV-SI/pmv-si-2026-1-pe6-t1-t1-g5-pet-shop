import { Product } from "../domain/models/product";

export interface ProductRepository {
  list(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
