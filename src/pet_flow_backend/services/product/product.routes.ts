import { Router } from "express";
import { ProductController } from "./product.controller";

export class ProductRoutes {
    public readonly router: Router = Router();

    constructor(private readonly controller: ProductController) {
        this.initRoutes();
    }

    private initRoutes(): void {
        // Define routes here
    }
}
