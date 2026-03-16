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
      type: fromObject.type || "",
      amount: fromObject.amount || 0,
      date: fromObject.date || new Date(),
      description: fromObject.description || "",
      createdAt: fromObject.createdAt || new Date(),
      updatedAt: fromObject.updatedAt || new Date(),
    };
  }

  toReversedObject(
    toObject: FinancialTransactionResponseDto,
  ): FinancialTransaction {
    return new FinancialTransaction(
      toObject.id,
      toObject.type,
      toObject.amount,
      toObject.date,
      toObject.description,
      toObject.createdAt,
      toObject.updatedAt,
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
