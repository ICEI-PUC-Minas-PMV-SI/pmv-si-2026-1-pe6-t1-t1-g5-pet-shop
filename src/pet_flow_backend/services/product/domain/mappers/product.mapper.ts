import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { ProductEntity } from "../../datasources/entities/product.entity";
import { Product } from "../models/product";

export class ProductMapper
  implements
    Mapper<ProductEntity, Product>,
    ReversedMapper<ProductEntity, Product>
{
  constructor() {}

  toObject(fromObject: ProductEntity): Product {
    return new Product(
      fromObject.id,
      fromObject.name,
      fromObject.description,
      fromObject.price,
      fromObject.stock,
      fromObject.category,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Product): ProductEntity {
    return new ProductEntity(
      toObject.id,
      toObject.name,
      toObject.description,
      toObject.price,
      toObject.stock,
      toObject.category,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: ProductEntity[]): Product[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Product[]): ProductEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
