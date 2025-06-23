// src/lib/schemas/appointments.ts
import { z } from 'zod';

export const AppointmentsQuery = z.object({
  view: z.enum(['list', 'month', 'week']).default('list'),
  direction: z.enum(['prev', 'next']).optional(),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: '`date` must be an ISO string',
  }),
  limit: z
    .string()
    .transform((s) => parseInt(s, 10))
    .refine((n) => Number.isInteger(n) && n > 0, {
      message: '`limit` must be a positive integer',
    })
    .optional(),
});
