import { Mapper, ReversedMapper } from "../../../../shared/utils/mapper";
import { FinancialTransactionEntity } from "../../datasources/entities/financial-transaction.entity";
import { FinancialTransaction } from "../models/financial-transaction";

export class FinancialTransactionMapper
  implements
    Mapper<FinancialTransactionEntity, FinancialTransaction>,
    ReversedMapper<FinancialTransactionEntity, FinancialTransaction>
{
  constructor() {}

  toObject(fromObject: FinancialTransactionEntity): FinancialTransaction {
    return new FinancialTransaction(
      fromObject.idx,
      fromObject.id,
      fromObject.scheduling_id,
      fromObject.description,
      fromObject.amount,
      fromObject.payment_method,
      fromObject.employee_id,
      fromObject.clinic_id,
      fromObject.created_at,
    );
  }

  toReversedObject(toObject: FinancialTransaction): FinancialTransactionEntity {
    return new FinancialTransactionEntity(
      toObject.idx,
      toObject.id,
      toObject.schedulingId,
      toObject.description,
      toObject.amount,
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
