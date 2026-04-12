import { supabaseExtensions } from "../../../shared/utils/supabase.extensions";

export class VaccineDatasourceImpl {
  private table = "vaccine"; // ⚠️ CONFERE NO SUPABASE

  async create(data: any) {
    return supabaseExtensions.insert(this.table, data);
  }

  async update(id: string, data: any) {
    return supabaseExtensions.update(this.table, id, data);
  }

  async delete(id: string) {
    return supabaseExtensions.delete(this.table, id);
  }

  async getAll() {
    return supabaseExtensions.getAll(this.table);
  }

  async getById(id: string) {
    return supabaseExtensions.getById(this.table, id);
  }
}