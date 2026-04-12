export interface TutorDatasource {
  create(data: any): Promise<{ data: any; error: any }>;
  delete(id: string): Promise<{ error: any }>;
  findById(id: string): Promise<{ data: any; error: any }>;
  getAll(): Promise<{ data: any[] | null; error: any }>;

  // ✅ NOVO
  update(id: string, data: any): Promise<{ data: any; error: any }>;
}