import { ProductDatasource } from "../datasources/product.datasource";
import { ProductMapper } from "../domain/mappers/product.mapper";
import { Product } from "../domain/models/product";
import { ProductRepository } from "./product.repository";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    private readonly datasource: ProductDatasource,
    private readonly mapper: ProductMapper,
  ) {}

  async list(): Promise<Product[]> {
    try {
      const { data, error } = await this.datasource.getAll();
      if (error) return [];
      return this.mapper.toObjects(data || []);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getById(id: string): Promise<Product> {
    try {
      const { data, error } = await this.datasource.getById(id);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const entity = this.mapper.toReversedObject(product);
      const { data, error } = await this.datasource.create(entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const entity = this.mapper.toReversedObject(product as Product);
      const { data, error } = await this.datasource.update(id, entity);
      if (error) throw new Error(error.message);
      return this.mapper.toObject(data!);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.datasource.delete(id);
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
