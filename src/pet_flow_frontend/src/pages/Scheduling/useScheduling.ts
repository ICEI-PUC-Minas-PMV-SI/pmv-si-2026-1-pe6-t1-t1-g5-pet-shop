import { useEffect, useMemo, useState } from 'react';
import {
  schedulingService,
  type Clinic,
  type Employee,
  type Pet,
  type PetService,
  type Scheduling,
  type Tutor,
} from '../../services/scheduling';
import { toInputDate, getMonday, addDays, isWithinBusinessHours, toIsoFromLocalDateTime } from './utils';
import type { SchedulingFormData, SchedulingResolvedItem, SchedulingRow } from './types';

const statusOrder = ['Agendado', 'Confirmado', 'Em Andamento', 'Concluido', 'Cancelado'];

export function useScheduling() {
  const [items, setItems] = useState<Scheduling[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<PetService[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [employeeFilter, setEmployeeFilter] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState(toInputDate(new Date()));
  const [dateInitializedFromData, setDateInitializedFromData] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SchedulingResolvedItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SchedulingRow | null>(null);

  const clinicId = clinics[0]?.id || '';

  const weekDates = useMemo(() => {
    const start = getMonday(new Date(selectedDate));
    return [0, 1, 2, 3, 4].map((offset) => addDays(start, offset));
  }, [selectedDate]);

  const maps = useMemo(() => {
    const tutorMap = new Map(tutors.map((item) => [item.id, item.name]));
    const petMap = new Map(pets.map((item) => [item.id, item.name]));
    const employeeMap = new Map(employees.map((item) => [item.id, item.name]));
    const serviceByPrice = new Map(
      services.map((item) => [Number(item.price.toFixed(2)), item.name] as const),
    );

    return { tutorMap, petMap, employeeMap, serviceByPrice };
  }, [tutors, pets, employees, services]);

  const resolvedItems = useMemo<SchedulingResolvedItem[]>(() => {
    return items.map((item) => {
      const matchingService = maps.serviceByPrice.get(Number(item.totalValue.toFixed(2))) || '-';

      return {
        ...item,
        tutorName: maps.tutorMap.get(item.tutorId) || '-',
        petName: maps.petMap.get(item.petId) || '-',
        employeeName: maps.employeeMap.get(item.employeeId) || '-',
        serviceName: matchingService,
      };
    });
  }, [items, maps]);

  const filteredItems = useMemo(() => {
    return resolvedItems.filter((item) => {
      const date = new Date(item.dateTime);
      const monday = weekDates[0];
      const friday = weekDates[4];

      const inWeek = date >= monday && date < addDays(friday, 1);
      if (!inWeek) return false;

      const byStatus = statusFilter === 'Todos' || item.status === statusFilter;
      if (!byStatus) return false;

      const byEmployee =
        employeeFilter === 'Todos' || item.employeeId === employeeFilter;
      if (!byEmployee) return false;

      const searchTarget = `${item.petName} ${item.tutorName} ${item.employeeName} ${item.serviceName}`
        .toLowerCase();

      return search.trim() === '' || searchTarget.includes(search.toLowerCase());
    });
  }, [employeeFilter, resolvedItems, search, statusFilter, weekDates]);

  const tableRows = useMemo<SchedulingRow[]>(() => {
    return filteredItems
      .slice()
      .sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime))
      .map((item) => ({
        id: item.id,
        dateTime: item.dateTime,
        petName: item.petName,
        tutorName: item.tutorName,
        serviceName: item.serviceName,
        employeeName: item.employeeName,
        status: item.status,
      }));
  }, [filteredItems]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [scheduling, tutorsList, petsList, employeesList, servicesList, clinicsList] =
          await Promise.all([
            schedulingService.list(),
            schedulingService.listTutors(),
            schedulingService.listPets(),
            schedulingService.listEmployees(),
            schedulingService.listPetServices(),
            schedulingService.listClinics(),
          ]);

        let resolvedEmployees = employeesList;
        const employeeIdsFromScheduling = Array.from(
          new Set(
            scheduling
              .map((item) => item.employeeId)
              .filter((employeeId) => typeof employeeId === 'string' && employeeId.trim() !== ''),
          ),
        );

        if (employeeIdsFromScheduling.length > 0) {
          const existingEmployeeIds = new Set(resolvedEmployees.map((employee) => employee.id));
          const missingEmployeeIds = employeeIdsFromScheduling.filter(
            (employeeId) => !existingEmployeeIds.has(employeeId),
          );

          if (missingEmployeeIds.length > 0) {
            const employeeDetails = await Promise.allSettled(
              missingEmployeeIds.map((employeeId) => schedulingService.getEmployeeById(employeeId)),
            );

            const recoveredEmployees = employeeDetails
              .filter(
                (result): result is PromiseFulfilledResult<Employee> =>
                  result.status === 'fulfilled',
              )
              .map((result) => result.value);

            if (recoveredEmployees.length > 0) {
              resolvedEmployees = [...resolvedEmployees, ...recoveredEmployees];
            }
          }
        }

        setItems(scheduling);
        setTutors(tutorsList);
        setPets(petsList);
        setEmployees(resolvedEmployees);
        setServices(servicesList);
        setClinics(clinicsList);

        if (!dateInitializedFromData && scheduling.length > 0) {
          const firstDate = new Date(
            scheduling
              .slice()
              .sort((a, b) => +new Date(a.dateTime) - +new Date(b.dateTime))[0].dateTime,
          );
          setSelectedDate(toInputDate(firstDate));
          setDateInitializedFromData(true);
        }
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Erro ao carregar agendamentos';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleDelete = async (row: SchedulingRow) => {
    setItemToDelete(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleting(true);
    try {
      await schedulingService.remove(itemToDelete.id);
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (removeError) {
      const message =
        removeError instanceof Error ? removeError.message : 'Erro ao excluir agendamento';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (row: SchedulingRow) => {
    const current = resolvedItems.find((item) => item.id === row.id);
    if (!current) return;

    const matchedService = services.find(
      (service) => Number(service.price.toFixed(2)) === Number(current.totalValue.toFixed(2)),
    );

    setEditing({
      ...current,
      serviceName: matchedService?.name || current.serviceName,
    });
    setModalOpen(true);
  };

  const saveScheduling = async (form: SchedulingFormData) => {
    if (!clinicId) {
      setError('Nenhuma clínica disponível para vincular o agendamento.');
      return;
    }

    if (!isWithinBusinessHours(form.dateTime)) {
      setError('Os agendamentos devem ocorrer entre 09:00 e 17:59.');
      return;
    }

    const selectedService = services.find((item) => item.id === form.serviceId);
    if (!selectedService) {
      setError('Selecione um serviço válido.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        clinicId,
        tutorId: form.tutorId,
        petId: form.petId,
        employeeId: form.employeeId,
        dateTime: toIsoFromLocalDateTime(form.dateTime),
        status: form.status,
        totalValue: selectedService.price,
        notes: form.notes,
      };

      if (editing) {
        const updated = await schedulingService.update(editing.id, payload);
        setItems((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
      } else {
        const created = await schedulingService.create(payload);
        setItems((prev) => [...prev, created]);
      }

      setModalOpen(false);
      setEditing(null);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : 'Erro ao salvar agendamento';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = useMemo(() => {
    const backendStatuses = Array.from(new Set(items.map((item) => item.status)));
    const ordered = statusOrder.filter((status) => backendStatuses.includes(status));
    const additional = backendStatuses.filter((status) => !statusOrder.includes(status));
    return ['Todos', ...ordered, ...additional];
  }, [items]);

  const initialModalData: SchedulingFormData | undefined = editing
    ? {
        tutorId: editing.tutorId,
        petId: editing.petId,
        serviceId:
          services.find(
            (service) =>
              Number(service.price.toFixed(2)) === Number(editing.totalValue.toFixed(2)),
          )?.id || '',
        employeeId: editing.employeeId,
        status: editing.status,
        dateTime: editing.dateTime,
        notes: editing.notes || '',
      }
    : undefined;

  return {
    loading,
    saving,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    employeeFilter,
    setEmployeeFilter,
    selectedDate,
    setSelectedDate,
    modalOpen,
    setModalOpen,
    editing,
    setEditing,
    deleteModalOpen,
    deleting,
    itemToDelete,
    setDeleteModalOpen,
    setItemToDelete,
    weekDates,
    filteredItems,
    tableRows,
    employees,
    tutors,
    pets,
    services,
    statusOptions,
    initialModalData,
    handleDelete,
    confirmDelete,
    handleOpenCreate,
    handleOpenEdit,
    saveScheduling,
  };
}
