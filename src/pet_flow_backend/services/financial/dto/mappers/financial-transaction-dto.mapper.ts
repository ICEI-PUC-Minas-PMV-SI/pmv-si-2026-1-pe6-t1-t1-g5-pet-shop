import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { FinancialTransactionResponseDto } from "../models/financial-transaction-response.dto";
import { FinancialTransaction } from "../../domain/models/financial-transaction";

export class FinancialTransactionDtoMapper
  implements
  Mapper<FinancialTransaction, FinancialTransactionResponseDto>,
  ReversedMapper<FinancialTransaction, FinancialTransactionResponseDto> {
  constructor() { }

  toObject(fromObject: FinancialTransaction): FinancialTransactionResponseDto {
    return {
      id: fromObject.id || "",
      description: fromObject.description || "",
      amount: fromObject.amount || 0,
      dueDate: fromObject.dueDate || new Date(),
      paymentMethod: fromObject.paymentMethod || "",
      status: fromObject.status || "",
      clinicId: fromObject.clinicId || "",
      createdAt: fromObject.createdAt || new Date(),
    };
  }

  toReversedObject(
    toObject: FinancialTransactionResponseDto,
  ): FinancialTransaction {
    return new FinancialTransaction(
      toObject.id,
      toObject.description,
      toObject.amount,
      toObject.dueDate,
      toObject.paymentMethod,
      toObject.status,
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
