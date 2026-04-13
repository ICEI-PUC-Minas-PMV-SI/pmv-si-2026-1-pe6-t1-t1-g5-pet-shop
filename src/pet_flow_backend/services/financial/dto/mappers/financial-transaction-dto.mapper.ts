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
      id: fromObject.id || "",
      schedulingId: fromObject.schedulingId || "",
      description: fromObject.description || "",
      amount: fromObject.amount || 0,
      paymentMethod: fromObject.paymentMethod || "",
      employeeId: fromObject.employeeId || "",
      clinicId: fromObject.clinicId || "",
      createdAt: fromObject.createdAt || new Date(),
    };
  }

  toReversedObject(
    toObject: FinancialTransactionResponseDto,
  ): FinancialTransaction {
    return new FinancialTransaction(
      toObject.id,
      toObject.schedulingId,
      toObject.description,
      toObject.amount,
      toObject.paymentMethod,
      toObject.employeeId,
      toObject.clinicId,
      toObject.createdAt,
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
