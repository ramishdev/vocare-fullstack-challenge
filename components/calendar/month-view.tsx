import { useAppointmentsContext } from "@/app/context/appointments";
import { useMonthAppointments } from "@/hooks/useMonthAppointments";
import { cn } from "@/lib/utils";
import { addDays, format, isSameDay, isSameMonth, isToday, Locale, startOfMonth, startOfWeek } from "date-fns";
import { de } from "date-fns/locale";
import { useMemo } from "react";
import AppointmentCardCompact from "../shared/appointment-card-compact";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { AppointmentHoverCardContent } from "../shared/appointment-hover-card";
import Loader from '../shared/Loader';

const generateWeekdays = (locale: Locale) => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
        daysOfWeek.push(format(date, 'EEEE', { locale }));
    }
    return daysOfWeek;
};
const getDaysInMonthList = (date: Date) => {
    const startOfMonthDate = startOfMonth(date);
    const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
        weekStartsOn: 1,
    });

    let currentDate = startOfWeekForMonth;
    const calendar = [];

    while (calendar.length < 42) {
        calendar.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
    }

    return calendar;
};
export default function MonthView() {
    const { selectedDate: date, setSelectedDate, view, filters } = useAppointmentsContext();
    const locale = de;
    const { appointments, loadNextMonth, isLoading } = useMonthAppointments(date, filters);
    const monthDates = useMemo(() => getDaysInMonthList(date), [date]);
    const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

    const todaysAppointments = appointments.filter(appt =>
        appt.start != null && isSameDay(appt.start, date)
    );

    if (view !== 'month') return null;
    if (isLoading) {
        return (
            <div className="flex justify-center my-6">
                <Loader />
            </div>
        )
    }
    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-7 gap-px sticky top-0 bg-background border">
                    {weekDays.map((d) => (
                        <div
                            key={d}
                            className={
                                "pb-2 text-center text-sm text-muted-foreground pr-2 ring-border ring 1"

                            }
                        >
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
                    {monthDates.map(_date => {
                        const isCurrMonth = isSameMonth(date, _date);
                        const isSelected = isSameDay(date, _date);

                        return (
                            <div
                                key={_date.toString()}
                                onClick={() => setSelectedDate(_date)}
                                className={cn(
                                    'cursor-pointer ring-1 p-2 text-sm ring-border overflow-auto',
                                    !isCurrMonth && 'text-muted-foreground/50',
                                    isSelected && 'bg-gray-100'
                                )}
                            >
                                <span
                                    className={cn(
                                        'size-6 grid place-items-center rounded-full mb-1 sticky top-0',
                                        isToday(_date) && 'bg-primary text-primary-foreground'
                                    )}
                                >
                                    {format(_date, 'd')}
                                </span>

                                {appointments
                                    .filter(appt => appt.start != null && isSameDay(appt.start, _date))
                                    .map(appt => (
                                        <HoverCard key={appt.id}>
                                            <HoverCardTrigger asChild>
                                                <div className="px-1 mb-0.5">
                                                    <AppointmentCardCompact
                                                        appt={appt}
                                                        compact
                                                        fontSize="0.62rem"
                                                        bgColor={false}
                                                    />
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80">
                                                <AppointmentHoverCardContent appt={appt} />
                                            </HoverCardContent>
                                        </HoverCard>
                                    ))
                                }
                            </div>
                        );
                    })}
                </div>

                <div className="py-3 text-center border-t bg-background">
                    <button
                        onClick={loadNextMonth}
                        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition"
                    >
                        Nächsten Monat laden
                    </button>
                </div>
            </div>

            <aside className="w-80 border-l p-4 overflow-auto bg-white">
                <h2 className="text-lg font-semibold mb-4">
                    {format(date, "EEEE, d. MMMM yyyy", { locale })}
                </h2>

                {todaysAppointments.length > 0 ? (
                    todaysAppointments.map(appt => (
                        <HoverCard key={appt.id}>
                            <HoverCardTrigger asChild>
                                <div className="px-1 mb-0.5">
                                    <AppointmentCardCompact key={appt.id} appt={appt} bgColor={false} />

                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <AppointmentHoverCardContent appt={appt} />
                            </HoverCardContent>
                        </HoverCard>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Keine Termine an diesem Tag.</p>
                )}
            </aside>
        </div>
    );
}