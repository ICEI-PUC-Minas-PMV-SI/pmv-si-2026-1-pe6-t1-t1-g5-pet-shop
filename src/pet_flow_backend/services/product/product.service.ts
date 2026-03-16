import { ProductRepository } from "./repositories/product.repository";

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}
}
