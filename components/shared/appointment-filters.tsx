'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types/types';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

interface Props {
  onChange(filters: { category?: string; date?: string }): void;
}

export default function AppointmentFilters({ onChange }: Props) {
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const { data: categories } = useSWR<Category[]>(
    '/api/categories',
    (url: string) => fetch(url).then((r) => r.json())
  );

  useEffect(() => {
    onChange({ category, date });
  }, [category, date, onChange]);

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Kategorie wählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Kategorien</SelectItem>
          {categories &&
            categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-40"
      />
      <Button
        variant="secondary"
        onClick={() => {
          setCategory('');
          setDate('');
        }}
      >
        Zurücksetzen
      </Button>
    </div>
  );
}
