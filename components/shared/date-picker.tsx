// app/components/DatePicker.tsx
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useAppointmentsContext } from '@/app/context/appointments';

export function DatePicker() {
  const [open, setOpen] = React.useState(false);
  const { selectedDate, setSelectedDate } = useAppointmentsContext();
  const display = selectedDate
    ? format(selectedDate, 'd MMMM yyyy', { locale: de })
    : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Datum wählen"
          className="w-[200px] justify-start"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span className={display ? '' : 'text-gray-400'}>
            {display || 'Datum wählen'}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 mt-2" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => {
            if (d) {
              setSelectedDate(d);
              setOpen(false);
            }
          }}
          locale={de}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
