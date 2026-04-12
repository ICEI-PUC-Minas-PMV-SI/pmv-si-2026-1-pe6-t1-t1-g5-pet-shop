import { TutorEntity } from "../../datasources/entities/tutor.entity";
import { Tutor } from "../models/tutor";

export class TutorMapper {

  toObject(entity: TutorEntity): Tutor {
    return new Tutor(
      entity.id,
      entity.name,
      entity.cpf,
      entity.email,
      entity.clinic_id
    );
  }

  toEntity(model: Tutor): TutorEntity {
    return {
      id: model.id,
      name: model.name,
      cpf: model.cpf,
      email: model.email,
      clinic_id: model.clinic_id
    };
  }

}