import { FinancialTransactionRepository } from "./repositories/financial-transaction.repository";

export class FinancialService {
  constructor(private readonly repository: FinancialTransactionRepository) {}
}
