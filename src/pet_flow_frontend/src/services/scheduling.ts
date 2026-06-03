import { authRequest } from './auth';

export interface Scheduling {
  id: string;
  clinicId: string;
  tutorId: string;
  petId: string;
  employeeId: string;
  dateTime: string;
  status: string;
  totalValue: number;
  notes: string;
  createdAt: string;
}

export interface Tutor {
  id: string;
  name: string;
}

interface RawTutorPayload {
  id?: string | number;
  tutorId?: string | number;
  tutor_id?: string | number;
  idTutor?: string | number;
  id_tutor?: string | number;
  userId?: string | number;
  user_id?: string | number;
  uuid?: string | number;
  name?: string;
  tutorName?: string;
  tutor_name?: string;
}

export interface Pet {
  id: string;
  name: string;
  tutorId: string;
  tutorName?: string;
}

interface RawPetPayload {
  id?: string | number;
  name?: string;
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
  tutorName?: string;
  tutor_name?: string;
  ownerName?: string;
  owner_name?: string;
  responsavelNome?: string;
  responsavel_nome?: string;
  tutor?: {
    id?: string | number;
    name?: string;
  } | string | number;
}

function toStringId(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function getDynamicTutorId(rawPet: RawPetPayload): string {
  const raw = rawPet as unknown as Record<string, unknown>;

  for (const [key, value] of Object.entries(raw)) {
    const normalizedKey = key.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const looksLikeTutorId = /^(tutorid|ownerid|responsavelid)$/.test(normalizedKey);

    if (!looksLikeTutorId) {
      continue;
    }

    const normalizedValue = toStringId(value);
    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return '';
}

function getDynamicTutorName(rawPet: RawPetPayload): string {
  const raw = rawPet as unknown as Record<string, unknown>;

  for (const [key, value] of Object.entries(raw)) {
    const normalizedKey = key.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const looksLikeTutorName = /^(tutorname|ownername|responsavelnome)$/.test(normalizedKey);

    if (!looksLikeTutorName || typeof value !== 'string') {
      continue;
    }

    const normalizedValue = value.trim();
    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return '';
}

function normalizePet(rawPet: RawPetPayload): Pet {
  const petId = toStringId(rawPet.id);
  const cachedTutorName =
    typeof localStorage !== 'undefined' && petId
      ? localStorage.getItem(`tutor_pet_${petId}`) || undefined
      : undefined;

  const nestedTutorId =
    typeof rawPet.tutor === 'object' && rawPet.tutor !== null
      ? toStringId((rawPet.tutor as { id?: string | number }).id)
      : toStringId(rawPet.tutor);

  const nestedTutorName =
    typeof rawPet.tutor === 'object' && rawPet.tutor !== null
      ? (rawPet.tutor as { name?: string }).name
      : undefined;

  return {
    id: petId,
    name: rawPet.name || '',
    tutorId:
      toStringId(rawPet.tutorId) ||
      toStringId(rawPet.tutor_id) ||
      toStringId(rawPet.idTutor) ||
      toStringId(rawPet.id_tutor) ||
      toStringId(rawPet.tutorid) ||
      toStringId(rawPet.tutorID) ||
      toStringId(rawPet.ownerId) ||
      toStringId(rawPet.owner_id) ||
      toStringId(rawPet.responsavelId) ||
      toStringId(rawPet.responsavel_id) ||
      nestedTutorId ||
      getDynamicTutorId(rawPet),
    tutorName:
      rawPet.tutorName ||
      rawPet.tutor_name ||
      rawPet.ownerName ||
      rawPet.owner_name ||
      rawPet.responsavelNome ||
      rawPet.responsavel_nome ||
      nestedTutorName ||
      getDynamicTutorName(rawPet) ||
      cachedTutorName,
  };
}

function hasTutorLink(pet: Pet): boolean {
  return toStringId(pet.tutorId) !== '';
}

function normalizeTutor(rawTutor: RawTutorPayload): Tutor {
  return {
    id:
      toStringId(rawTutor.id) ||
      toStringId(rawTutor.tutorId) ||
      toStringId(rawTutor.tutor_id) ||
      toStringId(rawTutor.idTutor) ||
      toStringId(rawTutor.id_tutor) ||
      toStringId(rawTutor.userId) ||
      toStringId(rawTutor.user_id) ||
      toStringId(rawTutor.uuid),
    name: rawTutor.name || rawTutor.tutorName || rawTutor.tutor_name || '',
  };
}

export interface Employee {
  id: string;
  name: string;
}

export interface PetService {
  id: string;
  name: string;
  price: number;
}

export interface Clinic {
  id: string;
  name: string;
}

export interface SaveSchedulingPayload {
  clinicId: string;
  tutorId: string;
  petId: string;
  employeeId: string;
  dateTime: string;
  status: string;
  totalValue: number;
  notes?: string;
}

export const schedulingService = {
  list: (): Promise<Scheduling[]> => authRequest<Scheduling[]>('/scheduling', { method: 'GET' }),
  create: (payload: SaveSchedulingPayload): Promise<Scheduling> =>
    authRequest<Scheduling>('/scheduling', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: SaveSchedulingPayload): Promise<Scheduling> =>
    authRequest<Scheduling>(`/scheduling/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id: string): Promise<void> =>
    authRequest<void>(`/scheduling/${id}`, {
      method: 'DELETE',
    }),
  listTutors: async (): Promise<Tutor[]> => {
    const response = await authRequest<RawTutorPayload[]>('/tutor', { method: 'GET' });
    return response.map(normalizeTutor);
  },
  listPets: async (): Promise<Pet[]> => {
    const primaryResponse = await authRequest<RawPetPayload[]>('/pet', { method: 'GET' });
    const primaryPets = primaryResponse.map(normalizePet);

    if (primaryPets.some(hasTutorLink)) {
      return primaryPets;
    }

    try {
      const fallbackResponse = await authRequest<RawPetPayload[]>('/pets', { method: 'GET' });
      const fallbackPets = fallbackResponse.map(normalizePet);

      if (fallbackPets.some(hasTutorLink)) {
        return fallbackPets;
      }
    } catch {
      // Keep primary response when fallback route is unavailable.
    }

    return primaryPets;
  },
  listEmployees: (): Promise<Employee[]> => authRequest<Employee[]>('/employee', { method: 'GET' }),
  getEmployeeById: (id: string): Promise<Employee> => authRequest<Employee>(`/employee/${id}`, { method: 'GET' }),
  listPetServices: (): Promise<PetService[]> => authRequest<PetService[]>('/service', { method: 'GET' }),
  listClinics: (): Promise<Clinic[]> => authRequest<Clinic[]>('/clinic', { method: 'GET' }),
};
