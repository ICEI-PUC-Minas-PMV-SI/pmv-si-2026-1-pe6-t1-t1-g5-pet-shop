import { ProductDatasource } from "../datasources/product.datasource";
import { ProductRepository } from "./product.repository";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly datasource: ProductDatasource) {}
}
