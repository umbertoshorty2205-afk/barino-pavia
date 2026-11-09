// tests/lib/booking/validation.test.ts
import { describe, it, expect } from 'vitest'
import { bookingSchema } from '@/lib/booking/validation'

const validData = {
  customer_name: 'Mario Rossi',
  email: 'mario@example.com',
  phone: '+39 340 1234567',
  guests_count: 4,
  notes: 'Test note',
  table_id: '123e4567-e89b-12d3-a456-426614174000',
  time_slot_id: '123e4567-e89b-12d3-a456-426614174001',
  booking_date: '2026-11-15',
}

describe('bookingSchema', () => {
  it('rejects invalid email', () => {
    const result = bookingSchema.safeParse({ ...validData, email: 'invalid' })
    expect(result.success).toBe(false)
    expect(result.error.flatten().fieldErrors.email).toContain('Email non valida')
  })

  it('rejects guests > 20', () => {
    const result = bookingSchema.safeParse({ ...validData, guests_count: 25 })
    expect(result.success).toBe(false)
  })

  it('rejects guests < 1', () => {
    const result = bookingSchema.safeParse({ ...validData, guests_count: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects name too short', () => {
    const result = bookingSchema.safeParse({ ...validData, customer_name: 'M' })
    expect(result.success).toBe(false)
  })

  it('accepts valid data', () => {
    const result = bookingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('accepts optional phone', () => {
    const result = bookingSchema.safeParse({ ...validData, phone: undefined })
    expect(result.success).toBe(true)
  })

  it('accepts optional notes', () => {
    const result = bookingSchema.safeParse({ ...validData, notes: undefined })
    expect(result.success).toBe(true)
  })

  it('rejects invalid phone format', () => {
    const result = bookingSchema.safeParse({ ...validData, phone: 'not-a-phone' })
    expect(result.success).toBe(false)
  })

  it('rejects past date', () => {
    const result = bookingSchema.safeParse({ ...validData, booking_date: '2020-01-01' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid UUID for table_id', () => {
    const result = bookingSchema.safeParse({ ...validData, table_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid UUID for time_slot_id', () => {
    const result = bookingSchema.safeParse({ ...validData, time_slot_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })
})