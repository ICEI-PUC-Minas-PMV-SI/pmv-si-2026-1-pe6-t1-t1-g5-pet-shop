import { ClinicEntity } from "./entities/clinic.entity";
import { ClinicDatasource } from "./clinic.datasource";
import { DbResult } from "../../../shared/utils/supabase.extensions";
import { supabase } from "../../../../src/config/supabase";

export class ClinicDatasourceImpl implements ClinicDatasource {
  
  async insert(clinic: ClinicEntity): Promise<DbResult<ClinicEntity>> {
    const { data, error } = await supabase
      .from('clinic')
      .insert(clinic)
      .select()
      .single();

    return { data, error };
  }

  async getAll(): Promise<DbResult<ClinicEntity[]>> {
    const { data, error } = await supabase
      .from('clinic')
      .select('*');

    return { data, error };
  }

  async update(id: string, clinic: Partial<ClinicEntity>): Promise<DbResult<ClinicEntity>> {
    const { data, error } = await supabase
      .from('clinic')
      .update(clinic)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  // ✅ FALTAVA ESSE
  async delete(id: string): Promise<DbResult<null>> {
    const { error } = await supabase
      .from('clinic')
      .delete()
      .eq('id', id);

    return { data: null, error };
  }
}