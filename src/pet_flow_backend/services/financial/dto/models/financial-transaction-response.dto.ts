export interface FinancialTransactionResponseDto {
  id: string;
  schedulingId: string;
  category: string;
  description: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  employeeId: string;
  clinicId: string;
  createdAt: Date;
}
