import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { formatISO, addWeeks } from 'date-fns';
import fetcher from '@/lib/fetcher';
import { AppointmentWithCategory } from '@/types/types';

export function useWeekAppointments(selectedDate: Date) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [nextDate, setNextDate] = useState<Date>();

  const weekStartISO = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const mondayOffset = (dayOfWeek + 6) % 7;
    const baseMonday = new Date(selectedDate);
    baseMonday.setDate(selectedDate.getDate() - mondayOffset);

    const shiftedMonday = addWeeks(baseMonday, weekOffset);
    setNextDate(shiftedMonday);
    return formatISO(shiftedMonday);
  }, [selectedDate, weekOffset]);

  const key =
    `/api/appointments?view=week` + `&date=${encodeURIComponent(weekStartISO)}`;

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
