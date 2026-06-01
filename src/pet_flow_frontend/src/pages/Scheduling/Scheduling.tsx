import { MdSearch } from 'react-icons/md';
import DataTable, { type Column } from '../../components/DataTable/DataTable';
import { useScheduling } from './useScheduling';
import { normalizeStatus } from './utils';
import SchedulingCalendar from './components/SchedulingCalendar';
import SchedulingDeleteConfirmModal from './components/SchedulingDeleteConfirmModal';
import SchedulingFormModal from './components/SchedulingFormModal';
import type { SchedulingRow } from './types';
import styles from './Scheduling.module.css';

export default function Scheduling() {
  const {
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
  } = useScheduling();

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
