import { authRequest } from './http';

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

interface RawSchedulingPayload {
  id?: string | number;
  clinicId?: string | number;
  clinic_id?: string | number;
  tutorId?: string | number;
  tutor_id?: string | number;
  petId?: string | number;
  pet_id?: string | number;
  employeeId?: string | number;
  employee_id?: string | number;
  dateTime?: string;
  date_time?: string;
  status?: string;
  totalValue?: number | string;
  total_value?: number | string;
  notes?: string;
  createdAt?: string;
  created_at?: string;
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
  photo_url?: string;
}

interface RawPetPayload {
  id?: string;
  name?: string;
  tutorId?: string;
  tutor_id?: string;
  idTutor?: string;
  id_tutor?: string;
  tutorid?: string;
  tutorID?: string;
  ownerId?: string;
  owner_id?: string;
  responsavelId?: string;
  responsavel_id?: string;
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
  photo_url?: string;
}

export interface Employee {
  id: string;
  name: string;
  role?: string;
  clinicId?: string;
}

export interface PetService {
  id: string;
  name: string;
  price: number;
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

function toStringId(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

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
  const nestedTutorId =
    typeof rawPet.tutor === 'object' && rawPet.tutor !== null
      ? toStringId((rawPet.tutor as { id?: string | number }).id)
      : toStringId(rawPet.tutor);

  const nestedTutorName =
    typeof rawPet.tutor === 'object' && rawPet.tutor !== null
      ? (rawPet.tutor as { name?: string }).name
      : undefined;

  const tutorId =
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
    getDynamicTutorId(rawPet);

  const tutorName =
    rawPet.tutorName ||
    rawPet.tutor_name ||
    rawPet.ownerName ||
    rawPet.owner_name ||
    rawPet.responsavelNome ||
    rawPet.responsavel_nome ||
    nestedTutorName ||
    getDynamicTutorName(rawPet);

  return {
    id: toStringId(rawPet.id),
    name: rawPet.name || '',
    tutorId,
    tutorName,
    photo_url: rawPet.photo_url,
  };
}

function hasTutorLink(pet: Pet): boolean {
  return toStringId(pet.tutorId) !== '';
}

function mergePetsById(primaryPets: Pet[], fallbackPets: Pet[]): Pet[] {
  const merged = new Map<string, Pet>();

  for (const pet of primaryPets) {
    const id = toStringId(pet.id);
    if (!id) continue;
    merged.set(id, pet);
  }

  for (const pet of fallbackPets) {
    const id = toStringId(pet.id);
    if (!id) continue;

    const existing = merged.get(id);
    if (!existing) {
      merged.set(id, pet);
      continue;
    }

    const mergedPet: Pet = {
      ...existing,
      tutorId: toStringId(existing.tutorId) || toStringId(pet.tutorId),
      tutorName: existing.tutorName || pet.tutorName,
      photo_url: existing.photo_url || pet.photo_url,
    };

    merged.set(id, mergedPet);
  }

  return Array.from(merged.values());
}

async function fetchPetDetailsById(id: string): Promise<Pet | null> {
  if (!id) {
    return null;
  }

  try {
    const payload = await authRequest<RawPetPayload>(`/pet/${id}`, { method: 'GET' });
    return normalizePet(payload);
  } catch {
    // Try legacy/alternate route variants before giving up.
  }

  try {
    const payload = await authRequest<RawPetPayload>(`/pets/${id}`, { method: 'GET' });
    return normalizePet(payload);
  } catch {
    return null;
  }
}

async function enrichPetsWithoutTutorLink(pets: Pet[]): Promise<Pet[]> {
  const unresolvedIds = Array.from(
    new Set(
      pets
        .filter((pet) => !hasTutorLink(pet))
        .map((pet) => toStringId(pet.id))
        .filter((id) => id !== ''),
    ),
  );

  if (unresolvedIds.length === 0) {
    return pets;
  }

  const detailResults = await Promise.allSettled(
    unresolvedIds.slice(0, 60).map((id) => fetchPetDetailsById(id)),
  );

  const detailPets = detailResults
    .filter((result): result is PromiseFulfilledResult<Pet | null> => result.status === 'fulfilled')
    .map((result) => result.value)
    .filter((pet): pet is Pet => Boolean(pet));

  if (detailPets.length === 0) {
    return pets;
  }

  return mergePetsById(pets, detailPets);
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

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeScheduling(raw: RawSchedulingPayload): Scheduling {
  return {
    id: toStringId(raw.id),
    clinicId: toStringId(raw.clinicId) || toStringId(raw.clinic_id),
    tutorId: toStringId(raw.tutorId) || toStringId(raw.tutor_id),
    petId: toStringId(raw.petId) || toStringId(raw.pet_id),
    employeeId: toStringId(raw.employeeId) || toStringId(raw.employee_id),
    dateTime: raw.dateTime || raw.date_time || '',
    status: raw.status || 'Agendado',
    totalValue: toNumber(raw.totalValue ?? raw.total_value),
    notes: raw.notes || '',
    createdAt: raw.createdAt || raw.created_at || '',
  };
}

export const schedulingService = {
  list(): Promise<Scheduling[]> {
    return authRequest<RawSchedulingPayload[]>('/scheduling', { method: 'GET' }).then((items) =>
      items.map(normalizeScheduling),
    );
  },

  create(payload: SaveSchedulingPayload): Promise<Scheduling> {
    return authRequest<RawSchedulingPayload>('/scheduling', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(normalizeScheduling);
  },

  update(id: string, payload: SaveSchedulingPayload): Promise<Scheduling> {
    return authRequest<RawSchedulingPayload>(`/scheduling/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then(normalizeScheduling);
  },

  remove(id: string): Promise<void> {
    return authRequest<void>(`/scheduling/${id}`, { method: 'DELETE' });
  },

  listTutors(): Promise<Tutor[]> {
    return authRequest<RawTutorPayload[]>('/tutor', { method: 'GET' }).then((items) =>
      items.map(normalizeTutor),
    );
  },

  async listPets(): Promise<Pet[]> {
    const primaryItems = await authRequest<RawPetPayload[]>('/pet', { method: 'GET' });
    const primaryPets = primaryItems.map(normalizePet);
    let fallbackPets: Pet[] = [];

    try {
      const fallbackItems = await authRequest<RawPetPayload[]>('/pets', { method: 'GET' });
      fallbackPets = fallbackItems.map(normalizePet);
    } catch {
      // Keep only primary response when fallback route is unavailable.
    }

    if (fallbackPets.length === 0) {
      return enrichPetsWithoutTutorLink(primaryPets);
    }

    const mergedPets = mergePetsById(primaryPets, fallbackPets);
    const basePets = mergedPets.length > 0 ? mergedPets : primaryPets;
    return enrichPetsWithoutTutorLink(basePets);
  },

  async getPetById(id: string): Promise<Pet> {
    try {
      const payload = await authRequest<RawPetPayload>(`/pet/${id}`, { method: 'GET' });
      return normalizePet(payload);
    } catch {
      const payload = await authRequest<RawPetPayload>(`/pets/${id}`, { method: 'GET' });
      return normalizePet(payload);
    }
  },

  listEmployees(): Promise<Employee[]> {
    return authRequest<Employee[]>('/employee', { method: 'GET' });
  },

  listPetServices(): Promise<PetService[]> {
    return authRequest<PetService[]>('/service', { method: 'GET' });
  },
};