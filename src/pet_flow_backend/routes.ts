import { Router } from "express";
import { clinicRoutes } from "./services/clinic";
import { employeeRoutes } from "./services/employee";
import { financialRoutes } from "./services/financial";
import { petRoutes } from "./services/pet";
import { productRoutes } from "./services/product";
import { schedulingRoutes } from "./services/scheduling";
import { serviceRoutes } from "./services/service";
import { tutorRoutes } from "./services/tutor";
import { vaccineRoutes } from "./services/vaccine";
import { authRoutes } from "./services/auth";

export class AppRouter {
  public readonly router: Router = Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.use("/clinic", clinicRoutes);
    this.router.use("/employee", employeeRoutes);
    this.router.use("/financial", financialRoutes);
    this.router.use("/pet", petRoutes);
    this.router.use("/product", productRoutes);
    this.router.use("/scheduling", schedulingRoutes);
    this.router.use("/service", serviceRoutes);
    this.router.use("/tutor", tutorRoutes);
    this.router.use("/vaccine", vaccineRoutes);
    this.router.use("/auth", authRoutes);
  }

  // Method to add individual routes manually or centralized
  public use(path: string, router: Router): void {
    this.router.use(path, router);
  }
}
