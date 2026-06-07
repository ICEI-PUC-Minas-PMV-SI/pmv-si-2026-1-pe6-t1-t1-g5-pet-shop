import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../../theme';
import { modalStyles } from '../../scheduling/styles';

interface Props {
  visible: boolean;
  title?: string;
  message?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function DeleteConfirmModal({ visible, title = 'Excluir', message = 'Deseja realmente excluir?', loading = false, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { paddingHorizontal: 24 }]}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
          </View>

          <View style={modalStyles.content}>
            <Text style={{ color: colors.textPrimary, marginBottom: 16 }}>{message}</Text>

            <View style={modalStyles.actions}>
              <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose} disabled={loading}>
                <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.saveButton, loading && modalStyles.saveButtonDisabled]} onPress={onConfirm} disabled={loading}>
                {loading ? <ActivityIndicator color={colors.textWhite} /> : <Text style={modalStyles.saveButtonText}>Excluir</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
