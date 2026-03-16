import { FinancialTransactionDatasource } from "../datasources/financial-transaction.datasource";
import { FinancialTransactionRepository } from "./financial-transaction.repository";

export class FinancialTransactionRepositoryImpl implements FinancialTransactionRepository {
  constructor(private readonly datasource: FinancialTransactionDatasource) {}
}
