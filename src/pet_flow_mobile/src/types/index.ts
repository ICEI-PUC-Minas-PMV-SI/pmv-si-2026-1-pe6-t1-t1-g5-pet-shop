export interface AuthResponse {
  user_id: string;
  token: string;
  refresh_token: string;
  clinic_id?: string;
}

export interface SessionData {
  token: string;
  userId: string;
  clinicId: string;
  name: string;
  role: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  clinicId: string;
}

export interface Transaction {
  id: string;
  scheduling_id: string;
  description: string;
  amount: number;
  payment_method: string;
  employee_id: string;
  clinic_id: string;
  created_at: string;
}

export interface CreateTransactionPayload {
  scheduling_id?: string;
  description: string;
  amount: number;
  payment_method: string;
  employee_id?: string;
  clinic_id: string;
}
