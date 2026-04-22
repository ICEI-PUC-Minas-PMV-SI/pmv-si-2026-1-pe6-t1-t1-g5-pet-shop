import { ProductEntity } from "./entities/product.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface ProductDatasource {
  getAll(): Promise<DbResult<ProductEntity[]>>;
  getById(id: string): Promise<DbResult<ProductEntity>>;
  create(product: ProductEntity): Promise<DbResult<ProductEntity>>;
  update(
    id: string,
    product: Partial<ProductEntity>,
  ): Promise<DbResult<ProductEntity>>;
  delete(id: string): Promise<DbResult<null>>;
}
