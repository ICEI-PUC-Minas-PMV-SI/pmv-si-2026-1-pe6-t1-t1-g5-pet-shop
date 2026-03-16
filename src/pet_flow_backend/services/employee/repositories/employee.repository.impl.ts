import { EmployeeDatasource } from "../datasources/employee.datasource";
import { EmployeeRepository } from "./employee.repository";

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(private readonly datasource: EmployeeDatasource) {}
}
