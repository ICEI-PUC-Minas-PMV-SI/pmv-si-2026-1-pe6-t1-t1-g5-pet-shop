import { ProductController } from "./product.controller";
import { ProductRoutes } from "./product.routes";
import { ProductService } from "./product.service";
import { ProductDatasourceImpl } from "./datasources/product.datasource.impl";
import { ProductRepositoryImpl } from "./repositories/product.repository.impl";

const datasource = new ProductDatasourceImpl();
const repository = new ProductRepositoryImpl(datasource);
const service = new ProductService(repository);
const controller = new ProductController(service);

export const productRoutes = new ProductRoutes(controller).router;
