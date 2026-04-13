export interface FinancialTransactionResponseDto {
  id: string;
  schedulingId: string;
  description: string;
  amount: number;
  paymentMethod: string;
  employeeId: string;
  clinicId: string;
  createdAt: Date;
}
