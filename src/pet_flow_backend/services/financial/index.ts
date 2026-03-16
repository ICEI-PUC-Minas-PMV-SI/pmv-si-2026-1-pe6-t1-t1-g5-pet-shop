import { FinancialController } from "./financial.controller";
import { FinancialRoutes } from "./financial.routes";
import { FinancialService } from "./financial.service";
import { FinancialTransactionDatasourceImpl } from "./datasources/financial-transaction.datasource.impl";
import { FinancialTransactionRepositoryImpl } from "./repositories/financial-transaction.repository.impl";

const datasource = new FinancialTransactionDatasourceImpl();
const repository = new FinancialTransactionRepositoryImpl(datasource);
const service = new FinancialService(repository);
const controller = new FinancialController(service);

export const financialRoutes = new FinancialRoutes(controller).router;
