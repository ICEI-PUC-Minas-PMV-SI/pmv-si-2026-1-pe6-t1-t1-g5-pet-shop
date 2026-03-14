import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { VaccineResponseDto } from "../models/vaccine-response.dto";
import { Vaccine } from "../../domain/models/vaccine";

export class VaccineDtoMapper
  implements
    Mapper<Vaccine, VaccineResponseDto>,
    ReversedMapper<Vaccine, VaccineResponseDto>
{
  constructor() {}

  toObject(fromObject: Vaccine): VaccineResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      description: fromObject.description || "",
      batch: fromObject.batch || "",
      expirationDate: fromObject.expirationDate || new Date(),
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: VaccineResponseDto): Vaccine {
    return new Vaccine(
      toObject.id,
      toObject.name,
      toObject.description,
      toObject.batch,
      toObject.expirationDate,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: Vaccine[]): VaccineResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: VaccineResponseDto[]): Vaccine[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
