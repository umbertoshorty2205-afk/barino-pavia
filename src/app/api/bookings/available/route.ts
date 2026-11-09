import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const guests = parseInt(searchParams.get('guests') || '2', 10)

    if (!date) {
      return NextResponse.json({ error: 'Data richiesta' }, { status: 400 })
    }

    if (guests < 1 || guests > 20) {
      return NextResponse.json({ error: 'Numero ospiti non valido (1-20)' }, { status: 400 })
    }

    const supabase = await createServerClient()

    const dayOfWeek = new Date(date).getDay()

    // Get time slots for this day
    const { data: timeSlots, error: slotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time')

    if (slotsError) throw slotsError
    if (!timeSlots || timeSlots.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    // Get active tables
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('id, capacity')
      .eq('is_active', true)

    if (tablesError) throw tablesError

    // Get existing bookings for this date
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('table_id, time_slot_id')
      .eq('booking_date', date)
      .in('status', ['pending', 'confirmed'])

    if (bookingsError) throw bookingsError

    // Count bookings per slot-table combination
    const bookingsBySlot = new Map<string, number>()
    if (bookings) {
      bookings.forEach(booking => {
        const key = `${booking.time_slot_id}-${booking.table_id}`
        bookingsBySlot.set(key, (bookingsBySlot.get(key) || 0) + 1)
      })
    }

    // Calculate available capacity per time slot
    const slotsWithAvailability = timeSlots
      .map(slot => {
        // Filter tables that can accommodate the guest count
        const availableTables = tables.filter(t => t.capacity >= guests)
        let availableCapacity = 0

        availableTables.forEach(table => {
          const existingBookings = bookingsBySlot.get(`${slot.id}-${table.id}`) || 0
          const remainingCapacity = slot.max_bookings_per_slot - existingBookings
          if (remainingCapacity > 0) {
            availableCapacity += remainingCapacity
          }
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