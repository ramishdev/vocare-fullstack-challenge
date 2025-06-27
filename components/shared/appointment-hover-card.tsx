import { AppointmentWithCategory } from '@/types/types';
import { format, parseISO } from 'date-fns';
import { Clock, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AppointmentEditDialog from './appointment-edit-dialog';

export function AppointmentHoverCardContent({
  appt,
}: {
  appt: AppointmentWithCategory;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const start = appt.start
    ? typeof appt.start === 'string'
      ? parseISO(appt.start)
      : appt.start
    : null;
  const end = appt.end
    ? typeof appt.end === 'string'
      ? parseISO(appt.end)
      : appt.end
    : null;
  return (
    <div className="space-y-1">
      <div className="font-bold text-base">{appt.title}</div>
      <div className="text-sm text-gray-600 flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {start && end
          ? `${format(start, 'HH:mm')} bis ${format(end, 'HH:mm')} Uhr`
          : ''}
      </div>
      {appt.location && (
        <div className="text-sm flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {appt.location}
        </div>
      )}
      {appt.notes && (
        <div className="text-sm flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          {appt.notes}
        </div>
      )}
      {appt.categories?.label && (
        <div className="text-xs text-muted-foreground">
          Kategorie: {appt.categories.label}
        </div>
      )}
      <div className="pt-2">
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          onClick={() => setEditOpen(true)}
        >
          Bearbeiten
        </Button>
        <AppointmentEditDialog
          open={editOpen}
          setOpen={setEditOpen}
          appointment={appt}
        />
      </div>
    </div>
  );
}
