import { AppointmentsQuery } from '@/lib/schemas/appointments';
import { supabase } from '@/lib/supabase';
import { addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.entries();
  const raw = Object.fromEntries(searchParams);
  const result = AppointmentsQuery.safeParse(raw);

  if (!result.success) {
    // If validation fails, Zod gives you a detailed error.
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
  } = result.data;

  const selected = new Date(dateStr);

  let query = supabase.from('appointments').select(`
      *,
      categories (
        id,
        color
      )
    `);

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

    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
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
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
