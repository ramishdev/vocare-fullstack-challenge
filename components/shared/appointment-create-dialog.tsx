import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';
import useSWR from 'swr';
import { Category, Patient } from '@/types/types';
import { mutate } from 'swr';

interface AppointmentCreateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AppointmentCreateDialog: React.FC<AppointmentCreateDialogProps> = ({ open, setOpen }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [category, setCategory] = useState('');
  const [patient, setPatient] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useSWR<Category[]>('/api/categories', (url: string) => fetch(url).then(res => res.json()));
  const { data: patients } = useSWR<Patient[]>('/api/patients', (url: string) => fetch(url).then(res => res.json()));

  function resetForm() {
    setTitle('');
    setDate('');
    setStart('');
    setEnd('');
    setCategory('');
    setPatient('');
    setLocation('');
    setNotes('');
  }

  function handleClose() {
    setOpen(false);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Validate end after start
    if (date && start && end) {
      const startDate = new Date(`${date}T${start}`);
      const endDate = new Date(`${date}T${end}`);
      if (endDate < startDate) {
        setError('Endzeit darf nicht vor Startzeit liegen.');
        setLoading(false);
        return;
      }
    }
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          date,
          start,
          end,
          category,
          patient,
          location,
          notes,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Fehler beim Erstellen.');
        setLoading(false);
        return;
      }
      handleClose();
      setLoading(false);
      await Promise.all([
        mutate((key) => typeof key === 'string' && key.startsWith('/api/appointments?view=list')),
        mutate((key) => typeof key === 'string' && key.startsWith('/api/appointments?view=week')),
        mutate((key) => typeof key === 'string' && key.startsWith('/api/appointments?view=month')),
      ]);
    } catch (err) {
      setError('Fehler beim Erstellen.');
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neuen Termin erstellen</DialogTitle>
          <DialogDescription>
            Fülle das Formular aus, um einen neuen Termin zu erstellen.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Titel</label>
            <Input id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel des Termins" required />
          </div>
          <div className="grid gap-2 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="text-sm font-medium">Datum</label>
              <Input id="date" name="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="start" className="text-sm font-medium">Start</label>
                <Input id="start" name="start" type="time" value={start} onChange={e => setStart(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="end" className="text-sm font-medium">Ende</label>
                <Input id="end" name="end" type="time" value={end} onChange={e => setEnd(e.target.value)} required />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">Kategorie</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="patient" className="text-sm font-medium">Patient</label>
            <Select value={patient} onValueChange={setPatient}>
              <SelectTrigger id="patient" className="w-full">
                <SelectValue placeholder="Patient wählen" />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.lastname}, {p.firstname}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="location" className="text-sm font-medium">Ort</label>
            <Input id="location" name="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Ort" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">Notizen</label>
            <textarea id="notes" name="notes" value={notes} onChange={e => setNotes(e.target.value)} className="border rounded-md px-3 py-2 text-sm" placeholder="Notizen" rows={2} />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={loading}>{loading ? 'Erstellen...' : 'Erstellen'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentCreateDialog; 