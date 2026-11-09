import { createClient } from '@/lib/supabase/client'

export interface TimeSlotWithAvailability {
  slot_id: string
  start_time: string
  end_time: string
  slot_duration_minutes: number
  max_bookings_per_slot: number
  availableCapacity: number
}

export async function getAvailableSlots(
  date: string,
  guests: number
): Promise<TimeSlotWithAvailability[]> {
  const supabase = createClient()

  // 1. Get all active time slots for the day of week
  const dayOfWeek = new Date(date).getDay() // 0 = Sunday, 6 = Saturday

  const { data: timeSlots, error: slotsError } = await supabase
    .from('time_slots')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .order('start_time')

  if (slotsError) {
    console.error('Error fetching time slots:', slotsError)
    return []
  }

  if (!timeSlots || timeSlots.length === 0) {
    return []
  }

  // 2. Get all active tables
  const { data: tables, error: tablesError } = await supabase
    .from('tables')
    .select('id, capacity')
    .eq('is_active', true)

  if (tablesError) {
    console.error('Error fetching tables:', tablesError)
    return []
  }

  if (!tables || tables.length === 0) {
    return []
  }

  // 3. Get existing bookings for the date
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('table_id, time_slot_id')
    .eq('booking_date', date)
    .in('status', ['pending', 'confirmed'])

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError)
    return []
  }

  // 4. Calculate available capacity per slot
  const bookingsBySlot = new Map<string, number>()
  if (bookings) {
    bookings.forEach(booking => {
      const key = `${booking.time_slot_id}-${booking.table_id}`
      bookingsBySlot.set(key, (bookingsBySlot.get(key) || 0) + 1)
    })
  }

  // 4. Calculate available capacity per time slot
  const slotsWithAvailability = timeSlots
    .map(slot => {
      // Count how many tables can accommodate the guest count for this slot
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
    .filter(slot => slot.availableCapacity > 0) // Only return slots with capacity

  return slotsWithAvailability
}