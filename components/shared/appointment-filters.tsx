'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppointmentsContext } from '@/app/context/appointments';
import { Category, Patient } from '@/types/types';
import useSWR from 'swr';
import { DatePicker } from './date-picker';

export default function AppointmentFilters() {
  const { filters, setFilters } = useAppointmentsContext();

  const { data: categories } = useSWR<Category[]>('/api/categories', (url: string) =>
    fetch(url).then((res) => res.json())
  );
  const { data: patients } = useSWR<Patient[]>('/api/patients', (url: string) =>
    fetch(url).then((res) => res.json())
  );  

  const resetAll = () => setFilters({});

  return (
    <form className="flex flex-col gap-4 min-w-[260px] p-1">
      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-xs text-gray-600">
          Category
        </label>
        <Select
          value={filters.category ?? 'all'}
          onValueChange={(val) =>
            setFilters({ ...filters, category: val === 'all' ? undefined : val, })
          }
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Choose category" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">Date Range</label>
        <DatePicker mode="range" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="patient" className="text-xs text-gray-600">
          Patient
        </label>
        <Select
          value={filters.patientId ?? 'all'}
          onValueChange={(val) =>
            setFilters({ ...filters, patientId: val === 'all' ? undefined : val, })
          }
        >
          <SelectTrigger id="patient" className="w-full">
            <SelectValue placeholder="Select patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            {patients?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.lastname}, {p.firstname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <Button
        type="button"
        variant="secondary"
        className="self-end"
        onClick={resetAll}
      >
        Reset
      </Button>
    </form>
  );
}
