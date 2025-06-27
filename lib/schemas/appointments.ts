import { z } from 'zod';

export const AppointmentsQuery = z.object({
  view: z.enum(['list', 'month', 'week']).default('list'),
  direction: z.enum(['prev', 'next']).optional(),
  date: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: '`date` must be an ISO string',
    })
    .optional(),
  startDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: '`startDate` must be an ISO string',
    })
    .optional(),
  endDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), {
      message: '`endDate` must be an ISO string',
    })
    .optional(),
  limit: z
    .string()
    .transform((s) => parseInt(s, 10))
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: '`limit` must be a positive integer',
    })
    .optional(),
  category: z.string().optional(),
  patientId: z.string().optional(),
});

export const AppointmentsCreate = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: 'Datum ist ungültig',
  }),
  start: z.string().regex(/^\d{2}:\d{2}$/, 'Startzeit ist ungültig'),
  end: z.string().regex(/^\d{2}:\d{2}$/, 'Endzeit ist ungültig'),
  category: z.string().optional().nullable(),
  patient: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
