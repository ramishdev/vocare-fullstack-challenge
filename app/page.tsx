'use client';
import AppointmentList from '@/components/calendar/appointment-list';
import { useAppointmentsContext } from './context/appointments';
import Header from '@/components/shared/header';

export default function HomePage() {
  const { view } = useAppointmentsContext();

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <section className="flex-1 overflow-y-auto bg-gray-100 py-8">
        {view === 'list' && (
          <div className="bg-gray-100 w-full">
            <AppointmentList />
          </div>
        )}

        {/* You can add MonthView and WeekView here */}
      </section>
    </main>
  );
}
