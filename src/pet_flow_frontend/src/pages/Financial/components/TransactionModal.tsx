import { useState } from 'react';
import type { Transaction, CreateTransactionPayload } from '../../../services/financial';
import { formatAmountDisplay, formatAmountInput, parseAmount } from '../utils';
import styles from '../Financial.module.css';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (payload: CreateTransactionPayload) => void;
}

export default function TransactionModal({ transaction, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    description: transaction?.description || '',
    amount: transaction ? formatAmountDisplay(Math.abs(transaction.amount)) : '',
    payment_method: transaction?.payment_method || '',
    type: transaction ? (transaction.amount >= 0 ? 'revenue' : 'expense') : 'revenue',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, amount: formatAmountInput(e.target.value) }));
  };

  const isFormValid = () => {
    return (
      form.description.trim().length > 0 &&
      parseAmount(form.amount) >= 1 &&
      form.payment_method !== ''
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const amount = parseAmount(form.amount);

    onSave({
      description: form.description.trim(),
      amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      payment_method: form.payment_method,
      clinic_id: transaction?.clinic_id || '',
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {transaction ? 'Editar Transação' : 'Nova Transação'}
        </h2>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>Descrição</label>
            <input
              type="text"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Ex: Consulta veterinária"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label>Valor (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.amount}
                onChange={handleAmountChange}
                placeholder="0,00"
              />
            </div>
            <div className={styles.formField}>
              <label>Tipo</label>
              <select value={form.type} onChange={handleChange('type')}>
                <option value="revenue">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
          </div>

          <div className={styles.formField}>
            <label>Método de pagamento</label>
            <select value={form.payment_method} onChange={handleChange('payment_method')}>
              <option value="">Selecione...</option>
              <option value="Cartão">Cartão</option>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={!isFormValid()}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
