import { financialService } from '../../services';
import type { Transaction, CreateTransactionPayload } from '../../types';

export async function fetchAllTransactions(clinicId: string): Promise<Transaction[]> {
  return financialService.getAll(clinicId);
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
  return financialService.create(payload);
}

export async function updateTransaction(
  id: string,
  clinicId: string,
  payload: { description: string; amount: number; payment_method: string },
): Promise<Transaction> {
  return financialService.update({ id, clinic_id: clinicId, ...payload });
}

export async function deleteTransaction(id: string, clinicId: string): Promise<null> {
  return financialService.delete(id, clinicId);
}
