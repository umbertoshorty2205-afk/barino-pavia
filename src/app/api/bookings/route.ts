import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { bookingSchema } from '@/lib/booking/validation'
import { sendBookingConfirmationEmail } from '@/lib/email/send-booking-email'
import { randomUUID } from 'crypto'

// Helper to get table info
async function getTableInfo(supabase: any, tableId: string) {
  const { data, error } = await supabase
    .from('tables')
    .select('name')
    .eq('id', tableId)
    .single()
  if (error) throw new Error('Tavolo non trovato')
  return data
}

// Helper to get time slot info
async function getTimeSlotInfo(supabase: any, timeSlotId: string) {
  const { data, error } = await supabase
    .from('time_slots')
    .select('start_time, end_time')
    .eq('id', timeSlotId)
    .single()
  if (error) throw new Error('Slot orario non trovato')
  return data
}

// Helper to check availability
async function checkAvailability(supabase: any, tableId: string, timeSlotId: string, bookingDate: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('table_id', tableId)
    .eq('time_slot_id', timeSlotId)
    .eq('booking_date', bookingDate)
    .in('status', ['pending', 'confirmed'])

  if (error) throw new Error('Errore controllo disponibilità')
  return !data || data.length === 0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = bookingSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data
    const supabase = await createServerClient()

    // Get table and time slot info
    const [table, timeSlot] = await Promise.all([
      getTableInfo(supabase, data.table_id),
      getTimeSlotInfo(supabase, data.time_slot_id),
    ])

    // Check availability
    const isAvailable = await checkAvailability(supabase, data.table_id, data.time_slot_id, data.booking_date)
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Il tavolo non è più disponibile per questo orario' },
        { status: 409 }
      )
    }

    // Generate confirmation token
    const confirmationToken = randomUUID()
    const bookingId = randomUUID()

    // Insert booking
    const { error: insertError } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        table_id: data.table_id,
        time_slot_id: data.time_slot_id,
        booking_date: data.booking_date,
        customer_name: data.customer_name,
        customer_email: data.email,
        customer_phone: data.phone,
        guests_count: data.guests_count,
        notes: data.notes,
        status: 'pending',
        confirmation_token: confirmationToken,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Errore durante la prenotazione' },
        { status: 500 }
      )
    }

    // Send confirmation email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'
    const confirmUrl = `${siteUrl}/api/bookings/${bookingId}?token=${confirmationToken}&action=confirm`
    const cancelUrl = `${siteUrl}/api/bookings/${bookingId}?token=${confirmationToken}&action=cancel`

    await sendBookingConfirmationEmail({
      bookingId,
      confirmationToken,
      customerName: data.customer_name,
      customerEmail: data.email,
      customerPhone: data.phone,
      guestsCount: data.guests_count,
      bookingDate: data.booking_date,
      startTime: timeSlot.start_time,
      endTime: timeSlot.end_time,
      tableName: table.name,
      notes: data.notes,
      confirmUrl,
      cancelUrl,
    })

    return NextResponse.json(
      { bookingId, confirmationToken, message: 'Prenotazione creata. Controlla la tua email per confermare.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Data richiesta' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get available slots for the date
    const dayOfWeek = new Date(date).getDay()

    const { data: timeSlots, error: slotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time')

    if (slotsError) throw slotsError

    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('id, capacity')
      .eq('is_active', true)

    if (tablesError) throw tablesError

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('table_id, time_slot_id')
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed'])

    if (bookingsError) throw bookingsError

    // Calculate availability per slot (simplified - assuming 2 guests)
    const bookingsBySlot = new Map<string, number>()
    if (bookings) {
      bookings.forEach(booking => {
        const key = `${booking.time_slot_id}-${booking.table_id}`
        bookingsBySlot.set(key, (bookingsBySlot.get(key) || 0) + 1)
      })
    }

    const slotsWithAvailability = timeSlots
      .map(slot => {
        const availableTables = tables.filter(t => t.capacity >= 2)
        let availableCapacity = 0

        availableTables.forEach(table => {
          const existingBookings = bookingsBySlot.get(`${slot.id}-${table.id}`) || 0
          const remainingCapacity = slot.max_bookings_per_slot - existingBookings
          if (remainingCapacity > 0) availableCapacity += remainingCapacity
        })

        return {
          slot_id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          slot_duration_minutes: slot.slot_duration_minutes,
          max_bookings_per_slot: slot.max_bookings_per_slot,
          availableCapacity,
        }
      })
      .filter(slot => slot.availableCapacity > 0)

    return NextResponse.json({ slots: slotsWithAvailability })
  } catch (error) {
    console.error('Get available slots error:', error)
    return NextResponse.json(
      { error: 'Errore recupero slot disponibili' },
      { status: 500 }
    )
  }
}