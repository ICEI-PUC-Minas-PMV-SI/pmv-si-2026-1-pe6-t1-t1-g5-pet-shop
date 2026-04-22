import { ProductDatasource } from "./product.datasource";
import { ProductEntity } from "./entities/product.entity";
import {
  supabaseExtensions,
  DbResult,
} from "../../../shared/utils/supabase.extensions";

export class ProductDatasourceImpl implements ProductDatasource {
  private readonly table = "products";

  async getAll(): Promise<DbResult<ProductEntity[]>> {
    return supabaseExtensions.getAll<ProductEntity>(this.table);
  }

  async getById(id: string): Promise<DbResult<ProductEntity>> {
    return supabaseExtensions.getById<ProductEntity>(this.table, id);
  }

  async create(product: ProductEntity): Promise<DbResult<ProductEntity>> {
    return supabaseExtensions.create<ProductEntity>(this.table, product);
  }

  async update(
    id: string,
    product: Partial<ProductEntity>,
  ): Promise<DbResult<ProductEntity>> {
    return supabaseExtensions.update<ProductEntity>(this.table, id, product);
  }

  async delete(id: string): Promise<DbResult<null>> {
    return supabaseExtensions.delete(this.table, id);
  }
}
