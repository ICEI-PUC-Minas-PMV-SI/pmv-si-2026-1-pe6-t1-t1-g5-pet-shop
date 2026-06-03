import { colors } from '../../theme';
import type { DaySlot, SchedulingOption, SchedulingResolvedItem } from './types';

export const SCHEDULING_STATUS_ORDER = ['Agendado', 'Confirmado', 'Em Andamento', 'Concluido', 'Cancelado'];

const STATUS_LABELS: Record<string, string> = {
  Agendado: 'Agendado',
  Confirmado: 'Confirmado',
  'Em Andamento': 'Em Andamento',
  Concluido: 'Concluído',
  Cancelado: 'Cancelado',
};

const STATUS_THEME: Record<string, { background: string; color: string }> = {
  Agendado: { background: colors.primaryBg, color: colors.primary },
  Confirmado: { background: 'rgba(23,114,187,0.14)', color: '#1768B6' },
  'Em Andamento': { background: 'rgba(245,182,77,0.18)', color: '#B87500' },
  Concluido: { background: 'rgba(125,199,103,0.18)', color: colors.success },
  Cancelado: { background: 'rgba(222,103,103,0.16)', color: colors.danger },
  Default: { background: colors.bgCard, color: colors.textSecondary },
};

export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '').toLowerCase();
}

export function normalizeStatus(value: string): string {
  const normalized = normalizeText(value);

  if (normalized === 'concluido' || normalized === 'concluida') {
    return 'Concluido';
  }

  if (normalized === 'emandamento' || normalized === 'emexecucao') {
    return 'Em Andamento';
  }

  if (normalized === 'confirmado') {
    return 'Confirmado';
  }

  if (normalized === 'cancelado') {
    return 'Cancelado';
  }

  return 'Agendado';
}

export function formatStatusLabel(value: string): string {
  return STATUS_LABELS[normalizeStatus(value)] || value;
}

export function getStatusTheme(value: string): { background: string; color: string } {
  return STATUS_THEME[normalizeStatus(value)] || STATUS_THEME.Default;
}

