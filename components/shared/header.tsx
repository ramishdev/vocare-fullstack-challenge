'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from './date-picker';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plus as PlusIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useAppointmentsContext } from '@/app/context/appointments';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import AppointmentFilters from './appointment-filters';
import { useState } from 'react';
import AppointmentCreateDialog from './appointment-create-dialog';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { view, setView: onViewChange, filters } = useAppointmentsContext();
  const [createOpen, setCreateOpen] = useState(false);

  const activeFilterCount = [
    filters.category,
    filters.to,
    filters.patientId,
    filters.location,
  ].filter(Boolean).length;

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
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 px-3 py-2"
              >
                <SlidersHorizontalIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Termine filtern</span>
              </Button>
              {activeFilterCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute bg-black -bottom-4 -right-2 px-2 py-0.5 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent align="end">
            <AppointmentFilters

            />
          </PopoverContent>
        </Popover>
        <Button
          size="sm"
          className="flex bg-black items-center gap-2 px-3 py-2"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="pb-[1.4px]">Neuer Termin</span>
        </Button>
        <AppointmentCreateDialog open={createOpen} setOpen={setCreateOpen} />
      </div>
    </div>
  );
}
