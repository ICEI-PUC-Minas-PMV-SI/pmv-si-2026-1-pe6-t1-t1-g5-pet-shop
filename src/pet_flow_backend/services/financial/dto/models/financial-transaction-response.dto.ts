export interface FinancialTransactionResponseDto {
  id: string;
  type: string;
  amount: number;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
