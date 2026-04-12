import { ClinicEntity } from "../../datasources/entities/clinic.entity";
import { Clinic } from "../models/clinic";

export class ClinicMapper {
  toObject(entity: ClinicEntity): Clinic {
    return new Clinic(
      entity.id ?? "",
      entity.name ?? "",
      entity.cnpj,
      entity.email,
      entity.phone,
      entity.address,
      entity.city,
      entity.state,
      entity.zip_code,
      entity.is_active,
      entity.created_at
    );
  }

  toObjects(entities: ClinicEntity[]): Clinic[] {
    return entities.map((e) => this.toObject(e));
  }

  toEntity(model: Partial<Clinic>): ClinicEntity {
    return {
      id: model.id,
      name: model.name || "",
      cnpj: model.cnpj,
      email: model.email,
      phone: model.phone,
      address: model.address,
      city: model.city,
      state: model.state,
      zip_code: model.zip_code,
      is_active: model.is_active,
      created_at: model.created_at ?? new Date().toISOString()
    };
  }
}