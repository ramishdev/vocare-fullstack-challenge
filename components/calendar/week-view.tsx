'use client';

import React, { useMemo } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  setHours,
  isToday,
  isSameHour,
  differenceInMinutes,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { useWeekAppointments } from '@/hooks/useWeekAppointments';
import { useAppointmentsContext } from '@/app/context/appointments';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppointmentWithCategory } from '@/types/types';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import AppointmentCardCompact from '../shared/appointment-card-compact';
import { AppointmentHoverCardContent } from '../shared/appointment-hover-card';
import Loader from '../shared/Loader';

// constants
const START_HOUR = 0;
const END_HOUR = 24;

const AppointmentMapping = ({
  appointments,
  hour,
}: {
  appointments: AppointmentWithCategory[];
  hour: Date;
}) => {
  return (
    <div className="h-20 border-t last:border-b">
      {appointments
        .filter(
          (appointment) =>
            appointment.start &&
            isSameHour(
              typeof appointment.start === 'string'
                ? new Date(appointment.start)
                : appointment.start,
              hour
            )
        )
        .map((appointment) => {
          if (!appointment.start || !appointment.end) return null;
          const startDate =
            typeof appointment.start === 'string'
              ? new Date(appointment.start)
              : appointment.start;
          const endDate =
            typeof appointment.end === 'string'
              ? new Date(appointment.end)
              : appointment.end;
          const hoursDifference = differenceInMinutes(endDate, startDate) / 60;
          const startPosition = startDate.getMinutes() / 60;

          return (
            <HoverCard key={appointment.id}>
              <HoverCardTrigger asChild>
                <AppointmentCardCompact
                  appt={appointment}
                  top={`${startPosition * 100}%`}
                  height={`${hoursDifference * 100}%`}
                  fontSize="0.875rem"
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <AppointmentHoverCardContent appt={appointment} />
              </HoverCardContent>
            </HoverCard>
          );
        })}
    </div>
  );
};
const Timings = () => {
  const now = new Date();
  return (
    <div className="pr-2 w-24">
      {Array.from({ length: END_HOUR }, (_, h) => h + START_HOUR).map(
        (hour, idx) => (
          <div
            className="text-right relative text-xs text-muted-foreground/50 h-20 last:h-0"
            key={hour}
          >
            {now.getHours() === hour && (
              <div
                className="absolute left-full translate-x-2 w-dvw h-[2px] bg-red-500"
                style={{ top: `${(now.getMinutes() / 60) * 100}%` }}
              >
                <span
                  className="text-xs bg-red-500 text-white px-1 rounded shadow absolute -left-5 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ top: `${(now.getMinutes() / 60) * 100}%` }}
                >
                  {String(now.getHours()).padStart(2, '0')}:
                  {String(now.getMinutes()).padStart(2, '0')}
                </span>
              </div>
            )}
            <p className="top-0 -translate-y-1/2">
              {idx > 0 ? `${hour}:00 Uhr` : ''}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default function WeekView() {
  const { view, selectedDate: date, filters } = useAppointmentsContext();
  const locale = de;
  const { appointments, loadPrevWeek, loadNextWeek, nextDate, isLoading } =
    useWeekAppointments(date, filters);

  const weekDates = useMemo(() => {
    const start = startOfWeek(nextDate ?? date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, dayIdx) => {
      const day = addDays(start, dayIdx);
      return Array.from({ length: 24 }).map((_, hour) => setHours(day, hour));
    });
  }, [date, nextDate]);

  // header days Mon…Sun
  const headerDays = useMemo(() => {
    const start = startOfWeek(nextDate ?? date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [date, nextDate]);

  if (view !== 'week') return null;

  return (
    <div className="flex flex-col relative overflow-auto overflow-x-hidden h-full">
      <div className="flex justify-end space-x-2 mb-4 mx-4">
        <button
          onClick={loadPrevWeek}
          disabled={isLoading}
          className="px-3 py-1 text-sm rounded flex items-center gap-2 border border-black"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={loadNextWeek}
          disabled={isLoading}
          className="px-3 py-2 text-sm rounded flex items-center gap-2 border border-black"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-6">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex sticky top-0 bg-card z-10 border-b border-t">
            <div className="w-24 pl-11" />
            {headerDays.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  'text-semibold flex-1 gap-1 pb-2 pt-2 text-sm text-muted-foreground flex items-center justify-center border-l',
                  isToday(day) && 'bg-green-50 border-b-2 border-b-green-700'
                )}
              >
                {format(day, 'EEEE, d. MMMM', { locale: locale })}
              </div>
            ))}
          </div>

          <div className="flex flex-1">
            <Timings />

            <div className="grid grid-cols-7 flex-1">
              {weekDates.map((hours, colIdx) => (
                <div
                  key={colIdx}
                  className={cn(
                    'h-full text-sm text-muted-foreground border-l',
                    isToday(weekDates[colIdx][0]) && 'bg-green-50'
                  )}
                >
                  {hours.map((hour) => (
                    <AppointmentMapping
                      key={hour.toString()}
                      hour={hour}
                      appointments={appointments}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
