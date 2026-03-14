import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { ClinicResponseDto } from "../models/clinic-response.dto";
import { Clinic } from "../../domain/models/clinic";

export class ClinicDtoMapper
  implements
    Mapper<Clinic, ClinicResponseDto>,
    ReversedMapper<Clinic, ClinicResponseDto>
{
  constructor() {}

  toObject(fromObject: Clinic): ClinicResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      cnpj: fromObject.cnpj || "",
      address: fromObject.address || "",
      phone: fromObject.phone || "",
      email: fromObject.email || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: ClinicResponseDto): Clinic {
    return new Clinic(
      toObject.id,
      toObject.name,
      toObject.cnpj,
      toObject.address,
      toObject.phone,
      toObject.email,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: Clinic[]): ClinicResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: ClinicResponseDto[]): Clinic[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
