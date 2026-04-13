import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { FinancialTransactionResponseDto } from "../models/financial-transaction-response.dto";
import { FinancialTransaction } from "../../domain/models/financial-transaction";

export class FinancialTransactionDtoMapper
  implements
    Mapper<FinancialTransaction, FinancialTransactionResponseDto>,
    ReversedMapper<FinancialTransaction, FinancialTransactionResponseDto>
{
  constructor() {}

  toObject(fromObject: FinancialTransaction): FinancialTransactionResponseDto {
    return {
      idx: fromObject.idx,
      id: fromObject.id || "",
      scheduling_id: fromObject.schedulingId || "",
      description: fromObject.description || "",
      amount: fromObject.amount || 0,
      payment_method: fromObject.paymentMethod || "",
      employee_id: fromObject.employeeId || "",
      clinic_id: fromObject.clinicId || "",
      created_at: fromObject.createdAt || new Date(),
    };
  }

  toReversedObject(
    toObject: FinancialTransactionResponseDto,
  ): FinancialTransaction {
    return new FinancialTransaction(
      toObject.idx,
      toObject.id,
      toObject.scheduling_id,
      toObject.description,
      toObject.amount,
      toObject.payment_method,
      toObject.employee_id,
      toObject.clinic_id,
      toObject.created_at,
    );
  }

  toObjects(
    fromObjects: FinancialTransaction[],
  ): FinancialTransactionResponseDto[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(
    toObjects: FinancialTransactionResponseDto[],
  ): FinancialTransaction[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
