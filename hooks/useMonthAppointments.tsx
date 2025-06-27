import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { formatISO, addMonths } from 'date-fns';
import fetcher from '@/lib/fetcher';
import { AppointmentWithCategory, FilterOptions } from '@/types/types';

export function useMonthAppointments(selectedDate: Date, filters?: FilterOptions) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [currentMonthStart, setCurrentMonthStart] = useState<Date>();

  useEffect(() => {
    setMonthOffset(0);
  }, [selectedDate]);
  const monthStartISO = useMemo(() => {
    const firstOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const shifted = addMonths(firstOfMonth, monthOffset);
    setCurrentMonthStart(shifted);
    return formatISO(shifted);
  }, [selectedDate, monthOffset]);
  
  const params = new URLSearchParams({
    view: 'month',
    date: monthStartISO,
  });
  if (filters?.category) params.append('category', filters.category);
  if (filters?.patientId) params.append('patientId', filters.patientId);
  if (filters?.from && filters?.to) {
    params.append('startDate', filters.from.toISOString());
    params.append('endDate', filters.to.toISOString());
  }
  const key = `/api/appointments?${params.toString()}`;

  const { data, error, isValidating } = useSWR<AppointmentWithCategory[]>(
    key,
    fetcher
  );

  return {
    appointments: data ?? [],
    isLoading: !data && isValidating,
    error,
    currentMonthStart,
    loadPrevMonth: () => setMonthOffset((o) => o - 1),
    loadNextMonth: () => setMonthOffset((o) => o + 1),
    resetToSelectedMonth: () => setMonthOffset(0),
  };
}
