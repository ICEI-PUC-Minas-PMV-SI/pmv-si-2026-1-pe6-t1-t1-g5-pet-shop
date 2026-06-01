export function getTutorName(petId: string): string {
  return localStorage.getItem(`tutor_pet_${petId}`) || '—';
}
