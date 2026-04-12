import { Vaccine } from "../models/vaccine";
import { VaccineEntity } from "../../datasources/entities/vaccine.entity";

export class VaccineMapper {
  toEntity(model: Vaccine): VaccineEntity {
    return { ...model };
  }

  toObject(entity: VaccineEntity): Vaccine {
    return { ...entity };
  }

  toObjects(entities: VaccineEntity[]): Vaccine[] {
    return entities.map(e => this.toObject(e));
  }
}