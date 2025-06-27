import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { AppointmentsCreate } from '@/lib/schemas/appointments';
import { Appointment } from '@/types/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: 'Missing appointment ID.' },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const PartialSchema = AppointmentsCreate.partial();
  const result = PartialSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const update: Partial<Appointment> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.date !== undefined && body.start !== undefined) {
    update.start = new Date(`${body.date}T${body.start}`).toISOString();
  }
  if (body.date !== undefined && body.end !== undefined) {
    update.end = new Date(`${body.date}T${body.end}`).toISOString();
  }
  if (body.category !== undefined) update.category = body.category;
  if (body.patient !== undefined) update.patient = body.patient;
  if (body.location !== undefined) update.location = body.location;
  if (body.notes !== undefined) update.notes = body.notes;

  const { data, error } = await supabase
    .from('appointments')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← same change here
) {
  const { id } = await params; // ← await before use
  if (!id) {
    return NextResponse.json(
      { error: 'Missing appointment ID.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  return NextResponse.json(data);
}
