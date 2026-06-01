import { authRequest } from './http';
import type { Transaction, CreateTransactionPayload } from '../types';

export const financialService = {
  getAll(clinicId: string): Promise<Transaction[]> {
    return authRequest<Transaction[]>(`/financial/all?clinic_id=${encodeURIComponent(clinicId)}`, {
      method: 'GET',
    });
  },

  create(payload: CreateTransactionPayload): Promise<Transaction> {
    return authRequest<Transaction>('/financial/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(payload: Partial<Transaction> & { id: string; clinic_id: string }): Promise<Transaction> {
    return authRequest<Transaction>('/financial/', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string, clinicId: string): Promise<null> {
    return authRequest<null>('/financial/', {
      method: 'DELETE',
      body: JSON.stringify({ id, clinic_id: clinicId }),
    });
  },
};
