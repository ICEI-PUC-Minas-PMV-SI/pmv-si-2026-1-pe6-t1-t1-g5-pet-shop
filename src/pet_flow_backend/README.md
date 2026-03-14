# Pet Flow Backend - Architecture & Implementation Guide

Welcome to the **Pet Flow Backend**. This project is built with Node.js, TypeScript, and Supabase, following a clean, layered architecture to ensure scalability and maintainability.

## 🏗️ Architecture Overview

The backend is organized into **Services**. Each service represents a specific domain area (e.g., Clinic, Pet, Tutor) and follows a strictly layered structure:

### Layered Folders (Inside each Service)

| Folder | Responsibility |
| :--- | :--- |
| **datasources/** | Low-level data access. Directly interacts with Supabase. |
| **datasources/entities/** | Database schema definitions (Type definitions for Supabase tables). |
| **domain/models/** | Core business objects. Pure logic, independent of the database. |
| **domain/mappers/** | Logic to convert between **Entities** (DB) and **Models** (Domain). |
| **repositories/** | The "Glue". Abstracts data sources to provide the Domain with data. |
| **dto/models/** | Data Transfer Objects. Defines what the API returns (Response) or receives (Request). |
| **dto/mappers/** | Logic to convert between **Models** (Domain) and **DTOs** (API). |
| **clinic.service.ts** | Orchestrates business logic across repositories. |
| **clinic.controller.ts** | Handles HTTP requests and interacts with the service layer. |
| **clinic.routes.ts** | Defines API endpoints. |

---

## 🔍 Implementation Blueprints (Example: `Clinic`)

Use these patterns as a template when implementing any new service or feature.

### 1. Datasource Layer
Datasources are responsible for raw database operations. Use `SupabaseExtensions` to simplify code.

**Interface (`datasources/clinic.datasource.ts`):**
```typescript
import { ClinicEntity } from "./entities/clinic.entity";
import { DbResult } from "../../../shared/utils/supabase.extensions";

export interface ClinicDatasource {
  getAll(): Promise<DbResult<ClinicEntity[]>>;
  getById(id: string): Promise<DbResult<ClinicEntity>>;
  create(clinic: Partial<ClinicEntity>): Promise<DbResult<ClinicEntity>>;
}
```

**Implementation (`datasources/clinic.datasource.impl.ts`):**
```typescript
import { ClinicDatasource } from "./clinic.datasource";
import { ClinicEntity } from "./entities/clinic.entity";
import { supabaseExtensions, DbResult } from "../../../shared/utils/supabase.extensions";

export class ClinicDatasourceImpl implements ClinicDatasource {
  private readonly table = "clinics";

  async getAll(): Promise<DbResult<ClinicEntity[]>> {
    return supabaseExtensions.getAll<ClinicEntity>(this.table);
  }
  // ... implement other methods using supabaseExtensions
}
```

### 2. Repository Layer
Repositories handle the transformation between database entities and application domain models.

**Interface (`repositories/clinic.repository.ts`):**
```typescript
import { Clinic } from "../domain/models/clinic";

export interface ClinicRepository {
  getClinics(): Promise<Clinic[]>;
}
```

**Implementation (`repositories/clinic.repository.impl.ts`):**
```typescript
import { ClinicRepository } from "./clinic.repository";
import { ClinicDatasource } from "../datasources/clinic.datasource";
import { ClinicMapper } from "../domain/mappers/clinic.mapper";
import { Clinic } from "../domain/models/clinic";

export class ClinicRepositoryImpl implements ClinicRepository {
  constructor(
    private readonly datasource: ClinicDatasource,
    private readonly mapper: ClinicMapper
  ) {}

  async getClinics(): Promise<Clinic[]> {
    const { data, error } = await this.datasource.getAll();
    if (error) throw new Error(error.message);
    return this.mapper.toObjects(data || []);
  }
}
```

### 3. Service Layer
Services contain the high-level business logic and coordinate one or more repositories.

**Implementation (`clinic.service.ts`):**
```typescript
import { ClinicRepository } from "./repositories/clinic.repository";
import { Clinic } from "./domain/models/clinic";

export class ClinicService {
  constructor(private readonly repository: ClinicRepository) {}

  async listAllClinics(): Promise<Clinic[]> {
    return this.repository.getClinics();
  }
}
```

### 4. Controller Layer
Controllers handle HTTP semantics, extract parameters, and map Domain Models to DTO Responses.

**Implementation (`clinic.controller.ts`):**
```typescript
import { Request, Response } from "express";
import { ClinicService } from "./clinic.service";
import { ClinicDtoMapper } from "./dto/mappers/clinic-dto.mapper";

export class ClinicController {
  constructor(
    private readonly service: ClinicService,
    private readonly mapper: ClinicDtoMapper
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const clinics = await this.service.listAllClinics();
      const response = this.mapper.toObjects(clinics);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
```

### 5. Routes Layer
Routes define the entry points and connect URLs to Controller methods.

**Implementation (`clinic.routes.ts`):**
```typescript
import { Router } from "express";
import { ClinicController } from "./clinic.controller";

export class ClinicRoutes {
  public readonly router: Router = Router();

  constructor(private readonly controller: ClinicController) {
    this.initRoutes();
  }

  private initRoutes(): void {
    // List all
    this.router.get("/", (req, res) => this.controller.list(req, res));

    // Get specific
    this.router.get("/:id", (req, res) => this.controller.getById(req, res));

    // Create
    this.router.post("/", (req, res) => this.controller.create(req, res));

    // Update
    this.router.put("/:id", (req, res) => this.controller.update(req, res));

    // Delete
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
  }
}
```

### 6. App Integration
To keep `app.ts` clean, use a centralized **AppRouter**.

**2. Register services in `app.ts`:**
```typescript
import express from "express";
import { AppRouter } from "./routes";
import { ClinicRoutes } from "./services/clinic/clinic.routes";

const app = express();
const appRouter = new AppRouter();

// Mount service routes
appRouter.use("/clinics", new ClinicRoutes(clinicController).router);
appRouter.use("/pets", new PetRoutes(petController).router);

app.use("/api", appRouter.router);
```

---

## 🛠️ Shared Utilities

-   **`SupabaseExtensions`** (`shared/utils/supabase.extensions.ts`): Standardized CRUD methods.
-   **`Validators`** (`shared/utils/validators.ts`): Reusable logical validators.
-   **`Mapper` Interface**: Standardizes data transformation.

---

## 🚦 Quality Control

-   **Linting**: `npm run lint`
-   **Type Safety**: `npx tsc --noEmit`
-   **Git Hooks**: Automatic `pre-push` check.
