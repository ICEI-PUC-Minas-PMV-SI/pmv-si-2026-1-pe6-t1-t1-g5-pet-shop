import { useEffect, useMemo, useState } from 'react';
import { MdClose } from 'react-icons/md';
import type { Employee, Pet, PetService, Tutor } from '../../../services/scheduling';
import type { SchedulingFormData } from '../types';
import styles from './SchedulingFormModal.module.css';

interface SchedulingFormModalProps {
  open: boolean;
  title?: string;
  tutors: Tutor[];
  pets: Pet[];
  employees: Employee[];
  services: PetService[];
  loading?: boolean;
  initialData?: SchedulingFormData;
  onCancel: () => void;
  onSave: (data: SchedulingFormData) => Promise<void>;
}

const emptyForm: SchedulingFormData = {
  tutorId: '',
  petId: '',
  serviceId: '',
  employeeId: '',
  dateTime: '',
  notes: '',
};

function getPetTutorId(pet: Pet): string {
  const rawPet = pet as unknown as Record<string, unknown>;

  if (typeof rawPet.tutorId === 'string') return rawPet.tutorId;
  if (typeof rawPet.tutor_id === 'string') return rawPet.tutor_id;

  return '';
}

function getPetTutorName(pet: Pet): string {
  const rawPet = pet as unknown as Record<string, unknown>;

  if (typeof rawPet.tutorName === 'string') return rawPet.tutorName;
  if (typeof rawPet.tutor_name === 'string') return rawPet.tutor_name;

  return '';
}

function normalizeId(value: string): string {
  return value.trim().toLowerCase();
}

function toLocalDatetimeValue(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const timezoneOffsetMs = date.getTimezoneOffset() * 60_000;
  const localDate = new Date(date.getTime() - timezoneOffsetMs);
  return localDate.toISOString().slice(0, 16);
}

export default function SchedulingFormModal({
  open,
  title = 'Novo agendamento',
  tutors,
  pets,
  employees,
  services,
  loading = false,
  initialData,
  onCancel,
  onSave,
}: SchedulingFormModalProps) {
  const [form, setForm] = useState<SchedulingFormData>(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        ...initialData,
        dateTime: toLocalDatetimeValue(initialData.dateTime),
      });
      return;
    }

    setForm(emptyForm);
  }, [open, initialData]);

  const filteredPets = useMemo(() => {
    const selectedTutorName =
      tutors.find((tutor) => normalizeId(tutor.id) === normalizeId(form.tutorId))?.name || '';
    const normalizedSelectedTutorName = normalizeId(selectedTutorName);

    const petsByTutor = pets.filter((pet) =>
      form.tutorId
        ? normalizeId(getPetTutorId(pet)) === normalizeId(form.tutorId) ||
          (normalizedSelectedTutorName !== '' &&
            normalizeId(getPetTutorName(pet)) === normalizedSelectedTutorName)
        : true,
    );

    if (petsByTutor.length > 0 || !form.petId) return petsByTutor;

    const selectedPet = pets.find((pet) => normalizeId(pet.id) === normalizeId(form.petId));
    return selectedPet ? [selectedPet] : petsByTutor;
  }, [pets, tutors, form.tutorId, form.petId]);

  if (!open) return null;

  const handleChange = (field: keyof SchedulingFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'tutorId' ? { petId: '' } : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(form);
  };

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            type="button"
            onClick={onCancel}
            aria-label="Fechar modal"
          >
            <MdClose size={28} />
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Tutor</span>
            <select
              value={form.tutorId}
              onChange={(event) => handleChange('tutorId', event.target.value)}
              required
            >
              <option value="">Selecione o tutor</option>
              {tutors.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Pet</span>
            <select
              value={form.petId}
              onChange={(event) => handleChange('petId', event.target.value)}
              required
            >
              <option value="">Selecione o pet</option>
              {filteredPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Serviço</span>
            <select
              value={form.serviceId}
              onChange={(event) => handleChange('serviceId', event.target.value)}
              required
            >
              <option value="">Selecione o serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Funcionário responsável</span>
            <select
              value={form.employeeId}
              onChange={(event) => handleChange('employeeId', event.target.value)}
              required
            >
              <option value="">Selecione o funcionário</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>

          <label className={`${styles.field} ${styles.fieldNotes}`}>
            <span>Observações</span>
            <textarea
              value={form.notes}
              onChange={(event) => handleChange('notes', event.target.value)}
              placeholder="Observações sobre o agendamento..."
            />
          </label>

          <label className={styles.field}>
            <span>Data e hora</span>
            <input
              type="datetime-local"
              value={form.dateTime}
              onChange={(event) => handleChange('dateTime', event.target.value)}
              required
            />
          </label>

          <footer className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
