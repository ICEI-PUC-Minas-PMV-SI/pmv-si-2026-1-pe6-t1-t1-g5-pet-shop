import express from "express";
import { AppRouter } from "./routes";

// --- Imports de Clinic ---
import { ClinicDatasourceImpl } from "./services/clinic/datasources/clinic.datasource.impl";
import { ClinicMapper } from "./services/clinic/domain/mappers/clinic.mapper";
import { ClinicRepositoryImpl } from "./services/clinic/repositories/clinic.repository.impl";
import { ClinicService } from "./services/clinic/clinic.service";
import { ClinicController } from "./services/clinic/clinic.controller";
import { ClinicRoutes } from "./services/clinic/clinic.routes";

// --- Imports de Tutor ---
import { TutorDatasourceImpl } from "./services/tutor/datasources/tutor.datasource.impl";
import { TutorMapper } from "./services/tutor/domain/mappers/tutor.mapper";
import { TutorRepositoryImpl } from "./services/tutor/repositories/tutor.repository.impl";
import { TutorService } from "./services/tutor/tutor.service";
import { TutorController } from "./services/tutor/tutor.controller";
import { TutorRoutes } from "./services/tutor/tutor.routes";

// --- Imports de Pet ---
import { PetDatasourceImpl } from "./services/pet/datasources/pet.datasource.impl";
import { PetMapper } from "./services/pet/domain/mappers/pet.mapper";
import { PetRepositoryImpl } from "./services/pet/repositories/pet.repository.impl";
import { PetService } from "./services/pet/pet.service";
import { PetController } from "./services/pet/pet.controller";
import { PetRoutes } from "./services/pet/pet.routes";

const app = express();
app.use(express.json());

// --- Instância de Clinic ---
const clinicDatasource = new ClinicDatasourceImpl();
const clinicMapper = new ClinicMapper();
const clinicRepository = new ClinicRepositoryImpl(clinicDatasource as any, clinicMapper as any);
const clinicService = new ClinicService(clinicRepository as any);
const clinicController = new ClinicController(clinicService as any);

// --- Instância de Tutor ---
const tutorDatasource = new TutorDatasourceImpl();
const tutorMapper = new TutorMapper();
const tutorRepository = new TutorRepositoryImpl(tutorDatasource as any, tutorMapper as any);
const tutorService = new TutorService(tutorRepository as any);
const tutorController = new TutorController(tutorService as any);

// --- Instância de Pet ---
const petDatasource = new PetDatasourceImpl();
const petMapper = new PetMapper();
const petRepository = new PetRepositoryImpl(petDatasource as any, petMapper as any);
const petService = new PetService(petRepository as any);
const petController = new PetController(petService as any);

// --- Configuração das Rotas ---
const router = new AppRouter();

// Registrando os recursos no roteador
router.use("/clinics", new ClinicRoutes(clinicController).router);
router.use("/tutors", new TutorRoutes(tutorController).router);
router.use("/pets", new PetRoutes(petController).router);

// Prefixo global para a API
app.use("/api", router.router);

export default app;