import { AuthDatasourceImpl } from "./datasources/auth.datasource.impl";
import { AuthRepositoryImpl } from "./repositories/auth.repository.impl";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthRoutes } from "./auth.routes";

import { ClinicDatasourceImpl } from "../clinic/datasources/clinic.datasource.impl";
import { ClinicRepositoryImpl } from "../clinic/repositories/clinic.repository.impl";
import { ClinicMapper } from "../clinic/domain/mappers/clinic.mapper";
import { ClinicService } from "../clinic/clinic.service";

import { EmployeeDatasourceImpl } from "../employee/datasources/employee.datasource.impl";
import { EmployeeRepositoryImpl } from "../employee/repositories/employee.repository.impl";
import { EmployeeMapper } from "../employee/domain/mappers/employee.mapper";
import { EmployeeService } from "../employee/employee.service";

const authDatasource = new AuthDatasourceImpl();
const authRepository = new AuthRepositoryImpl(authDatasource);

const clinicService = new ClinicService(
  new ClinicRepositoryImpl(new ClinicDatasourceImpl(), new ClinicMapper()),
);
const employeeService = new EmployeeService(
  new EmployeeRepositoryImpl(
    new EmployeeDatasourceImpl(),
    new EmployeeMapper(),
  ),
);

const authService = new AuthService(
  authRepository,
  clinicService,
  employeeService,
);
const authController = new AuthController(authService);
const authRoutes = new AuthRoutes(authController).router;

export { authRoutes };
