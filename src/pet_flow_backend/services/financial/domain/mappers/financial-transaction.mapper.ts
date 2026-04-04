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
      fromObject.scheduling_id,
      fromObject.category,
      fromObject.description,
      fromObject.amount,
      fromObject.payment_date,
      fromObject.payment_method,
      fromObject.employee_id,
      fromObject.clinic_id,
      fromObject.created_at,
    );
  }

  toReversedObject(toObject: FinancialTransaction): FinancialTransactionEntity {
    return new FinancialTransactionEntity(
      toObject.id,
      toObject.schedulingId,
      toObject.category,
      toObject.description,
      toObject.amount,
      toObject.paymentDate,
      toObject.paymentMethod,
      toObject.employeeId,
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
