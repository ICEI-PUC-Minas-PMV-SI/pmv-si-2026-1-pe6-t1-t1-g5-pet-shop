import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useSession } from '../../contexts/SessionContext';
import { schedulingService, type Employee, type Pet, type PetService, type Scheduling, type Tutor } from '../../services/scheduling';
import type { SchedulingFormValues, SchedulingReferenceData, SchedulingResolvedItem } from './types';
import {
  buildDateOptions,
  buildDaySlots,
  buildEmployeeOptions,
  buildStatusOptions,
  formatStatusLabel,
  getRelativeDateLabel,
  isWithinBusinessHours,
  normalizeStatus,
  sortByDateTime,
  toInputDate,
  toInputTime,
  toIsoFromDateTime,
  SCHEDULING_STATUS_ORDER,
} from './utils';

const DEFAULT_STATUS = 'Agendado';

function normalizeId(value: unknown): string {
  if (typeof value === 'string') return value.trim().replace(/[{}]/g, '').toLowerCase();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value).trim().toLowerCase();
  return '';
}

function enrichPetsWithSchedulingLinks(
  pets: Pet[],
  schedulings: Scheduling[],
  tutors: Tutor[],
): Pet[] {
  const tutorNameById = new Map(
    tutors
      .map((tutor) => [normalizeId(tutor.id), tutor.name] as const)
      .filter(([id]) => id !== ''),
  );

  const linkByPetId = new Map<string, { tutorId: string; tutorName?: string }>();

  for (const scheduling of schedulings) {
    const petId = normalizeId(scheduling.petId);
    const tutorId = normalizeId(scheduling.tutorId);

    if (!petId || !tutorId) {
      continue;
    }

    if (!linkByPetId.has(petId)) {
      linkByPetId.set(petId, {
        tutorId,
        tutorName: tutorNameById.get(tutorId),
      });
    }
  }

  return pets.map((pet) => {
    const petId = normalizeId(pet.id);
    const inferred = linkByPetId.get(petId);
    if (!inferred || !inferred.tutorId) {
      return pet;
    }

    // Scheduling records are the source of truth for the active flow when pet list payload is inconsistent.
    return {
      ...pet,
      tutorId: inferred.tutorId,
      tutorName: pet.tutorName || inferred.tutorName,
    };
  });
}

async function recoverPetsFromSchedulings(
  pets: Pet[],
  schedulings: Scheduling[],
): Promise<Pet[]> {
  const existingById = new Map(
    pets
      .map((pet) => [normalizeId(pet.id), pet] as const)
      .filter(([id]) => id !== ''),
  );

  const missingPetIds = Array.from(
    new Set(
      schedulings
        .map((item) => normalizeId(item.petId))
        .filter((id) => id !== '' && !existingById.has(id)),
    ),
  );

  if (missingPetIds.length === 0) {
    return pets;
  }

  const recoveredResults = await Promise.allSettled(
    missingPetIds.slice(0, 80).map((petId) => schedulingService.getPetById(petId)),
  );

  const recoveredPets = recoveredResults
    .filter((result): result is PromiseFulfilledResult<Pet> => result.status === 'fulfilled')
    .map((result) => result.value)
    .filter((pet) => normalizeId(pet.id) !== '');

  if (recoveredPets.length === 0) {
    return pets;
  }

  for (const pet of recoveredPets) {
    existingById.set(normalizeId(pet.id), pet);
  }

  return Array.from(existingById.values());
}

function getServiceName(services: PetService[], totalValue: number): string {
  const service = services.find((item) => Number(item.price.toFixed(2)) === Number(totalValue.toFixed(2)));
  if (service?.name && service.name.trim() !== '') {
    return service.name;
  }

  return `Serviço R$ ${totalValue.toFixed(2)}`;
}

function buildResolvedItem(item: Scheduling, references: SchedulingReferenceData): SchedulingResolvedItem {
  const itemPetId = normalizeId(item.petId);
  const itemTutorId = normalizeId(item.tutorId);
  const itemEmployeeId = normalizeId(item.employeeId);

  const pet = references.pets.find((entry) => normalizeId(entry.id) === itemPetId);
  const tutor = references.tutors.find((entry) => normalizeId(entry.id) === itemTutorId);
  const employee = references.employees.find((entry) => normalizeId(entry.id) === itemEmployeeId);

  return {
    ...item,
    tutorName: tutor?.name?.trim() || item.tutorId || 'Sem tutor',
    petName: pet?.name?.trim() || item.petId || 'Pet',
    employeeName: employee?.name?.trim() || item.employeeId || 'Funcionário',
    serviceName: getServiceName(references.services, item.totalValue),
    photoUrl: pet?.photo_url,
  };
}

function toFormValues(item: SchedulingResolvedItem, services: PetService[]): SchedulingFormValues {
  const dateTime = new Date(item.dateTime);
  const service = services.find((entry) => Number(entry.price.toFixed(2)) === Number(item.totalValue.toFixed(2)));

  return {
    tutorId: item.tutorId,
    petId: item.petId,
    serviceId: service?.id || '',
    employeeId: item.employeeId,
    status: normalizeStatus(item.status),
    date: toInputDate(dateTime),
    time: toInputTime(dateTime),
    notes: item.notes || '',
  };
}

function emptyForm(selectedDate: string): SchedulingFormValues {
  return {
    tutorId: '',
    petId: '',
    serviceId: '',
    employeeId: '',
    status: DEFAULT_STATUS,
    date: selectedDate,
    time: '09:00',
    notes: '',
  };
}

