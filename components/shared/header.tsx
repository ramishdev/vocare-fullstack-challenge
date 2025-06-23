'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from './date-picker';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plus as PlusIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useAppointmentsContext } from '@/app/context/appointments';

export default function Header() {
  const { view, setView: onViewChange } = useAppointmentsContext();
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4 py-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        <div className="w-full sm:w-auto">
          <DatePicker />
        </div>

        <div className="mt-2 sm:mt-0 overflow-x-auto">
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(val) => {
              if (val === 'list' || val === 'week' || val === 'month') {
                onViewChange(val);
              }
            }}
            aria-label="Ansicht wählen"
            className="inline-flex border rounded-md"
          >
            <ToggleGroupItem
              value="list"
              aria-label="Listenansicht"
              className="px-4 py-1 whitespace-nowrap"
            >
              Liste
            </ToggleGroupItem>
            <ToggleGroupItem
              value="week"
              aria-label="Wochenansicht"
              className="px-4 py-1 whitespace-nowrap"
            >
              Woche
            </ToggleGroupItem>
            <ToggleGroupItem
              value="month"
              aria-label="Monatsansicht"
              className="px-4 py-1 whitespace-nowrap"
            >
              Monat
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="flex items-center gap-2 px-3 py-2"
        >
          <SlidersHorizontalIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Termine filtern</span>
        </Button>
        <Button
          size="sm"
          className="flex items-center gap-2 px-3 py-2"
          onClick={() => {}}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="pb-[1.4px]">Neuer Termin</span>
        </Button>
      </div>
    </div>
  );
}
