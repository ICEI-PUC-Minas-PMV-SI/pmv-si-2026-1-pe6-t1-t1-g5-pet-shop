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
      fromObject.description,
      fromObject.amount,
      fromObject.due_date,
      fromObject.payment_method,
      fromObject.status,
      fromObject.clinic_id,
      fromObject.created_at,
    );
  }

  toReversedObject(toObject: FinancialTransaction): FinancialTransactionEntity {
    return new FinancialTransactionEntity(
      toObject.id,
      toObject.description,
      toObject.amount,
      toObject.dueDate,
      toObject.paymentMethod,
      toObject.status,
      toObject.clinicId,
      undefined,
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
