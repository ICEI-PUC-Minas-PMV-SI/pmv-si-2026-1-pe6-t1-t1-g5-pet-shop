import { ProductController } from "./product.controller";
import { ProductRoutes } from "./product.routes";
import { ProductService } from "./product.service";
import { ProductDatasourceImpl } from "./datasources/product.datasource.impl";
import { ProductRepositoryImpl } from "./repositories/product.repository.impl";
import { ProductMapper } from "./domain/mappers/product.mapper";
import { ProductDtoMapper } from "./dto/mappers/product-dto.mapper";

const datasource = new ProductDatasourceImpl();
const mapper = new ProductMapper();
const repository = new ProductRepositoryImpl(datasource, mapper);
const service = new ProductService(repository);
const dtoMapper = new ProductDtoMapper();
const controller = new ProductController(service, dtoMapper);

export const productRoutes = new ProductRoutes(controller).router;
