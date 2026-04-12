import { supabase } from "../../../shared/config/supabase";
import { ClinicDatasource } from "./clinic.datasource";

export class ClinicDatasourceImpl implements ClinicDatasource {
  async getAll(): Promise<any> {
    const { data, error } = await supabase
      .from("clinics")
      .select("*");

    if (error) throw new Error(error.message);

    return data;
  }
}