import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme';
import { modalStyles } from '../../scheduling/styles';
import type { Product } from '../api';

export interface ProductFormPayload {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
}

interface Props {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (payload: ProductFormPayload) => Promise<void> | void;
  saving?: boolean;
}

export default function ProductModal({ visible, product, onClose, onSave, saving }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [localSaving, setLocalSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(product?.name || '');
      setCategory(product?.category || '');
      setDescription(product?.description || '');
      setPrice(product ? String(product.price.toFixed(2)).replace('.', ',') : '');
      setStock(product ? String(product.stock) : '');
      setError('');
    }
  }, [visible, product]);

  const isValid =
    name.trim().length > 0 &&
    category.trim().length > 0 &&
    price.trim().length > 0 &&
    stock.trim().length > 0;

  const handleSubmit = async () => {
    setError('');

    if (name.trim().length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (category.trim().length === 0) {
      setError('Categoria é obrigatória');
      return;
    }

    const parsedPrice = parseFloat(price.replace(/\./g, '').replace(',', '.')) || 0;
    if (parsedPrice <= 0) {
      setError('Preço deve ser maior que 0');
      return;
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError('Estoque deve ser maior ou igual a 0');
      return;
    }

    setLocalSaving(true);
    try {
      await onSave({
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: price.trim(),
        stock: stock.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto');
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
            <Text style={modalStyles.title}>{product ? 'Editar Produto' : 'Novo Produto'}</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose} disabled={saving}>
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.content}>
            {error ? <Text style={[modalStyles.helperText, { color: '#DC2626' }]}>{error}</Text> : null}
            <Text style={modalStyles.label}>Nome</Text>
            <TextInput style={modalStyles.input} value={name} onChangeText={setName} placeholder="Ex: Ração Premium" placeholderTextColor={colors.textPlaceholder} />

            <Text style={modalStyles.label}>Categoria</Text>
            <TextInput style={modalStyles.input} value={category} onChangeText={setCategory} placeholder="Ex: Alimentação, Higiene, Acessórios" placeholderTextColor={colors.textPlaceholder} />

            <Text style={modalStyles.label}>Descrição</Text>
            <TextInput style={[modalStyles.input, modalStyles.textArea]} value={description} onChangeText={setDescription} placeholder="Descrição do produto" placeholderTextColor={colors.textPlaceholder} multiline textAlignVertical="top" />

            <Text style={modalStyles.label}>Preço (R$)</Text>
            <TextInput style={modalStyles.input} value={price} onChangeText={setPrice} placeholder="0,00" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />

            <Text style={modalStyles.label}>Estoque</Text>
            <TextInput style={modalStyles.input} value={stock} onChangeText={setStock} placeholder="Ex: 10" placeholderTextColor={colors.textPlaceholder} keyboardType="numeric" />

            <View style={modalStyles.actions}>
              <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose} disabled={saving}>
                <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[modalStyles.saveButton, (!isValid || localSaving || saving) && modalStyles.saveButtonDisabled]} onPress={handleSubmit} disabled={!isValid || localSaving || saving}>
                {localSaving || saving ? <ActivityIndicator color={colors.textWhite} /> : <Text style={modalStyles.saveButtonText}>{product ? 'Atualizar' : 'Salvar'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
