'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';

export type ViewType = 'day' | 'week' | 'month';

interface ViewSwitcherProps {
  defaultValue?: ViewType;
  onChange?: (view: ViewType) => void;
}

export default function ViewSwitcher({
  defaultValue = 'month',
  onChange,
}: ViewSwitcherProps) {
  const [value, setValue] = useState<ViewType>(defaultValue);

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) {
          setValue(val as ViewType);
          onChange?.(val as ViewType);
        }
      }}
      aria-label="Termine Ansicht"
    >
      <ToggleGroupItem
        value="day"
        className="px-3 py-1 rounded-md"
        aria-label="Tag-Ansicht"
      >
        Tag
      </ToggleGroupItem>
      <ToggleGroupItem
        value="week"
        className="px-3 py-1 rounded-md"
        aria-label="Wochen-Ansicht"
      >
        Woche
      </ToggleGroupItem>
      <ToggleGroupItem
        value="month"
        className="px-3 py-1 rounded-md"
        aria-label="Monats-Ansicht"
      >
        Monat
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
