import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme';
import type { SchedulingOption } from '../types';
import { sheetStyles } from '../styles';

interface Props {
  visible: boolean;
  title: string;
  options: SchedulingOption[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export default function OptionSheet({
  visible,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={sheetStyles.overlay}>
        <TouchableOpacity style={sheetStyles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={sheetStyles.sheet}>
          <View style={sheetStyles.handle} />

          <View style={sheetStyles.header}>
            <Text style={sheetStyles.title}>{title}</Text>
            <TouchableOpacity style={sheetStyles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={sheetStyles.list} showsVerticalScrollIndicator={false}>
            {options.length === 0 ? (
              <Text style={sheetStyles.emptyText}>Nenhuma opção disponível</Text>
            ) : (
              options.map((option) => {
                const isSelected = option.value === selectedValue;

                return (
                  <TouchableOpacity
                    key={`${option.value}-${option.label}`}
                    style={[sheetStyles.option, isSelected && sheetStyles.optionActive]}
                    onPress={() => onSelect(option.value)}
                  >
                    <View style={sheetStyles.optionText}>
                      <Text style={sheetStyles.optionTitle}>{option.label}</Text>
                      {option.description ? (
                        <Text style={sheetStyles.optionDescription}>{option.description}</Text>
                      ) : null}
                    </View>

                    {isSelected ? (
                      <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={20} color={colors.textPlaceholder} />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}