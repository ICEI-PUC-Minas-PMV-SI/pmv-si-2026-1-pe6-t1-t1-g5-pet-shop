import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import { styles } from './styles';
import { useScheduling } from './useScheduling';
import SchedulingFormModal from './components/SchedulingFormModal';
import OptionSheet from './components/OptionSheet';
import { getStatusTheme, getRelativeDateLabel } from './utils';
import type { SchedulingResolvedItem, SchedulingOption } from './types';

type FilterPicker = 'date' | 'status' | 'employee' | null;

function getPetInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function FilterChip({
  value,
  icon,
  active,
  onPress,
}: {
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.filterChip, active && styles.filterChipActive]} onPress={onPress}>
      <MaterialIcons name={icon} size={16} color={colors.textPrimary} />
      <Text numberOfLines={1} style={styles.filterChipValue}>
        {value}
      </Text>
      <MaterialIcons name="expand-more" size={18} color={colors.textPlaceholder} />
    </TouchableOpacity>
  );
}

function ScheduleCard({
  item,
  onEdit,
  onDelete,
}: {
  item: SchedulingResolvedItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusTheme = getStatusTheme(item.status);

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingAvatarWrap}>
        {item.photoUrl ? (
          <Image source={{ uri: item.photoUrl }} style={styles.bookingAvatar} />
        ) : (
          <MaterialIcons name="pets" size={24} color={colors.primary} />
        )}
      </View>

      <View style={styles.bookingBody}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingTitle} numberOfLines={1}>
            {item.petName}
          </Text>
          <Text style={styles.bookingTime}>{item.dateTime ? new Date(item.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</Text>
        </View>

        <Text style={styles.bookingLine} numberOfLines={1}>
          Tutor: {item.tutorName || 'Sem tutor'}
        </Text>
        <Text style={styles.bookingLine} numberOfLines={1}>
          Serviço: {item.serviceName || 'Serviço não informado'}
        </Text>
        <Text style={styles.bookingLine} numberOfLines={1}>
          Vet: {item.employeeName || 'Funcionário não informado'}
        </Text>

        <View style={styles.bookingFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusTheme.background }]}>
            <Text style={[styles.statusBadgeText, { color: statusTheme.color }]}>{item.status}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonEdit]} onPress={onEdit}>
              <MaterialIcons name="edit" size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonDelete]} onPress={onDelete}>
              <MaterialIcons name="delete" size={16} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function SchedulingScreen() {
  const navigation = useNavigation<any>();
  const [activePicker, setActivePicker] = useState<FilterPicker>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLargeScreen = width >= 430;

  const {
    loading,
    refreshing,
    saving,
    error,
    schedulings,
    resolvedItems,
    daySlots,
    upcomingItems,
    selectedDate,
    selectedStatus,
    selectedEmployee,
    selectedDateLabel,
    selectedStatusLabel,
    selectedEmployeeLabel,
    dateOptions,
    statusOptions,
    employeeOptions,
    modalVisible,
    initialValues,
    tutors,
    pets,
    employees,
    services,
    setSelectedDate,
    setSelectedStatus,
    setSelectedEmployee,
    openCreate,
    openEdit,
    closeModal,
    handleDelete,
    handleSave,
    refresh,
  } = useScheduling();

  const pickerOptions: SchedulingOption[] = useMemo(() => {
    if (activePicker === 'date') {
      return dateOptions;
    }

    if (activePicker === 'status') {
      return statusOptions;
    }

    if (activePicker === 'employee') {
      return employeeOptions;
    }

    return [];
  }, [activePicker, dateOptions, employeeOptions, statusOptions]);

  const pickerSelectedValue =
    activePicker === 'date' ? selectedDate : activePicker === 'status' ? selectedStatus : selectedEmployee;

  const pickerTitle =
    activePicker === 'date' ? 'Selecionar data' : activePicker === 'status' ? 'Selecionar status' : 'Selecionar funcionário';

  const handlePickerSelect = (value: string) => {
    if (activePicker === 'date') {
      setSelectedDate(value);
    } else if (activePicker === 'status') {
      setSelectedStatus(value);
    } else if (activePicker === 'employee') {
      setSelectedEmployee(value);
    }

    setActivePicker(null);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.dispatch(DrawerActions.openDrawer());
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, isLargeScreen && styles.contentLarge, { paddingTop: insets.top + 6 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={22} color={colors.primaryDark} />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Agendamentos</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <FilterChip icon="calendar-today" value={selectedDateLabel} active={activePicker === 'date'} onPress={() => setActivePicker('date')} />
            <FilterChip
              icon="filter-alt"
              value="Status"
              active={activePicker === 'status'}
              onPress={() => setActivePicker('status')}
            />
            <FilterChip
              icon="person"
              value="Funcionário"
              active={activePicker === 'employee'}
              onPress={() => setActivePicker('employee')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Agenda do dia</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayList}>
            {daySlots.map((slot) => (
              <View key={slot.label} style={[styles.dayCard, isLargeScreen && styles.dayCardLarge, slot.occupied && styles.dayCardActive]}>
                <Text style={[styles.dayCardTime, slot.occupied && styles.dayCardTimeActive]}>{slot.label}</Text>
                <View style={[styles.dot, slot.occupied && styles.dotActive]} />
                <Text style={[styles.dayCardStatus, slot.occupied && styles.dayCardStatusActive]}>
                  {slot.occupied ? 'Ocupado' : 'Livre'}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos horários</Text>
            <TouchableOpacity style={styles.sectionFab} onPress={openCreate}>
              <MaterialIcons name="add" size={30} style={styles.fabIcon} />
            </TouchableOpacity>
          </View>

          {upcomingItems.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="event-busy" size={28} color={colors.textPlaceholder} />
              <Text style={styles.emptyStateTitle}>Nenhum agendamento encontrado</Text>
              <Text style={styles.emptyStateText}>Não existem horários futuros para os filtros selecionados.</Text>
            </View>
          ) : (
            <FlatList
              data={upcomingItems}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.cardList}
              renderItem={({ item }) => (
                <ScheduleCard item={item} onEdit={() => openEdit(item)} onDelete={() => handleDelete(item)} />
              )}
            />
          )}
        </View>
      </ScrollView>

      <SchedulingFormModal
        visible={modalVisible}
        title={initialValues.tutorId ? 'Editar agendamento' : 'Novo agendamento'}
        tutors={tutors}
        pets={pets}
        schedulings={schedulings}
        resolvedItems={resolvedItems}
        employees={employees}
        services={services}
        saving={saving}
        initialValues={initialValues}
        onClose={closeModal}
        onSave={handleSave}
      />

      <OptionSheet
        visible={activePicker !== null}
        title={pickerTitle}
        options={pickerOptions}
        selectedValue={pickerSelectedValue}
        onClose={() => setActivePicker(null)}
        onSelect={handlePickerSelect}
      />
    </View>
  );
}