import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { FinancialTransactionEntity } from "../../datasources/entities/financial-transaction.entity";
import { FinancialTransaction } from "../models/financial-transaction";

export class FinancialTransactionMapper
  implements
  Mapper<FinancialTransactionEntity, FinancialTransaction>,
  ReversedMapper<FinancialTransactionEntity, FinancialTransaction> {
  constructor() { }

  toObject(fromObject: FinancialTransactionEntity): FinancialTransaction {
    return new FinancialTransaction(
      fromObject.id,
      fromObject.type,
      fromObject.amount,
      fromObject.date,
      fromObject.description,
      fromObject.created_at,
      fromObject.updated_at,
    );
  }

  toReversedObject(toObject: FinancialTransaction): FinancialTransactionEntity {
    return new FinancialTransactionEntity(
      toObject.id,
      toObject.type,
      toObject.amount,
      toObject.date,
      toObject.description,
      toObject.createdAt,
      toObject.updatedAt,
    );
  }

  toObjects(fromObjects: FinancialTransactionEntity[]): FinancialTransaction[] {
    return fromObjects.map((fromObject) => this.toObject(fromObject));
  }

  toReversedObjects(
    toObjects: FinancialTransaction[],
  ): FinancialTransactionEntity[] {
    return toObjects.map((toObject) => this.toReversedObject(toObject));
  }
}
