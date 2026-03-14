import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { EmployeeEntity } from "../../datasources/entities/employee.entity";
import { Employee } from "../models/employee";

export class EmployeeMapper
  implements
    Mapper<EmployeeEntity, Employee>,
    ReversedMapper<EmployeeEntity, Employee>
{
  constructor() {}

  toObject(fromObject: EmployeeEntity): Employee {
    return new Employee(
      fromObject.id,
      fromObject.name,
      fromObject.cpf,
      fromObject.address,
      fromObject.phone,
      fromObject.email,
      fromObject.role,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: Employee): EmployeeEntity {
    return new EmployeeEntity(
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

  toObjects(fromObjects: EmployeeEntity[]): Employee[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: Employee[]): EmployeeEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
