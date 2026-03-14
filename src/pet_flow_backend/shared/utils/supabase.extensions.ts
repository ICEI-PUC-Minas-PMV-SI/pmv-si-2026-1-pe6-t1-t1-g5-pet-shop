import { SupabaseClient, PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../config/supabase";

export interface DbResult<T> {
    data: T | null;
    error: PostgrestError | null;
}

export class SupabaseExtensions {
    private client: SupabaseClient;

    constructor() {
        this.client = supabase;
    }

    /**
     * Get all records from a table
     */
    async getAll<T>(table: string): Promise<DbResult<T[]>> {
        const { data, error } = await this.client.from(table).select("*");
        return { data: data as T[], error };
    }

    /**
     * Get a record by ID
     */
    async getById<T>(table: string, id: string | number): Promise<DbResult<T>> {
        const { data, error } = await this.client
            .from(table)
            .select("*")
            .eq("id", id)
            .single();
        return { data: data as T, error };
    }

    /**
     * Create a new record
     */
    async create<T>(table: string, payload: any): Promise<DbResult<T>> {
        const { data, error } = await this.client
            .from(table)
            .insert(payload)
            .select()
            .single();
        return { data: data as T, error };
    }

    /**
     * Update an existing record
     */
    async update<T>(
        table: string,
        id: string | number,
        payload: any,
    ): Promise<DbResult<T>> {
        const { data, error } = await this.client
            .from(table)
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        return { data: data as T, error };
    }

    /**
     * Delete a record by ID
     */
    async delete(table: string, id: string | number): Promise<DbResult<null>> {
        const { error } = await this.client.from(table).delete().eq("id", id);
        return { data: null, error };
    }

    /**
     * Custom query execution
     */
    async findByColumn<T>(
        table: string,
        column: string,
        value: any,
    ): Promise<DbResult<T[]>> {
        const { data, error } = await this.client
            .from(table)
            .select("*")
            .eq(column, value);
        return { data: data as T[], error };
    }
}

export const supabaseExtensions = new SupabaseExtensions();
