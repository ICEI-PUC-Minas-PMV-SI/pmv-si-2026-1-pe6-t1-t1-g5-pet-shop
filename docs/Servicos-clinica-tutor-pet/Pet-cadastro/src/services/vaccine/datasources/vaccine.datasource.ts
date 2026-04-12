import { VaccineEntity } from "./entities/vaccine.entity";

export interface VaccineDatasource {
  create(data: VaccineEntity): Promise<{ data: VaccineEntity | null; error: any }>;
  update(id: string, data: VaccineEntity): Promise<{ data: VaccineEntity | null; error: any }>;
  delete(id: string): Promise<{ error: any }>;
  getAll(): Promise<{ data: VaccineEntity[] | null; error: any }>;
  getById(id: string): Promise<{ data: VaccineEntity | null; error: any }>;
}