import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { ProductResponseDto } from "../models/product-response.dto";
import { Product } from "../../domain/models/product";

export class ProductDtoMapper
  implements
    Mapper<Product, ProductResponseDto>,
    ReversedMapper<Product, ProductResponseDto>
{
  constructor() {}

  toObject(fromObject: Product): ProductResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      description: fromObject.description || "",
      price: fromObject.price || 0,
      stock: fromObject.stock || 0,
      category: fromObject.category || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: ProductResponseDto): Product {
    return new Product(
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

  toObjects(fromObjects: Product[]): ProductResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: ProductResponseDto[]): Product[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
