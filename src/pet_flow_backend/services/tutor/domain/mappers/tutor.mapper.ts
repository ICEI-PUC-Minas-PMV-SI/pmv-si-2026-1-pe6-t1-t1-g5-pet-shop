import { Tutor } from "../models/tutor"; // Pode ser que o VS Code peça para arrumar esse caminho
import { TutorEntity } from "../../datasources/entities/tutor.entity";

export class TutorMapper {
  
  toObject(fromObject: TutorEntity): Tutor {
    return new Tutor(
      fromObject.id,
      fromObject.name,
      fromObject.cpf,
      fromObject.address,
      fromObject.phone,
      fromObject.email,
      fromObject.clinic_id,
      fromObject.created_at,
      fromObject.updated_at
    );
  }

  toReversedObject(toObject: any): TutorEntity {
    return new TutorEntity(
      toObject.id,
      toObject.name,
      toObject.cpf,
      toObject.address,
      toObject.phone,
      toObject.email,
      toObject.clinic_id || toObject.clinicId,
      toObject.created_at || toObject.createdAt,
      toObject.updated_at || toObject.updatedAt
    );
  }

}