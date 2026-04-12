import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export interface DbResult<T> {
  data: T | null;
  error: any;
}

export const supabaseExtensions = {
  // Busca todos os registros de uma tabela
  async getAll<T>(table: string): Promise<DbResult<T[]>> {
    const { data, error } = await supabase
      .from(table)
      .select("*");

    return { 
      data: data as T[] | null, 
      error 
    };
  },

  // Busca um registro específico pelo ID
  async getById<T>(table: string, id: string): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    return { 
      data: data as T | null, 
      error 
    };
  },

  // Insere um novo registro
  async insert<T>(table: string, payload: any): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    return { 
      data: data as T | null, 
      error 
    };
  },

  // Atualiza um registro existente
  async update<T>(table: string, id: string, payload: any): Promise<DbResult<T>> {
    const { data, error } = await supabase
      .from(table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    return { 
      data: data as T | null, 
      error 
    };
  },

  // Remove um registro
  async delete(table: string, id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    return { error };
  }
};