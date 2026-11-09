import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendBookingReminderEmail } from '@/lib/email/send-booking-email'

// CRON job for 24h booking reminders
// Runs daily at 9:00 AM (configured in vercel.json)
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createServerClient()

    // Get bookings for tomorrow that haven't been reminded yet
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tables (name),
        time_slots (start_time, end_time)
      `)
      .eq('booking_date', tomorrowStr)
      .eq('status', 'confirmed')
      .is('reminder_sent_at', null)

    if (error) throw error

    let sent = 0
    let failed = 0

    for (const booking of bookings || []) {
      const tableName = booking.tables?.name || 'Tavolo'
      const startTime = booking.time_slots?.start_time || ''
      const endTime = booking.time_slots?.end_time || ''

      try {
        await sendBookingReminderEmail({
          bookingId: booking.id,
          confirmationToken: booking.confirmation_token,
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          guestsCount: booking.guests_count,
          bookingDate: booking.booking_date,
          startTime,
          endTime,
          tableName,
          notes: booking.notes,
          confirmUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/${booking.id}?token=${booking.confirmation_token}&action=confirm`,
          cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/${booking.id}?token=${booking.confirmation_token}&action=cancel`,
        })

        // Mark reminder as sent
        await supabase
          .from('bookings')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', booking.id)

        sent++
      } catch (error) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, error)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: (bookings || []).length,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}