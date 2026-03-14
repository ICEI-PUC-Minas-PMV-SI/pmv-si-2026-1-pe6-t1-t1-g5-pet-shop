import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { TutorResponseDto } from "../models/tutor-response.dto";
import { Tutor } from "../../domain/models/tutor";

export class TutorDtoMapper
  implements
    Mapper<Tutor, TutorResponseDto>,
    ReversedMapper<Tutor, TutorResponseDto>
{
  constructor() {}

  toObject(fromObject: Tutor): TutorResponseDto {
    return {
      id: fromObject.id || "",
      name: fromObject.name || "",
      cpf: fromObject.cpf || "",
      address: fromObject.address || "",
      phone: fromObject.phone || "",
      email: fromObject.email || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(toObject: TutorResponseDto): Tutor {
    return new Tutor(
      toObject.id,
      toObject.name,
      toObject.cpf,
      toObject.address,
      toObject.phone,
      toObject.email,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: Tutor[]): TutorResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(toObjects: TutorResponseDto[]): Tutor[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
