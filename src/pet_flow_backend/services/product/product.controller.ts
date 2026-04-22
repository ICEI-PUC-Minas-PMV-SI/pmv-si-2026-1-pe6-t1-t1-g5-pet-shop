import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { ProductDtoMapper } from "./dto/mappers/product-dto.mapper";

export class ProductController {
  constructor(
    private readonly service: ProductService,
    private readonly mapper: ProductDtoMapper,
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.service.listAllProducts();
      const response = this.mapper.toObjects(products);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await this.service.getProductById(id);
      const response = this.mapper.toObject(product);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: "Product not found" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.service.createProduct(req.body);
      const response = this.mapper.toObject(product);
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await this.service.updateProduct(id, req.body);
      const response = this.mapper.toObject(product);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
