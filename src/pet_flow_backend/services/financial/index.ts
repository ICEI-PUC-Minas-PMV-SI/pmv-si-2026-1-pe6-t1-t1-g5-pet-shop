import { FinancialController } from "./financial.controller";
import { FinancialRoutes } from "./financial.routes";
import { FinancialService } from "./financial.service";
import { FinancialTransactionDatasourceImpl } from "./datasources/financial-transaction.datasource.impl";
import { FinancialTransactionRepositoryImpl } from "./repositories/financial-transaction.repository.impl";
import { FinancialTransactionMapper } from "./domain/mappers/financial-transaction.mapper";
import { FinancialTransactionDtoMapper } from "./dto/mappers/financial-transaction-dto.mapper";

const datasource = new FinancialTransactionDatasourceImpl();
const mapper = new FinancialTransactionMapper();
const repository = new FinancialTransactionRepositoryImpl(datasource, mapper);
const service = new FinancialService(repository);
const dtoMapper = new FinancialTransactionDtoMapper();
const controller = new FinancialController(service, dtoMapper);

export const financialRoutes = new FinancialRoutes(controller).router;
