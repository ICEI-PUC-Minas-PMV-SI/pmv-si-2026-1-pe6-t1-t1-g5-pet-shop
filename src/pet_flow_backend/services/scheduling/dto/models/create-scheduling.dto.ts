export interface CreateSchedulingDto {
  clinicId: string;
  tutorId: string;
  petId: string;
  employeeId: string;
  dateTime: Date;
  status: string;
  totalValue: number;
  notes?: string;
}
