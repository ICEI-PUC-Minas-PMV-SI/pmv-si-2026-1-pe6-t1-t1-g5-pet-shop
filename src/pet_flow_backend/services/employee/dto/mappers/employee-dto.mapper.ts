import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { EmployeeResponseDto } from "../models/employee-response.dto";
import { Employee } from "../../domain/models/employee";

export class EmployeeDtoMapper
  implements
    Mapper<Employee, EmployeeResponseDto>,
    ReversedMapper<Employee, EmployeeResponseDto>
{
  constructor() {}

  toObject(fromObject: Employee): EmployeeResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      cpf: fromObject.cpf || "",
      address: fromObject.address || "",
      phone: fromObject.phone || "",
      email: fromObject.email || "",
      role: fromObject.role || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: EmployeeResponseDto): Employee {
    return new Employee(
      toObject.id,
      toObject.name,
      toObject.cpf,
      toObject.address,
      toObject.phone,
      toObject.email,
      toObject.role,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: Employee[]): EmployeeResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: EmployeeResponseDto[]): Employee[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
