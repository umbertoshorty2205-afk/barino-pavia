import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { sendBookingConfirmationEmail, sendBookingCancellationEmail } from '@/lib/email/send-booking-email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const action = searchParams.get('action')

    if (!token || !action) {
      return NextResponse.json(
        { error: 'Token e azione richiesti' },
        { status: 400 }
      )
    }

    if (!['confirm', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Azione non valida' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Prenotazione non trovata' },
        { status: 404 }
      )
    }

    // Verify token
    if (booking.confirmation_token !== token) {
      return NextResponse.json(
        { error: 'Token non valido' },
        { status: 401 }
      )
    }

    // Check if already confirmed/cancelled
    if (booking.status === 'confirmed' && action === 'confirm') {
      return NextResponse.json(
        { message: 'Prenotazione già confermata' },
        { status: 200 }
      )
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Prenotazione già annullata' },
        { status: 400 }
      )
    }

    // Get table and time slot info for email
    const [table, timeSlot] = await Promise.all([
      supabase.from('tables').select('name').eq('id', booking.table_id).single(),
      supabase.from('time_slots').select('start_time, end_time').eq('id', booking.time_slot_id).single(),
    ])

    const tableName = table.data?.name || 'Tavolo'
    const startTime = timeSlot.data?.start_time || ''
    const endTime = timeSlot.data?.end_time || ''

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'
    const confirmUrl = `${siteUrl}/api/bookings/${id}?token=${token}&action=confirm`
    const cancelUrl = `${siteUrl}/api/bookings/${id}?token=${token}&action=cancel`

    if (action === 'confirm') {
      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateError) throw updateError

      // Send confirmation email
      await sendBookingConfirmationEmail({
        bookingId: booking.id,
        confirmationToken: token,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        guestsCount: booking.guests_count,
        bookingDate: booking.booking_date,
        startTime,
        endTime,
        tableName: tableName || 'Tavolo',
        notes: booking.notes,
        confirmUrl,
        cancelUrl,
      })

      return NextResponse.json({ message: 'Prenotazione confermata con successo!' })
    }

    if (action === 'cancel') {
      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (updateError) throw updateError

      // Send cancellation email
      await sendBookingCancellationEmail({
        bookingId: booking.id,
        confirmationToken: token,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        guestsCount: booking.guests_count,
        bookingDate: booking.booking_date,
        startTime,
        endTime,
        tableName: tableName || 'Tavolo',
        notes: booking.notes,
        confirmUrl,
        cancelUrl,
      })

      return NextResponse.json({ message: 'Prenotazione annullata con successo' })
    }
  } catch (error) {
    console.error('Booking action error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token richiesto' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Prenotazione non trovata' },
        { status: 404 }
      )
    }

    if (booking.confirmation_token !== token) {
      return NextResponse.json(
        { error: 'Token non valido' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        status: booking.status,
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        guests_count: booking.guests_count,
        booking_date: booking.booking_date,
        created_at: booking.created_at,
      },
    })
  } catch (error) {
    console.error('Get booking error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}