export function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseInputDateLocal(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  // Create date in local time to avoid UTC parsing shifts that change weekday labels.
  const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function toInputTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function toIsoFromDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function isValidDate(date: string): boolean {
  const parsed = parseInputDateLocal(date);
  return parsed !== null;
}

export function isWithinBusinessHours(time: string): boolean {
  const [hoursRaw] = time.split(':');
  const hours = Number(hoursRaw);

  if (!Number.isFinite(hours)) {
    return false;
  }

  return hours >= 9 && hours < 18;
}

export function formatDateLabel(value: string): string {
  const date = parseInputDateLocal(value);
  if (!date) {
    return value;
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function getRelativeDateLabel(value: string): string {
  const current = toInputDate(new Date());
  if (value === current) {
    return 'Hoje';
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (value === toInputDate(tomorrow)) {
    return 'Amanhã';
  }

  return formatDateLabel(value);
}

export function buildDateOptions(baseDate: Date, days = 7): SchedulingOption[] {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);

    const value = toInputDate(date);
    const label = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : formatDateLabel(value);

    return {
      label,
      value,
      description: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
    };
  });
}

export function buildStatusOptions(statuses: string[]): SchedulingOption[] {
  return ['Todos', ...statuses].map((status) => ({
    label: status === 'Todos' ? 'Todos' : formatStatusLabel(status),
    value: status,
  }));
}

export function buildEmployeeOptions(
  employees: Array<{ id: string; name: string; role?: string }>,
): SchedulingOption[] {
  return [
    { label: 'Todos', value: 'Todos' },
    ...employees.map((employee) => ({
      label: employee.name,
      value: employee.id,
      description: employee.role,
    })),
  ];
}

export function buildDaySlots(schedules: SchedulingResolvedItem[], selectedDate: string): DaySlot[] {
  const daySchedules = schedules.filter((schedule) => toInputDate(new Date(schedule.dateTime)) === selectedDate);
  const hours = Array.from({ length: 9 }, (_, index) => index + 9);

  return hours.map((hour) => {
    const schedule = daySchedules.find(
      (item) => new Date(item.dateTime).getHours() === hour && normalizeStatus(item.status) !== 'Cancelado',
    );

    return {
      hour,
      label: `${String(hour).padStart(2, '0')}:00`,
      status: schedule ? normalizeStatus(schedule.status) : 'Livre',
      occupied: Boolean(schedule),
      schedule,
    };
  });
}

export function sortByDateTime(items: SchedulingResolvedItem[]): SchedulingResolvedItem[] {
  return items.slice().sort((left, right) => new Date(left.dateTime).getTime() - new Date(right.dateTime).getTime());
}

export function getPetTutorId(pet: {
  tutorId?: string | number;
  tutor_id?: string | number;
  idTutor?: string | number;
  id_tutor?: string | number;
  tutorid?: string | number;
  tutorID?: string | number;
  ownerId?: string | number;
  owner_id?: string | number;
  responsavelId?: string | number;
  responsavel_id?: string | number;
  tutor?: { id?: string | number };
}): string {
  const rawPet = pet as unknown as Record<string, unknown>;

  if (typeof rawPet.tutorId === 'string' || typeof rawPet.tutorId === 'number') return String(rawPet.tutorId).trim();
  if (typeof rawPet.tutor_id === 'string' || typeof rawPet.tutor_id === 'number') return String(rawPet.tutor_id).trim();
  if (typeof rawPet.idTutor === 'string' || typeof rawPet.idTutor === 'number') return String(rawPet.idTutor).trim();
  if (typeof rawPet.id_tutor === 'string' || typeof rawPet.id_tutor === 'number') return String(rawPet.id_tutor).trim();
  if (typeof rawPet.tutorid === 'string' || typeof rawPet.tutorid === 'number') return String(rawPet.tutorid).trim();
  if (typeof rawPet.tutorID === 'string' || typeof rawPet.tutorID === 'number') return String(rawPet.tutorID).trim();
  if (typeof rawPet.ownerId === 'string' || typeof rawPet.ownerId === 'number') return String(rawPet.ownerId).trim();
  if (typeof rawPet.owner_id === 'string' || typeof rawPet.owner_id === 'number') return String(rawPet.owner_id).trim();
  if (typeof rawPet.responsavelId === 'string' || typeof rawPet.responsavelId === 'number') return String(rawPet.responsavelId).trim();
  if (typeof rawPet.responsavel_id === 'string' || typeof rawPet.responsavel_id === 'number') return String(rawPet.responsavel_id).trim();

  if (typeof rawPet.tutor === 'object' && rawPet.tutor !== null) {
    const tutorObject = rawPet.tutor as Record<string, unknown>;
    if (typeof tutorObject.id === 'string' || typeof tutorObject.id === 'number') {
      return String(tutorObject.id).trim();
    }
  }

  return '';
}

export function getPetTutorName(pet: {
  tutorName?: string;
  tutor_name?: string;
  ownerName?: string;
  owner_name?: string;
  responsavelNome?: string;
  responsavel_nome?: string;
  tutor?: { name?: string };
}): string {
  const rawPet = pet as unknown as Record<string, unknown>;
  if (typeof rawPet.tutorName === 'string') return rawPet.tutorName;
  if (typeof rawPet.tutor_name === 'string') return rawPet.tutor_name;
  if (typeof rawPet.ownerName === 'string') return rawPet.ownerName;
  if (typeof rawPet.owner_name === 'string') return rawPet.owner_name;
  if (typeof rawPet.responsavelNome === 'string') return rawPet.responsavelNome;
  if (typeof rawPet.responsavel_nome === 'string') return rawPet.responsavel_nome;

  if (typeof rawPet.tutor === 'object' && rawPet.tutor !== null) {
    const tutorObject = rawPet.tutor as Record<string, unknown>;
    if (typeof tutorObject.name === 'string') {
      return tutorObject.name;
    }
  }

  return '';
}