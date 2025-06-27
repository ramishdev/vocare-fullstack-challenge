'use client';

import { FilterOptions, ViewType } from '@/types/types';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';



interface AppointmentsContextValue {
  view: ViewType;
  setView: (v: ViewType) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  filters: FilterOptions;
  setFilters: (f: FilterOptions) => void;
  doneIds: Set<string>;
  toggleDone: (id: string) => void;
}

const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(
  undefined
);

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<FilterOptions>({});
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const toggleDone = useCallback((id: string) => {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <AppointmentsContext.Provider
      value={{
        view,
        setView,
        selectedDate,
        setSelectedDate,
        filters,
        setFilters,
        doneIds,
        toggleDone,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointmentsContext(): AppointmentsContextValue {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error(
      'useAppointmentsContext must be used within an AppointmentsProvider'
    );
  }
  return context;
}
