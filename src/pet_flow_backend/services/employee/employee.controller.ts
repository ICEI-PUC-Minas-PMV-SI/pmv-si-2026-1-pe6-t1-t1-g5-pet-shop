import { EmployeeService } from "./employee.service";

export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}
}
