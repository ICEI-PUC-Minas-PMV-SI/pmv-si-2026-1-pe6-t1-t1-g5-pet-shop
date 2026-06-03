import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme';
import type { Employee, Pet, PetService, Scheduling, Tutor } from '../../../services/scheduling';
import type { SchedulingFormValues, SchedulingResolvedItem } from '../types';
import { modalStyles } from '../styles';
import OptionSheet from './OptionSheet';
import {
  buildDateOptions,
  buildStatusOptions,
  formatStatusLabel,
  getRelativeDateLabel,
  getPetTutorId,
  getPetTutorName,
  isValidDate,
  isWithinBusinessHours,
} from '../utils';

const STATUS_OPTIONS = ['Agendado', 'Confirmado', 'Em Andamento', 'Concluido', 'Cancelado'];

interface Props {
  visible: boolean;
  title: string;
  tutors: Tutor[];
  pets: Pet[];
  schedulings: Scheduling[];
  resolvedItems: SchedulingResolvedItem[];
  employees: Employee[];
  services: PetService[];
  saving: boolean;
  initialValues: SchedulingFormValues;
  onClose: () => void;
  onSave: (values: SchedulingFormValues) => Promise<void>;
}

function toDateTimeLabel(date: string, time: string): string {
  if (!date || !time) return '';
  const combined = new Date(`${date}T${time}:00`);
  if (Number.isNaN(combined.getTime())) return '';

  return combined.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeCompareText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
}

function normalizeCompareId(value: string | number | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim().replace(/[{}]/g, '').toLowerCase();
}

function buildTutorKey(tutor: Tutor): string {
  const byId = normalizeCompareId(tutor.id);
  return byId;
}

