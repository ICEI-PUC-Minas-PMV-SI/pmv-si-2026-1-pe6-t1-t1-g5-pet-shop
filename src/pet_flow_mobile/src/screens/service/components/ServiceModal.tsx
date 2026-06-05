import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { modalStyles } from '../../scheduling/styles';
import type { Service } from '../api';

interface Props {
  visible: boolean;
  service: Service | null;
  onClose: () => void;
  onSave: (payload: { name: string; description: string; price: string; duration: string }) => Promise<void> | void;
  saving?: boolean;
}

export default function ServiceModal({ visible, service, onClose, onSave, saving }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [localSaving, setLocalSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(service?.name || '');
      setDescription(service?.description || '');
      setPrice(service ? String(service.price.toFixed(2)).replace('.', ',') : '');
      setDuration(service ? String(service.duration) : '');
    }
  }, [visible, service]);

  const isValid = name.trim().length > 0 && description.trim().length > 0 && price.trim().length > 0 && duration.trim().length > 0;

  const handleSubmit = async () => {
    setError('');

    // Client-side validations (match backend)
    if (name.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (description.trim().length < 10) {
      setError('Descrição deve ter no mínimo 10 caracteres');
      return;
    }

    const parsedPrice = parseFloat(price.replace(/\./g, '').replace(',', '.')) || 0;
    if (parsedPrice <= 0) {
      setError('Preço deve ser maior que 0');
      return;
    }

    const parsedDuration = parseInt(duration, 10) || 0;
    if (parsedDuration <= 0) {
      setError('Duração deve ser maior que 0');
      return;
    }

    setLocalSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim(), price: price.trim(), duration: duration.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar serviço');
    } finally {
      setLocalSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{service ? 'Editar Serviço' : 'Novo Serviço'}</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose} disabled={saving}>
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.content}>
            {error ? <Text style={[modalStyles.helperText, { color: '#DC2626' }]}>{error}</Text> : null}
            <Text style={modalStyles.label}>Nome</Text>
            <TextInput style={modalStyles.input} value={name} onChangeText={setName} placeholder="Ex: Banho e Tosa" placeholderTextColor={colors.textPlaceholder} />

            <Text style={modalStyles.label}>Descrição</Text>
            <TextInput style={[modalStyles.input, modalStyles.textArea]} value={description} onChangeText={setDescription} placeholder="Descrição do serviço" placeholderTextColor={colors.textPlaceholder} multiline textAlignVertical="top" />

            <Text style={modalStyles.label}>Preço (R$)</Text>
            <TextInput style={modalStyles.input} value={price} onChangeText={setPrice} placeholder="0,00" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />

            <Text style={modalStyles.label}>Duração (min)</Text>
            <TextInput style={modalStyles.input} value={duration} onChangeText={setDuration} placeholder="Ex: 30" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />

            <View style={modalStyles.actions}>
              <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose} disabled={saving}>
                <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.saveButton, (!isValid || localSaving || saving) && modalStyles.saveButtonDisabled]} onPress={handleSubmit} disabled={!isValid || localSaving || saving}>
                {localSaving || saving ? <ActivityIndicator color={colors.textWhite} /> : <Text style={modalStyles.saveButtonText}>{service ? 'Atualizar' : 'Salvar'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
