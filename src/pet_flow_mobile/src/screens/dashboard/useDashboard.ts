import { useMemo } from 'react';
import { useScheduling } from '../scheduling/useScheduling';
import { useFinancial } from '../financial/useFinancial';

function isSameDay(first: Date, second: Date) {
  return (
    first.getDate() === second.getDate() &&
    first.getMonth() === second.getMonth() &&
    first.getFullYear() === second.getFullYear()
  );
}

function parseScheduledDate(dateTime: string): Date {
  return new Date(dateTime);
}

export function useDashboard() {
  const { loading: loadingScheduling, resolvedItems, pets, error: schedulingError } = useScheduling();
  const { loading: loadingFinancial, revenue, transactions } = useFinancial();

  const loading = loadingScheduling || loadingFinancial;
  const error = schedulingError;

  const appointmentsToday = useMemo(() => {
    return resolvedItems.filter((item) => isSameDay(parseScheduledDate(item.dateTime), new Date())).length;
  }, [resolvedItems]);

  const petsCount = pets.length;

  const alertsCount = 0;

  const upcomingAppointments = useMemo(() => {
    return resolvedItems
      .filter((item) => parseScheduledDate(item.dateTime).getTime() >= new Date().getTime())
      .sort((a, b) => parseScheduledDate(a.dateTime).getTime() - parseScheduledDate(b.dateTime).getTime())
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        petName: item.petName,
        serviceName: item.serviceName,
        tutorName: item.tutorName,
        employeeName: item.employeeName,
        dateTime: item.dateTime,
      }));
  }, [resolvedItems]);

  return {
    loading,
    error,
    appointmentsToday,
    petsCount,
    revenue,
    alertsCount,
    upcomingAppointments,
    transactions,
  };
}
