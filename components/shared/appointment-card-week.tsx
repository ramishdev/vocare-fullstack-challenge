'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Clock, MapPin, MessageSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { AppointmentWithCategory } from '@/types/types';
import { useAppointmentsContext } from '@/app/context/appointments';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import toLight100 from '@/lib/light-color';

export default function AppointmentCardWeek({
  appt,
  fontSize = '0.875rem', // text-sm
  top = '1px',
  height,
}: {
  appt: AppointmentWithCategory;
  fontSize?: string;
  top?: string | number;
  height?: string | number;
}) {
  const { doneIds, toggleDone } = useAppointmentsContext();

  const checked = doneIds.has(appt.id);
  const start = appt.start ? parseISO(appt.start) : null;
  const end = appt.end ? parseISO(appt.end) : null;

  const timeDisplay =
    start && end
      ? `${format(start, 'HH:mm', { locale: de })} bis ${format(end, 'HH:mm', {
          locale: de,
        })} Uhr`
      : '';

  const color = appt.categories?.color || '#a78bfa';

  return (
    <Card
      className={`relative p-1 gap-0 overflow-hidden`}
      style={{
        borderLeft: `4px solid ${color}`,
        backgroundColor: toLight100(color, 0.95),
        fontSize,
        height,
        top,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between py-1 px-2">
        <CardTitle
          className={`font-bold text-sm text-center truncate max-w-[120px] ${checked ? 'line-through decoration-2 text-black' : 'text-black'}`}
        >
          {appt.title}
        </CardTitle>
        <CardAction className="mt-0">
          <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggleDone(appt.id)}
              className="w-4 h-4 min-w-4 min-h-4 border bg-white border-gray-400 data-[state=checked]:border-gray-400"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-0.5 text-gray-700 p-2 pt-0 overflow-hidden">
        {timeDisplay && (
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{timeDisplay}</span>
          </div>
        )}
        {appt.location && (
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <span className="text-xs truncate max-w-[110px]">
              {appt.location}
            </span>
          </div>
        )}
        {appt.notes && (
          <div className="flex items-center space-x-1 text-gray-600">
            <MessageSquare className="w-3 h-3" />
            <span className="text-xs truncate max-w-[110px]">
              {appt.notes.split(/(@\w+)/g).map((part, idx) =>
                part.startsWith('@') ? (
                  <b key={idx} className="font-bold">
                    {part}
                  </b>
                ) : (
                  part
                )
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
