import { supabaseExtensions } from "../../../shared/utils/supabase.extensions";

export class PetDatasourceImpl {
  private table = "pet"; // ✅ CORRIGIDO (era "pet")

  async create(data: any) {
    return supabaseExtensions.insert(this.table, data);
  }

  async delete(id: string) {
    return supabaseExtensions.delete(this.table, id);
  }

  async getAll() {
    return supabaseExtensions.getAll(this.table);
  }

  async findById(id: string) {
    return supabaseExtensions.getById(this.table, id);
  }

  // ✅ NOVO
  async update(id: string, data: any) {
    return supabaseExtensions.update(this.table, id, data);
  }
}