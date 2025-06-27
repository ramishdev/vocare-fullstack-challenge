'use client';

import * as React from 'react';
import { format, isToday, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { InfoIcon } from 'lucide-react';

import AppointmentCard from '../shared/appointment-card';
import { AppointmentWithCategory } from '@/types/types';
import { usePastAppointments } from '@/hooks/usePastAppointments';
import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';
import { useAppointmentsContext } from '@/app/context/appointments';
import Loader from '../shared/Loader';

export default function AppointmentList() {
  const { selectedDate, filters } = useAppointmentsContext();
  const date = format(selectedDate, 'yyyy-MM-dd', { locale: de });

  // If date range is set, fetch all appointments in that range
  const isDateRange = filters.from && filters.to;
  const [rangeAppointments, setRangeAppointments] = React.useState<AppointmentWithCategory[]>([]);
  const [isLoadingRange, setIsLoadingRange] = React.useState(false);

  React.useEffect(() => {
    if (filters.from && filters.to) {
      setIsLoadingRange(true);
      const fromISO = filters.from.toISOString();
      const toISO = filters.to.toISOString();
      const params = new URLSearchParams({
        view: 'list',
        startDate: fromISO,
        endDate: toISO,
      });
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.patientId) {
        params.append('patientId', filters.patientId);
      }
      fetch(`/api/appointments?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          setIsLoadingRange(false)
          if (Array.isArray(data)) {
            setRangeAppointments(data);
          } else {
            setRangeAppointments([]);
          }
        });
      
    } else {
      setRangeAppointments([]);
    }
  }, [filters.from, filters.to, filters.category, filters.patientId, isDateRange]);

  const {
    appointments: pastAppts,
    loadMorePast,
    hasMorePast,
    isLoadingPast,
  } = usePastAppointments(selectedDate);

  const {
    appointments: upcomingAppts,
    loadMoreUpcoming,
    hasMoreUpcoming,
    isLoadingUpcoming,
  } = useUpcomingAppointments(selectedDate);

  const allAppts = React.useMemo(() => {
    if (isDateRange) {
      return [...rangeAppointments].sort((a, b) => {
        const aTime = a.start ? new Date(a.start).getTime() : 0;
        const bTime = b.start ? new Date(b.start).getTime() : 0;
        return aTime - bTime;
      });
    }
    return [...pastAppts, ...upcomingAppts].sort((a, b) => {
      const aTime = a.start ? new Date(a.start).getTime() : 0;
      const bTime = b.start ? new Date(b.start).getTime() : 0;
      return aTime - bTime;
    });
  }, [isDateRange, rangeAppointments, pastAppts, upcomingAppts]);

  const oldest = pastAppts.at(-1)?.start ?? date;
  const newest = upcomingAppts.at(-1)?.start ?? date;
  const oldestLabel = oldest
    ? format(parseISO(oldest), 'dd.MM.yyyy', { locale: de })
    : format(selectedDate, 'dd.MM.yyyy', { locale: de });
  const newestLabel = newest
    ? format(parseISO(newest), 'dd.MM.yyyy', { locale: de })
    : format(selectedDate, 'dd.MM.yyyy', { locale: de });

  const groups = React.useMemo(() => {
    return allAppts.reduce<Record<string, AppointmentWithCategory[]>>(
      (acc, appt) => {
        const dayLabel = appt.start
          ? format(parseISO(appt.start), 'EEEE, d. MMMM', { locale: de })
          : 'Unbekannt';
        (acc[dayLabel] ||= []).push(appt);
        return acc;
      },
      {}
    );
  }, [allAppts]);

  const entries = Object.entries(groups);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {isDateRange && isLoadingRange && (
        <div className="flex justify-center my-6">
          <Loader />
        </div>
      )}
      {!isDateRange && hasMorePast && (
        <div
          className="text-center text-sm font-semibold text-gray-600 mb-4 cursor-pointer hover:underline"
          onClick={loadMorePast}
        >
          {isLoadingPast
            ?  <Loader />
            : `Termine vor dem ${oldestLabel} laden`}
        </div>
      )}
      {!hasMorePast && (
        <div className="text-center text-sm text-gray-500 mb-4">
          Keine weiteren Termine gefunden
        </div>
      )}
      {entries.length === 0 ? (
        <div className="p-6 text-center text-gray-600">
          Keine Termine gefunden
        </div>
      ) : (
        entries.map(([dayLabel, appts]) => {
          const firstStart = appts[0]?.start;
          const isTodayBadge = firstStart
            ? isToday(parseISO(firstStart))
            : false;
          return (
            <section key={dayLabel} className="space-y-4 mb-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-black">{dayLabel}</h2>
                {isTodayBadge && (
                  <div
                    className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: '#E6F4EA',
                      color: '#1F6E4E',
                    }}
                  >
                    <InfoIcon className="w-3 h-3" />
                    Heute
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {appts.map((appt) => (
                  <AppointmentCard key={appt.id} appt={appt} />
                ))}
              </div>
            </section>
          );
        })
      )}

      {!isDateRange && hasMoreUpcoming && (
        <div
          className="text-center text-sm font-semibold text-gray-600 mt-4 cursor-pointer hover:underline"
          onClick={loadMoreUpcoming}
        >
          {isLoadingUpcoming
            ?  <Loader />
            : `Termine nach dem ${newestLabel} laden`}
        </div>
      )}

      {!hasMoreUpcoming && entries.length > 0 && (
        <div className="text-center text-sm text-gray-500 my-6">
          Keine weiteren Termine gefunden
        </div>
      )}
    </div>
  );
}
