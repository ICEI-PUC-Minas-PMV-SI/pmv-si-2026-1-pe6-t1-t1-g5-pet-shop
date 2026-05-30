export function toInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonday(sourceDate: Date): Date {
  const date = new Date(sourceDate);
  const weekDay = date.getDay();
  const distanceToMonday = weekDay === 0 ? -6 : 1 - weekDay;
  date.setDate(date.getDate() + distanceToMonday);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function normalizeStatus(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '');
}

export function toIsoFromLocalDateTime(localDateTime: string): string {
  return new Date(localDateTime).toISOString();
}

export function isWithinBusinessHours(localDateTime: string): boolean {
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) return false;

  const hour = date.getHours();
  return hour >= 9 && hour < 18;
}
