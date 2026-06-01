import { TutorController } from "./tutor.controller";
import { TutorRoutes } from "./tutor.routes";
import { TutorService } from "./tutor.service";
import { TutorDatasourceImpl } from "./datasources/tutor.datasource.impl";
import { TutorRepositoryImpl } from "./repositories/tutor.repository.impl";
import { TutorMapper } from "./domain/mappers/tutor.mapper";
import { TutorDtoMapper } from "./dto/mappers/tutor-dto.mapper";
import { EmployeeService } from "../employee/employee.service";
import { EmployeeRepositoryImpl } from "../employee/repositories/employee.repository.impl";
import { EmployeeDatasourceImpl } from "../employee/datasources/employee.datasource.impl";
import { EmployeeMapper } from "../employee/domain/mappers/employee.mapper";

const datasource = new TutorDatasourceImpl();
const mapper = new TutorMapper();
const repository = new TutorRepositoryImpl(datasource, mapper);
const service = new TutorService(repository);
const dtoMapper = new TutorDtoMapper();

const employeeDatasource = new EmployeeDatasourceImpl();
const employeeMapper = new EmployeeMapper();
const employeeRepository = new EmployeeRepositoryImpl(
  employeeDatasource,
  employeeMapper,
);
const employeeService = new EmployeeService(employeeRepository);

const controller = new TutorController(service, dtoMapper, employeeService);

export const tutorRoutes = new TutorRoutes(controller).router;
