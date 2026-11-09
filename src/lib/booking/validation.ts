import { z } from 'zod'

// Italian phone regex: +39 XXX XXXXXXX or +39 XX XXXXXXXX or 3XX XXXXXXX etc.
const italianPhoneRegex = /^(\+39\s?)?[0-9\s]{9,15}$/

export const bookingSchema = z.object({
  customer_name: z.string()
    .min(2, 'Il nome deve contenere almeno 2 caratteri')
    .max(100, 'Il nome è troppo lungo')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Il nome contiene caratteri non validi'),

  email: z.string()
    .email('Email non valida')
    .max(150, 'Email troppo lunga'),

  phone: z.string()
    .optional()
    .refine(val => !val || italianPhoneRegex.test(val), 'Formato telefono non valido (es. +39 3XX XXXXXXX)'),

  guests_count: z.number()
    .int('Il numero di ospiti deve essere un numero intero')
    .min(1, 'Almeno 1 ospite')
    .max(20, 'Massimo 20 ospiti'),

  notes: z.string()
    .max(500, 'Le note non possono superare 500 caratteri')
    .optional(),

  table_id: z.string()
    .uuid('ID tavolo non valido'),

  time_slot_id: z.string()
    .uuid('ID slot orario non valido'),

  booking_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)')
    .refine(date => {
      const parsed = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return parsed >= today
    }, 'La data non può essere nel passato'),
})

export type BookingInput = z.infer<typeof bookingSchema>