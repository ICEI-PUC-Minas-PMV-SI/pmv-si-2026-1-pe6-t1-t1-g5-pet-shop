import { EmployeeRepository } from "./repositories/employee.repository";

export class EmployeeService {
  constructor(private readonly repository: EmployeeRepository) {}
}
