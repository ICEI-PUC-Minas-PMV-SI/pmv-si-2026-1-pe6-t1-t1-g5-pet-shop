import { supabase } from '../../../shared/config/supabase';
import { Employee } from '../domain/models/employee';

export class EmployeeRepositoryImpl {

  async list() {
  const { data, error } = await supabase
    .from('employees')
    .select('*');

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) throw new Error(error.message);
  return data;
}

  async getById(id: string): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data as Employee;
  }

  async create(employee: Employee): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select();

    if (error) throw new Error(error.message);
    return data[0] as Employee;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}