import { ProductRepository } from "./repositories/product.repository";
import { Product } from "./domain/models/product";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async listAllProducts(): Promise<Product[]> {
    return this.repository.list();
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.getById(id);
  }

  async createProduct(data: Product): Promise<Product> {
    return this.repository.create(data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    if (!id) throw new Error("ID é obrigatório");
    return this.repository.delete(id);
  }
}
