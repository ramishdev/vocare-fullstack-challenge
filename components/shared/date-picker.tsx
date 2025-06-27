'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useAppointmentsContext } from '@/app/context/appointments';

type DatePickerProps = {
  mode?: 'single' | 'range';
};

export function DatePicker({ mode = 'single' }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const {
    selectedDate,
    setSelectedDate,
    filters,
    setFilters,
  } = useAppointmentsContext();

  // ---- Determine “value” based on mode ----
  const value = mode === 'single'
    ? selectedDate
    : { from: filters.from, to: filters.to };

  // ---- Build the button label ----
  const label = React.useMemo(() => {
    if (mode === 'single') {
      return selectedDate
        ? format(selectedDate, 'd. MMMM yyyy', { locale: de })
        : 'Datum wählen';
    } else {
      const { from, to } = filters;
      if (!from && !to) return 'Zeitraum wählen';
      if (from && !to) return format(from, 'dd.MM.yyyy', { locale: de });
      if (from && to)
        return `${format(from, 'dd.MM.yyyy', { locale: de })} – ${format(
          to,
          'dd.MM.yyyy',
          { locale: de }
        )}`;
      return 'Zeitraum wählen';
    }
  }, [mode, selectedDate, filters]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label={mode === 'single' ? 'Datum wählen' : 'Zeitraum wählen'}
          className="w-[200px] justify-start"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span
            className={
              label.startsWith('Datum')
                ? 'text-gray-400'
                : label.startsWith('Zeitraum')
                ? 'text-gray-400'
                : ''
            }
          >
            {label}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 mt-2" align="start">
      {mode === 'single' ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              if (d) {
                setSelectedDate(d);
                setOpen(false);
                setFilters({ ...filters, from: undefined, to: undefined });
              }
            }}
            locale={de}
            captionLayout="dropdown"
            numberOfMonths={1}
          />
        
        ) : (
          <Calendar
            mode="range"
            selected={{ from: filters.from, to: filters.to }}
            onSelect={(r) => {
              if (r) {
                setFilters({ ...filters, from: r.from, to: r.to });
              }
              // keep open until user clicks away
            }}
            locale={de}
            captionLayout="dropdown"
            numberOfMonths={2}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
