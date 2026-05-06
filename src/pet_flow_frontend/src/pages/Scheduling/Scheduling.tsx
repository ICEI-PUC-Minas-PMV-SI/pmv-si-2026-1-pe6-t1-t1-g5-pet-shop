import { useEffect, useMemo, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import {
  schedulingService,
  type Clinic,
  type Employee,
  type Pet,
  type PetService,
  type Scheduling,
  type Tutor,
} from '../../services/scheduling';
import SchedulingCalendar from './components/SchedulingCalendar';
import SchedulingDeleteConfirmModal from './components/SchedulingDeleteConfirmModal';
import SchedulingFormModal from './components/SchedulingFormModal';
import type { SchedulingFormData, SchedulingResolvedItem, SchedulingRow } from './types';
import styles from './Scheduling.module.css';

const statusOrder = ['Agendado', 'Confirmado', 'Em Andamento', 'Concluido', 'Cancelado'];

function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonday(sourceDate: Date): Date {
  const date = new Date(sourceDate);
  const weekDay = date.getDay();
  const distanceToMonday = weekDay === 0 ? -6 : 1 - weekDay;
  date.setDate(date.getDate() + distanceToMonday);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeStatus(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '');
}

function toIsoFromLocalDateTime(localDateTime: string): string {
  return new Date(localDateTime).toISOString();
}

function isWithinBusinessHours(localDateTime: string): boolean {
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) return false;

  const hour = date.getHours();
  return hour >= 9 && hour < 18;
}

export default function Scheduling() {
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
        status: editing?.status || 'Agendado',
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

  const columns: Column<SchedulingRow>[] = [
    {
      key: 'dateTime',
      header: 'Data/Hora',
      render: (item) => {
        const date = new Date(item.dateTime);
        return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}`;
      },
    },
    { key: 'petName', header: 'Pet' },
    { key: 'tutorName', header: 'Tutor' },
    { key: 'serviceName', header: 'Serviço' },
    { key: 'employeeName', header: 'Funcionário' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        const normalized = normalizeStatus(item.status);
        const statusClass =
          normalized === 'Concluido'
            ? styles.statusDone
            : normalized === 'Cancelado'
              ? styles.statusCancelado
              : normalized === 'Agendado'
                ? styles.statusScheduled
                : normalized === 'Confirmado'
                  ? styles.statusConfirmado
                  : styles.statusAndamento;

        return <span className={`${styles.statusPill} ${statusClass}`}>{item.status}</span>;
      },
    },
  ];

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
        dateTime: editing.dateTime,
        notes: editing.notes || '',
      }
    : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Agendamentos</h1>
        <button className={styles.newButton} type="button" onClick={handleOpenCreate}>
          + Novo Agendamento
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <label className={styles.field}>
            <span>Data</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Funcionário</span>
            <select
              value={employeeFilter}
              onChange={(event) => setEmployeeFilter(event.target.value)}
            >
              <option value="Todos">Todos</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.search}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar..."
            aria-label="Buscar agendamentos"
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Carregando agendamentos...</p>}

      {!loading && (
        <>
          <SchedulingCalendar weekDates={weekDates} items={filteredItems} />

          <div className={styles.tableWrap}>
            <DataTable<SchedulingRow>
              columns={columns}
              data={tableRows}
              onEdit={handleOpenEdit}
              onDelete={(row) => {
                handleDelete(row);
              }}
              currentPage={1}
              totalPages={1}
            />
          </div>
        </>
      )}

      <SchedulingFormModal
        open={modalOpen}
        title={editing ? 'Editar agendamento' : 'Novo agendamento'}
        tutors={tutors}
        pets={pets}
        employees={employees}
        services={services}
        loading={saving}
        initialData={initialModalData}
        onCancel={() => {
          if (saving) return;
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveScheduling}
      />

      <SchedulingDeleteConfirmModal
        open={deleteModalOpen}
        item={itemToDelete}
        loading={deleting}
        onCancel={() => {
          if (deleting) return;
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
