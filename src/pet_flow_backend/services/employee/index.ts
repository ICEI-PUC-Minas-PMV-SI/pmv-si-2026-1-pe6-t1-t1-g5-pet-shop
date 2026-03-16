import { EmployeeController } from "./employee.controller";
import { EmployeeRoutes } from "./employee.routes";
import { EmployeeService } from "./employee.service";
import { EmployeeDatasourceImpl } from "./datasources/employee.datasource.impl";
import { EmployeeRepositoryImpl } from "./repositories/employee.repository.impl";

const datasource = new EmployeeDatasourceImpl();
const repository = new EmployeeRepositoryImpl(datasource);
const service = new EmployeeService(repository);
const controller = new EmployeeController(service);

export const employeeRoutes = new EmployeeRoutes(controller).router;
