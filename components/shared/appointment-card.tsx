// app/components/AppointmentCard.tsx
'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Clock, MapPin, MessageSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { AppointmentWithCategory } from '@/types/types';
import { useAppointmentsContext } from '@/app/context/appointments';

export default function AppointmentCard({
  appt,
}: {
  appt: AppointmentWithCategory;
}) {
  const { doneIds, toggleDone } = useAppointmentsContext();

  const checked = doneIds.has(appt.id);
  const start = appt.start ? parseISO(appt.start) : null;
  const end = appt.end ? parseISO(appt.end) : null;
  const color = appt.categories?.color || '#10B981';

  const timeDisplay =
    start && end
      ? `${format(start, 'HH:mm', { locale: de })} bis ${format(end, 'HH:mm', {
          locale: de,
        })} Uhr`
      : '';

  return (
    <div className="relative bg-white rounded-xl shadow p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3" style={{ backgroundColor: color }} />
          <h3
            className={`font-semibold text-base ${
              checked ? 'line-through decoration-2 text-black' : 'text-black'
            }`}
          >
            {appt.title}
          </h3>
        </div>
        <Checkbox
          checked={checked}
          onCheckedChange={() => toggleDone(appt.id)}
        />
      </div>

      <div className="mt-2 space-y-1 text-sm text-gray-600">
        {timeDisplay && (
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{timeDisplay}</span>
          </div>
        )}
        {appt.location && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{appt.location}</span>
          </div>
        )}
        {appt.notes && (
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>{appt.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
