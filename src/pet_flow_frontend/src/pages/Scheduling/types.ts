import type {
  Employee,
  Pet,
  PetService,
  Scheduling,
  Tutor,
} from '../../services/scheduling';

export interface SchedulingFormData {
  tutorId: string;
  petId: string;
  serviceId: string;
  employeeId: string;
  dateTime: string;
  notes: string;
}

export interface SchedulingRow {
  [key: string]: string;
  id: string;
  dateTime: string;
  petName: string;
  tutorName: string;
  serviceName: string;
  employeeName: string;
  status: string;
}

export interface SchedulingResolvedItem extends Scheduling {
  tutorName: string;
  petName: string;
  employeeName: string;
  serviceName: string;
}

export interface SchedulingReferences {
  tutors: Tutor[];
  pets: Pet[];
  employees: Employee[];
  services: PetService[];
}
