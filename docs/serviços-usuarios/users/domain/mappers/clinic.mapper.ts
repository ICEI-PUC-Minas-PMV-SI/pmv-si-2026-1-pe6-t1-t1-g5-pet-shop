import { Clinic } from "../models/clinic";

export class ClinicMapper {
  toObject(data: any): Clinic {
    return new Clinic(data.id, data.name);
  }

  toObjects(data: any[]): Clinic[] {
    return data.map(d => this.toObject(d));
  }
}