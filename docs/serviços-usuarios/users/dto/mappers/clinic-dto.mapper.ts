import { ClinicEntity } from "../../datasources/entities/clinic.entity";
import { Clinic } from "../../domain/models/clinic";

export class ClinicMapper {
  toObject(entity: ClinicEntity): Clinic {
    return new Clinic(entity.id, entity.name);
  }

  toObjects(entities: ClinicEntity[]): Clinic[] {
    return entities.map(e => this.toObject(e));
  }
}