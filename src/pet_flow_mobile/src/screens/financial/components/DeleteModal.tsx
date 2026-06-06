import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import type { Transaction } from '../../../types';
import { deleteModalStyles as styles } from '../styles';

interface Props {
  visible: boolean;
  transaction: Transaction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ visible, transaction, onConfirm, onCancel }: Props) {
  if (!transaction) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Excluir transação?</Text>
          <Text style={styles.message}>
            Tem certeza que deseja excluir esta transação?{'\n'}
            Esta ação não poderá ser desfeita.
          </Text>

          <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
            <Text style={styles.deleteBtnText}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
