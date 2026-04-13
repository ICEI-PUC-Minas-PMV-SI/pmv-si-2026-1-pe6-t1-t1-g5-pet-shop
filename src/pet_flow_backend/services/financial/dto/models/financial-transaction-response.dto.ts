export interface FinancialTransactionResponseDto {
  idx?: number | undefined;
  id: string;
  scheduling_id: string;
  description: string;
  amount: number;
  payment_method: string;
  employee_id: string;
  clinic_id: string;
  created_at: Date;
}
