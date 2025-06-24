import { Tables } from './supabase';

// src/types.ts
export type Appointment = Tables<'appointments'>;
export type Category = Tables<'categories'>;
export type Patient = Tables<'patients'>;
export type Activity = Tables<'activities'>;
export type AppointmentAssignee = Tables<'appointment_assignee'>;
export type Relative = Tables<'relatives'>;

export type AppointmentWithCategory = Appointment & {
  categories: Category | null;
};

export type ViewType = 'list' | 'month' | 'week';
