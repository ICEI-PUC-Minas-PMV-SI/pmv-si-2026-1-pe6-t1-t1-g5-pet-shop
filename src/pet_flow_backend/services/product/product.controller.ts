import { ProductService } from "./product.service";

export class ProductController {
  constructor(private readonly service: ProductService) {}
}
