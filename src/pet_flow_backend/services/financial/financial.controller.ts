import { FinancialService } from "./financial.service";

export class FinancialController {
  constructor(private readonly service: FinancialService) {}
}