export default function SchedulingFormModal({
  visible,
  title,
  tutors,
  pets,
  schedulings,
  resolvedItems,
  employees,
  services,
  saving,
  initialValues,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<SchedulingFormValues>(initialValues);
  const [activePicker, setActivePicker] = useState<'tutor' | 'pet' | 'service' | 'employee' | 'status' | 'date' | 'time' | null>(null);

  useEffect(() => {
    if (visible) {
      setForm(initialValues);
    }
  }, [initialValues, visible]);

  const selectedTutor = tutors.find((item) => buildTutorKey(item) === normalizeCompareId(form.tutorId));
  const selectedPet = pets.find((item) => normalizeCompareId(item.id) === normalizeCompareId(form.petId));
  const selectedService = services.find((item) => normalizeCompareId(item.id) === normalizeCompareId(form.serviceId));
  const selectedEmployee = employees.find((item) => normalizeCompareId(item.id) === normalizeCompareId(form.employeeId));

  const filteredPets = useMemo(() => {
    if (!form.tutorId) {
      return [];
    }

    const selectedTutorKey = normalizeCompareId(form.tutorId);
    const tutorName = normalizeCompareText(selectedTutor?.name || '');

    const petsByTutor = pets.filter((pet) => {
      const tutorId = normalizeCompareId(getPetTutorId(pet));
      const tutorNameOnPet = normalizeCompareText(getPetTutorName(pet));

      return tutorId === selectedTutorKey || (tutorName !== '' && tutorNameOnPet === tutorName);
    });

    if (petsByTutor.length > 0) {
      return petsByTutor;
    }

    // Strict fallback: use existing scheduling relations (petId <-> tutorId).
    const petIdsByTutor = new Set(
      schedulings
        .filter((item) => normalizeCompareId(item.tutorId) === selectedTutorKey)
        .map((item) => normalizeCompareId(item.petId))
        .filter((id) => id !== ''),
    );

    if (petIdsByTutor.size === 0) {
      const petNamesByTutor = new Set(
        resolvedItems
          .filter((item) => normalizeCompareText(item.tutorName) === tutorName)
          .map((item) => normalizeCompareText(item.petName))
          .filter((name) => name !== ''),
      );

      if (petNamesByTutor.size === 0) {
        return [];
      }

      const petsByName = pets.filter((pet) => petNamesByTutor.has(normalizeCompareText(pet.name || '')));
      if (petsByName.length > 0) {
        return petsByName;
      }

      // Last strict fallback: build options from resolved scheduling rows of the selected tutor.
      const syntheticPets = new Map<string, Pet>();
      for (const item of resolvedItems) {
        if (normalizeCompareText(item.tutorName) !== tutorName) {
          continue;
        }

        const petId = normalizeCompareId(item.petId);
        const petName = (item.petName || '').trim();
        if (!petId || !petName) {
          continue;
        }

        if (!syntheticPets.has(petId)) {
          syntheticPets.set(petId, {
            id: item.petId,
            name: item.petName,
            tutorId: form.tutorId,
            tutorName: selectedTutor?.name || item.tutorName,
          });
        }
      }

      return Array.from(syntheticPets.values());
    }

    return pets.filter((pet) => petIdsByTutor.has(normalizeCompareId(pet.id)));
  }, [form.tutorId, pets, resolvedItems, schedulings, selectedTutor?.name]);

  const isFormValid =
    form.tutorId !== '' &&
    form.petId !== '' &&
    form.employeeId !== '' &&
    form.serviceId !== '' &&
    form.date !== '' &&
    form.time !== '' &&
    isValidDate(form.date) &&
    isWithinBusinessHours(form.time);

  const handleChange = (field: keyof SchedulingFormValues, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'tutorId' ? { petId: '' } : {}),
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    await onSave(form);
  };

  const tutorOptions = tutors
    .filter((item) => normalizeCompareId(item.id) !== '')
    .map((item) => ({ label: item.name, value: buildTutorKey(item) }));
  const petOptions = filteredPets.map((item) => ({
    label: item.name,
    value: item.id,
    description: item.tutorName || selectedTutor?.name || 'Tutor não informado',
  }));
  const serviceOptions = services.map((item) => ({
    label: item.name,
    value: item.id,
    description: `R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  }));
  const employeeOptions = employees.map((item) => ({
    label: item.name,
    value: item.id,
    description: item.role,
  }));
  const statusOptions = buildStatusOptions(STATUS_OPTIONS);

  const dateOptions = useMemo(() => {
    const options = buildDateOptions(new Date(), 30);
    if (!form.date) {
      return options;
    }

    const hasSelectedDate = options.some((option) => option.value === form.date);
    if (hasSelectedDate) {
      return options;
    }

    const selectedDate = new Date(form.date);
    const label = Number.isNaN(selectedDate.getTime()) ? form.date : selectedDate.toLocaleDateString('pt-BR');
    return [{ label, value: form.date, description: 'Data atual do agendamento' }, ...options];
  }, [form.date]);

  const timeOptions = useMemo(() => {
    const options: Array<{ label: string; value: string; description?: string }> = [];

    for (let hour = 9; hour <= 17; hour += 1) {
      for (let minute = 0; minute < 60; minute += 15) {
        const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        options.push({
          label: value,
          value,
          description: 'Horário comercial',
        });
      }
    }

    if (!form.time) {
      return options;
    }

    const hasSelectedTime = options.some((option) => option.value === form.time);
    if (hasSelectedTime) {
      return options;
    }

    return [{ label: form.time, value: form.time, description: 'Horário atual do agendamento' }, ...options];
  }, [form.time]);

  const selectedDateOption = dateOptions.find((option) => option.value === form.date);
  const selectedTimeOption = timeOptions.find((option) => option.value === form.time);

  const preview = toDateTimeLabel(form.date, form.time);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose} disabled={saving}>
              <MaterialIcons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={modalStyles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={modalStyles.helperText}>
              {preview ? `Pré-visualização: ${preview}` : 'Preencha os campos obrigatórios para salvar.'}
            </Text>

            <TouchableOpacity style={modalStyles.fieldButton} onPress={() => setActivePicker('tutor')}>
              <Text style={modalStyles.label}>Tutor</Text>
              <View style={modalStyles.fieldValueRow}>
                <Text style={[modalStyles.fieldValue, !form.tutorId && modalStyles.placeholder]}>
                  {selectedTutor?.name || 'Selecione o tutor'}
                </Text>
                <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.fieldButton}
              onPress={() => setActivePicker('pet')}
              disabled={!form.tutorId}
            >
              <Text style={modalStyles.label}>Pet</Text>
              <View style={modalStyles.fieldValueRow}>
                <Text style={[modalStyles.fieldValue, !form.petId && modalStyles.placeholder]}>
                  {selectedPet?.name || (form.tutorId ? 'Selecione o pet' : 'Selecione o tutor primeiro')}
                </Text>
                <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.fieldButton} onPress={() => setActivePicker('service')}>
              <Text style={modalStyles.label}>Serviço</Text>
              <View style={modalStyles.fieldValueRow}>
                <Text style={[modalStyles.fieldValue, !form.serviceId && modalStyles.placeholder]}>
                  {selectedService?.name || 'Selecione o serviço'}
                </Text>
                <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.fieldButton} onPress={() => setActivePicker('employee')}>
              <Text style={modalStyles.label}>Funcionário responsável</Text>
              <View style={modalStyles.fieldValueRow}>
                <Text style={[modalStyles.fieldValue, !form.employeeId && modalStyles.placeholder]}>
                  {selectedEmployee?.name || 'Selecione o funcionário'}
                </Text>
                <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.fieldButton} onPress={() => setActivePicker('status')}>
              <Text style={modalStyles.label}>Status</Text>
              <View style={modalStyles.fieldValueRow}>
                <Text style={modalStyles.fieldValue}>{formatStatusLabel(form.status)}</Text>
                <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
              </View>
            </TouchableOpacity>

            <View style={modalStyles.dateTimeRow}>
              <View style={modalStyles.halfField}>
                <Text style={modalStyles.label}>Data</Text>
                <TouchableOpacity style={modalStyles.fieldButton} onPress={() => setActivePicker('date')}>
                  <View style={modalStyles.fieldValueRow}>
                    <Text style={[modalStyles.fieldValue, !form.date && modalStyles.placeholder]}>
                      {selectedDateOption?.label || (form.date ? getRelativeDateLabel(form.date) : 'Selecione a data')}
                    </Text>
                    <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={modalStyles.halfField}>
                <Text style={modalStyles.label}>Hora</Text>
                <TouchableOpacity style={modalStyles.fieldButton} onPress={() => setActivePicker('time')}>
                  <View style={modalStyles.fieldValueRow}>
                    <Text style={[modalStyles.fieldValue, !form.time && modalStyles.placeholder]}>
                      {selectedTimeOption?.label || 'Selecione a hora'}
                    </Text>
                    <MaterialIcons name="expand-more" size={20} color={colors.textPlaceholder} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={modalStyles.label}>Observações (opcional)</Text>
            <TextInput
              style={[modalStyles.input, modalStyles.textArea]}
              value={form.notes}
              onChangeText={(value) => handleChange('notes', value)}
              placeholder="Se quiser, adicione observações"
              placeholderTextColor={colors.textPlaceholder}
              multiline
              textAlignVertical="top"
            />

            <View style={modalStyles.actions}>
              <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose} disabled={saving}>
                <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.saveButton, !isFormValid && modalStyles.saveButtonDisabled]}
                onPress={handleSubmit}
                disabled={saving || !isFormValid}
              >
                {saving ? (
                  <ActivityIndicator color={colors.textWhite} />
                ) : (
                  <Text style={modalStyles.saveButtonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <OptionSheet
            visible={activePicker === 'tutor'}
            title="Selecionar tutor"
            options={tutorOptions}
            selectedValue={form.tutorId}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('tutorId', value);
              setActivePicker(null);
            }}
          />

          <OptionSheet
            visible={activePicker === 'pet' && Boolean(form.tutorId)}
            title="Selecionar pet"
            options={petOptions}
            selectedValue={form.petId}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('petId', value);
              setActivePicker(null);
            }}
          />

          <OptionSheet
            visible={activePicker === 'service'}
            title="Selecionar serviço"
            options={serviceOptions}
            selectedValue={form.serviceId}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('serviceId', value);
              setActivePicker(null);
            }}
          />

          <OptionSheet
            visible={activePicker === 'employee'}
            title="Selecionar funcionário"
            options={employeeOptions}
            selectedValue={form.employeeId}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('employeeId', value);
              setActivePicker(null);
            }}
          />

          <OptionSheet
            visible={activePicker === 'status'}
            title="Selecionar status"
            options={statusOptions}
            selectedValue={form.status}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('status', value);
              setActivePicker(null);
            }}
          />

          <OptionSheet
            visible={activePicker === 'date'}
            title="Selecionar data"
            options={dateOptions}
            selectedValue={form.date}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('date', value);
              setActivePicker(null);
            }}
          />

          <OptionSheet
            visible={activePicker === 'time'}
            title="Selecionar hora"
            options={timeOptions}
            selectedValue={form.time}
            onClose={() => setActivePicker(null)}
            onSelect={(value) => {
              handleChange('time', value);
              setActivePicker(null);
            }}
          />
        </View>
      </View>
    </Modal>
  );
}