export function useScheduling() {
  const { session } = useSession();
  const clinicId = session?.clinicId || '';

  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<PetService[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [selectedDate, setSelectedDate] = useState(toInputDate(new Date()));
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedEmployee, setSelectedEmployee] = useState('Todos');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<SchedulingResolvedItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [schedulingsData, tutorsData, petsData, employeesData, servicesData] = await Promise.all([
        schedulingService.list(),
        schedulingService.listTutors(),
        schedulingService.listPets(),
        schedulingService.listEmployees(),
        schedulingService.listPetServices(),
      ]);

      const scopedSchedulings = schedulingsData;

      const recoveredPets = await recoverPetsFromSchedulings(petsData, scopedSchedulings);
      const enrichedPets = enrichPetsWithSchedulingLinks(recoveredPets, scopedSchedulings, tutorsData);

      setSchedulings(scopedSchedulings);
      setTutors(tutorsData);
      setPets(enrichedPets);
      setEmployees(employeesData);
      setServices(servicesData);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar agendamentos';
      setError(message);
    }
  }, [clinicId]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        await fetchData();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [fetchData]);

  const references = useMemo<SchedulingReferenceData>(
    () => ({ tutors, pets, employees, services }),
    [tutors, pets, employees, services],
  );

  const resolvedItems = useMemo<SchedulingResolvedItem[]>(() => {
    return schedulings.map((item) => buildResolvedItem(item, references));
  }, [references, schedulings]);

  const dateOptions = useMemo(() => buildDateOptions(new Date(), 7), []);
  const statusOptions = useMemo(() => buildStatusOptions(SCHEDULING_STATUS_ORDER), []);
  const employeeOptions = useMemo(() => buildEmployeeOptions(employees), [employees]);

  const visibleItems = useMemo(() => {
    return sortByDateTime(
      resolvedItems.filter((item) => {
        const itemDate = toInputDate(new Date(item.dateTime));
        const matchesDate = itemDate === selectedDate;
        const matchesStatus = selectedStatus === 'Todos' || normalizeStatus(item.status) === normalizeStatus(selectedStatus);
        const matchesEmployee = selectedEmployee === 'Todos' || item.employeeId === selectedEmployee;

        return matchesDate && matchesStatus && matchesEmployee;
      }),
    );
  }, [resolvedItems, selectedDate, selectedEmployee, selectedStatus]);

  const upcomingItems = useMemo(() => {
    return sortByDateTime(
      resolvedItems.filter((item) => {
        const itemDate = toInputDate(new Date(item.dateTime));
        const matchesDate = itemDate === selectedDate;
        const matchesStatus = selectedStatus === 'Todos' || normalizeStatus(item.status) === normalizeStatus(selectedStatus);
        const matchesEmployee = selectedEmployee === 'Todos' || item.employeeId === selectedEmployee;

        return matchesDate && matchesStatus && matchesEmployee;
      }),
    );
  }, [resolvedItems, selectedDate, selectedEmployee, selectedStatus]);

  const daySlots = useMemo(() => buildDaySlots(visibleItems, selectedDate), [selectedDate, visibleItems]);

  const selectedDateLabel = useMemo(() => getRelativeDateLabel(selectedDate), [selectedDate]);
  const selectedStatusLabel = useMemo(() => formatStatusLabel(selectedStatus), [selectedStatus]);
  const selectedEmployeeLabel = useMemo(() => {
    if (selectedEmployee === 'Todos') {
      return 'Todos';
    }

    return employees.find((employee) => employee.id === selectedEmployee)?.name || 'Funcionário';
  }, [employees, selectedEmployee]);

  const openCreate = () => {
    setEditingItem(null);
    setModalVisible(true);
  };

  const openEdit = (item: SchedulingResolvedItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalVisible(false);
    setEditingItem(null);
  };

  const handleDelete = (item: SchedulingResolvedItem) => {
    Alert.alert(
      'Excluir agendamento',
      `Deseja realmente excluir o agendamento de ${item.petName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await schedulingService.remove(item.id);
              setSchedulings((current) => current.filter((schedule) => schedule.id !== item.id));
            } catch (deleteError) {
              const message = deleteError instanceof Error ? deleteError.message : 'Erro ao excluir agendamento';
              Alert.alert('Erro', message);
            }
          },
        },
      ],
    );
  };

  const handleSave = async (values: SchedulingFormValues) => {
    const effectiveClinicId =
      session?.clinicId ||
      editingItem?.clinicId ||
      employees.find((employee) => employee.id === values.employeeId)?.clinicId ||
      employees.find((employee) => employee.id === editingItem?.employeeId)?.clinicId ||
      '';

    if (!isWithinBusinessHours(values.time)) {
      Alert.alert('Erro', 'Os agendamentos devem ocorrer entre 09:00 e 17:59.');
      return;
    }

    const service = services.find((item) => item.id === values.serviceId);
    if (!service) {
      Alert.alert('Erro', 'Selecione um serviço válido.');
      return;
    }

    const payload = {
      clinicId: effectiveClinicId,
      tutorId: values.tutorId,
      petId: values.petId,
      employeeId: values.employeeId,
      status: normalizeStatus(values.status),
      dateTime: toIsoFromDateTime(values.date, values.time),
      totalValue: service.price,
      notes: values.notes.trim(),
    };

    setSaving(true);
    setError('');

    try {
      if (editingItem) {
        await schedulingService.update(editingItem.id, payload);
      } else {
        await schedulingService.create(payload);
      }

      await fetchData();
      setModalVisible(false);
      setEditingItem(null);
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Erro ao salvar agendamento';
      Alert.alert('Erro', message);
    } finally {
      setSaving(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    setError('');

    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  const initialValues = useMemo<SchedulingFormValues>(() => {
    if (editingItem) {
      return toFormValues(editingItem, services);
    }

    return emptyForm(selectedDate);
  }, [editingItem, selectedDate, services]);

  return {
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
  };
}