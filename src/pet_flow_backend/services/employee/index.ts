import { EmployeeController } from "./employee.controller";
import { EmployeeRoutes } from "./employee.routes";
import { EmployeeService } from "./employee.service";
import { EmployeeDatasourceImpl } from "./datasources/employee.datasource.impl";
import { EmployeeRepositoryImpl } from "./repositories/employee.repository.impl";
import { EmployeeMapper } from "./domain/mappers/employee.mapper";
import { EmployeeDtoMapper } from "./dto/mappers/employee-dto.mapper";

const datasource = new EmployeeDatasourceImpl();
const mapper = new EmployeeMapper();
const repository = new EmployeeRepositoryImpl(datasource, mapper);
const service = new EmployeeService(repository);
const dtoMapper = new EmployeeDtoMapper();
const controller = new EmployeeController(service, dtoMapper);

export const employeeRoutes = new EmployeeRoutes(controller).router;

