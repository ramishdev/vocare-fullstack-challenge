import {
  AppointmentsQuery,
  AppointmentsCreate,
} from '@/lib/schemas/appointments';
import { supabase } from '@/lib/supabase';
import { addMonths, addWeeks, subMonths } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.entries();
  const raw = Object.fromEntries(searchParams);
  
  const result = AppointmentsQuery.safeParse(raw);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const {
    view,
    direction,
    date: dateStr,
    startDate,
    endDate,
    limit: pageSize,
    category,
    patientId,
  } = result.data;

  let query = supabase.from('appointments').select(`
      *,
      categories (
        id,
        color
      )
    `);
  if (typeof category === 'string' && category) {
    query = query.eq('category', category);
  }
  if (typeof patientId === 'string' && patientId) {
    query = query.eq('patient', patientId);
  }
  // If both startDate and endDate are provided, filter by range and ignore paging
  if (startDate && endDate) {
    query = query
      .gte('start', new Date(startDate).toISOString())
      .lt('end', new Date(endDate).toISOString())
      .order('start', { ascending: true });
  } else {
    if (!dateStr) {
      return NextResponse.json(
        { error: "Missing or invalid 'date' parameter." },
        { status: 400 }
      );
    }
    const selected = new Date(dateStr);

    if (view === 'list') {
      // cursor-based paging
      if (direction === 'prev') {
        query = query.lt('start', dateStr).order('start', { ascending: false });
      } else if (direction == 'next') {
        query = query.gt('start', dateStr).order('start', { ascending: true });
      } else {
        query = query
          .gte('start', selected.toISOString())
          .order('start', { ascending: true });
      }
      if (pageSize && pageSize > 0) {
        query = query.limit(pageSize);
      }
    } else if (view === 'month') {
      let monthDate = selected;
      if (direction === 'prev') monthDate = subMonths(selected, 1);
      else if (direction === 'next') monthDate = addMonths(selected, 1);
      
      const start = new Date(Date.UTC(monthDate.getFullYear(), monthDate.getMonth(), 1));
      const end = addMonths(start, 1);
      
      query = query
        .gte('start', start.toISOString())
        .lt('start', end.toISOString())
        .order('start', { ascending: true });
    } else if (view === 'week') {
      const start = selected;
      const end = addWeeks(start, 1);
      query = query
        .gte('start', start.toISOString())
        .lt('start', end.toISOString())
        .order('start', { ascending: true });
    } else {
      return NextResponse.json(
        { error: `Invalid view: ${view}` },
        { status: 400 }
      );
    }
  }
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = AppointmentsCreate.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { title, date, start, end, category, patient, location, notes } =
      result.data;
    // Compose ISO strings for start/end
    const startISO = new Date(`${date}T${start}`).toISOString();
    const endISO = new Date(`${date}T${end}`).toISOString();
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          title,
          start: startISO,
          end: endISO,
          category: category || null,
          patient: patient || null,
          location: location || null,
          notes: notes || null,
        },
      ])
      .select('*')
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error: unknown) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
