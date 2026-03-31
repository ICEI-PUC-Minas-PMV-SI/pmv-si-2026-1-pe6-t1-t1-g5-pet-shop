export interface FinancialTransactionResponseDto {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  paymentMethod: string;
  status: string;
  clinicId: string;
  createdAt: Date;
}
