import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { formatISO, addWeeks } from 'date-fns';
import fetcher from '@/lib/fetcher';
import { AppointmentWithCategory, FilterOptions } from '@/types/types';

export function useWeekAppointments(
  selectedDate: Date,
  filters?: FilterOptions
) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [nextDate, setNextDate] = useState<Date>();
  useEffect(() => {
    setWeekOffset(0);
  }, [selectedDate]);
  const weekStartISO = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const mondayOffset = (dayOfWeek + 6) % 7;
    const baseMonday = new Date(selectedDate);
    baseMonday.setDate(selectedDate.getDate() - mondayOffset);

    const shiftedMonday = addWeeks(baseMonday, weekOffset);
    setNextDate(shiftedMonday);
    return formatISO(shiftedMonday);
  }, [selectedDate, weekOffset]);

  // Build query params for filters
  const params = new URLSearchParams({
    view: 'week',
    date: weekStartISO,
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
    nextDate,
    loadPrevWeek: () => setWeekOffset((o) => o - 1),
    loadNextWeek: () => setWeekOffset((o) => o + 1),
    resetToSelectedWeek: () => setWeekOffset(0),
  };
}
