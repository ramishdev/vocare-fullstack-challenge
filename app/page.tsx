'use client';
import AppointmentList from '@/components/calendar/appointment-list';
import { useAppointmentsContext } from './context/appointments';
import Header from '@/components/shared/header';
import WeekView from '@/components/calendar/week-view';
import MonthView from '@/components/calendar/month-view';

export default function HomePage() {
  const { view } = useAppointmentsContext();

  return (
    <div className="h-dvh flex flex-col">
      <Header />
      {view === 'list' && (
        <section className="flex-1 overflow-y-auto bg-gray-100 py-8">
          <div className="bg-gray-100 w-full">
            <AppointmentList />
          </div>
        </section>
      )}
      {view === 'week' && (
        <div className="flex-1 overflow-hidden">
          <WeekView />
        </div>
      )}
      {view === 'month' && (
        <div className="flex-1 overflow-hidden">
          <MonthView />
        </div>
      )}
    </div>
  );
}
