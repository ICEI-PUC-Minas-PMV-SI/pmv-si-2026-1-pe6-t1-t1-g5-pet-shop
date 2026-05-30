import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../../../theme';
import { modalStyles } from '../styles';
import type { Transaction, CreateTransactionPayload } from '../../../types';

function formatAmountInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const cents = parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseAmount(formatted: string): number {
  const cleaned = formatted.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

interface Props {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (payload: CreateTransactionPayload) => void;
}

const PAYMENT_OPTIONS = ['Cartão', 'Pix', 'Dinheiro'];

export default function TransactionModal({ visible, transaction, onClose, onSave }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (visible) {
      setDescription(transaction?.description || '');
      setAmount(transaction ? formatAmountInput(String(Math.round(Math.abs(transaction.amount) * 100))) : '');
      setType(transaction ? (transaction.amount >= 0 ? 'revenue' : 'expense') : 'revenue');
      setPaymentMethod(transaction?.payment_method || '');
    }
  }, [visible, transaction]);

  const isValid = description.trim().length > 0 && parseAmount(amount) >= 1 && paymentMethod !== '';

  const handleSubmit = () => {
    if (!isValid) return;
    const value = parseAmount(amount);
    onSave({
      description: description.trim(),
      amount: type === 'expense' ? -Math.abs(value) : Math.abs(value),
      payment_method: paymentMethod,
      clinic_id: '',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.title}>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </Text>

          <Text style={modalStyles.label}>Descrição</Text>
          <TextInput
            style={modalStyles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Consulta veterinária"
            placeholderTextColor={colors.textPlaceholder}
          />

          <Text style={modalStyles.label}>Valor (R$)</Text>
          <TextInput
            style={modalStyles.input}
            value={amount}
            onChangeText={(text) => setAmount(formatAmountInput(text))}
            placeholder="0,00"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="numeric"
          />

          <Text style={modalStyles.label}>Tipo</Text>
          <View style={modalStyles.typeRow}>
            <TouchableOpacity
              style={[modalStyles.typeBtn, type === 'revenue' && modalStyles.typeBtnActiveRevenue]}
              onPress={() => setType('revenue')}
            >
              <Text style={[modalStyles.typeBtnText, type === 'revenue' && modalStyles.typeBtnTextActive]}>
                Receita
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.typeBtn, type === 'expense' && modalStyles.typeBtnActiveExpense]}
              onPress={() => setType('expense')}
            >
              <Text style={[modalStyles.typeBtnText, type === 'expense' && modalStyles.typeBtnTextActive]}>
                Despesa
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.label}>Método de pagamento</Text>
          <View style={modalStyles.paymentRow}>
            {PAYMENT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[modalStyles.paymentBtn, paymentMethod === option && modalStyles.paymentBtnActive]}
                onPress={() => setPaymentMethod(option)}
              >
                <Text style={[modalStyles.paymentBtnText, paymentMethod === option && modalStyles.paymentBtnTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={modalStyles.actions}>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
              <Text style={modalStyles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.saveBtn, !isValid && modalStyles.saveBtnDisabled]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={modalStyles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
