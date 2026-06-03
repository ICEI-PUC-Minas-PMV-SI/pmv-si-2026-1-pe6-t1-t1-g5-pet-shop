import type { Employee, Pet, PetService, Scheduling, Tutor } from '../../services/scheduling';

export interface SchedulingFormValues {
  tutorId: string;
  petId: string;
  serviceId: string;
  employeeId: string;
  status: string;
  date: string;
  time: string;
  notes: string;
}

export interface SchedulingResolvedItem extends Scheduling {
  tutorName: string;
  petName: string;
  employeeName: string;
  serviceName: string;
  photoUrl?: string;
}

export interface SchedulingOption {
  label: string;
  value: string;
  description?: string;
}

export interface DaySlot {
  label: string;
  hour: number;
  status: string;
  occupied: boolean;
  schedule?: SchedulingResolvedItem;
}

export interface SchedulingReferenceData {
  tutors: Tutor[];
  pets: Pet[];
  employees: Employee[];
  services: PetService[];
}