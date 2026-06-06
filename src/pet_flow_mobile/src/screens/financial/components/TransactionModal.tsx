import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
const CATEGORIES = ['Serviço', 'Produtos', 'Despesa Fixa', 'Veterinário', 'Venda Direta'];

export default function TransactionModal({ visible, transaction, onClose, onSave }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'revenue' | 'expense'>('revenue');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (visible) {
      setDescription(transaction?.description || '');
      setAmount(transaction ? formatAmountInput(String(Math.round(Math.abs(transaction.amount) * 100))) : '');
      setType(transaction ? (transaction.amount >= 0 ? 'revenue' : 'expense') : 'revenue');
      setPaymentMethod(transaction?.payment_method || '');
      setCategory('');
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

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={modalStyles.formCard}>
              <Text style={[modalStyles.label, modalStyles.labelFirst]}>Tipo de Transação</Text>
              <View style={modalStyles.typeRow}>
                <TouchableOpacity
                  style={[modalStyles.typeBtn, type === 'revenue' && modalStyles.typeBtnActive]}
                  onPress={() => setType('revenue')}
                >
                  <Text style={[modalStyles.typeBtnText, type === 'revenue' && modalStyles.typeBtnTextActive]}>
                    Receita
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[modalStyles.typeBtn, type === 'expense' && modalStyles.typeBtnActive]}
                  onPress={() => setType('expense')}
                >
                  <Text style={[modalStyles.typeBtnText, type === 'expense' && modalStyles.typeBtnTextActive]}>
                    Despesa
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={modalStyles.label}>Valor</Text>
              <TextInput
                style={modalStyles.input}
                value={amount ? `R$ ${amount}` : ''}
                onChangeText={(text) => setAmount(formatAmountInput(text))}
                placeholder="R$ 0,00"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="numeric"
              />

              <Text style={modalStyles.label}>Descrição</Text>
              <TextInput
                style={modalStyles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Ex: Banho & Tosa"
                placeholderTextColor={colors.textPlaceholder}
              />

              <Text style={modalStyles.label}>Categoria</Text>
              <View style={modalStyles.paymentRow}>
                {CATEGORIES.slice(0, 3).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[modalStyles.paymentBtn, category === cat && modalStyles.paymentBtnActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[modalStyles.paymentBtnText, category === cat && modalStyles.paymentBtnTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
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
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[modalStyles.saveBtn, !isValid && modalStyles.saveBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <MaterialIcons name="check" size={20} color={colors.textWhite} />
            <Text style={modalStyles.saveBtnText}>Salvar Transação</Text>
          </TouchableOpacity>

          <TouchableOpacity style={modalStyles.cancelBtn} onPress={onClose}>
            <Text style={modalStyles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
