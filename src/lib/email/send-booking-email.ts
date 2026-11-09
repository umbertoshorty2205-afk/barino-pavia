import nodemailer from 'nodemailer'
import { BookingInput } from '@/lib/booking/validation'

interface BookingDetails {
  bookingId: string
  confirmationToken: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  guestsCount: number
  bookingDate: string
  startTime: string
  endTime: string
  tableName: string
  notes?: string
  confirmUrl: string
  cancelUrl: string
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

function createResendTransporter() {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  // Resend uses a simple API, we'll use fetch directly
  return {
    send: async (options: { from: string; to: string; subject: string; html: string; text: string; attachments?: any[] }) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          attachments: options.attachments,
        }),
      })
      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`)
      }
      return response.json()
    },
  }
}

function generateICS(booking: BookingDetails): string {
  const startDate = new Date(`${booking.bookingDate}T${booking.startTime}`)
  const endDate = new Date(`${booking.bookingDate}T${booking.endTime}`)

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Barino Pavia//Booking System//IT',
    `UID:${booking.bookingId}@barino.pavia.it`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:Prenotazione Barino Pavia - ${booking.customerName}`,
    `DESCRIPTION:Prenotazione per ${booking.guestsCount} persone al tavolo ${booking.tableName}.\\nNote: ${booking.notes || 'Nessuna'}\\n\\nConferma: ${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=confirm\\nAnnulla: ${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=cancel`,
    `LOCATION:Barino Pavia, Corso Giuseppe Garibaldi 18, 27100 Pavia PV, Italia`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

async function sendEmailWithFallback(mailOptions: any): Promise<boolean> {
  // Try Nodemailer first (Gmail SMTP)
  try {
    const transporter = createTransporter()
    await transporter.sendMail(mailOptions)
    return true
  } catch (error: any) {
    console.warn('Nodemailer failed, trying Resend fallback:', error.message)

    // Check if it's a rate limit error (429) or other transient error
    const isRateLimit = error.code === 'EAUTH' ||
      error.responseCode === 429 ||
      error.response?.statusCode === 429 ||
      error.message?.includes('rate limit') ||
      error.message?.includes('quota') ||
      error.message?.includes('Daily user sending quota exceeded')

    if (isRateLimit && process.env.RESEND_API_KEY) {
      console.log('Rate limit detected, falling back to Resend...')
      try {
        const resendTransporter = createResendTransporter()
        if (resendTransporter) {
          await resendTransporter.send({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html,
            text: mailOptions.text,
            attachments: mailOptions.attachments,
          })
          console.log('Email sent via Resend fallback')
          return true
        }
      } catch (resendError) {
        console.error('Resend fallback also failed:', resendError)
      }
    }

    return false
  }
}

export async function sendBookingConfirmationEmail(booking: BookingDetails): Promise<boolean> {
  try {
    const icsContent = generateICS(booking)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'
    const confirmUrl = `${siteUrl}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=confirm`
    const cancelUrl = `${siteUrl}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=cancel`

    const mailOptions = {
      from: `"Barino Pavia" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `🎉 Conferma prenotazione Barino Pavia - ${booking.bookingDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ed7d1e, #de5e11); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Prenotazione Confermata!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Barino Pavia</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Ciao <strong>${booking.customerName}</strong>,</p>

            <p>La tua prenotazione è stata registrata con successo. Ecco i dettagli:</p>

            <div style="background: #fef7ee; border: 1px solid #fad9ac; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252; width: 40%;">📅 Data</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.bookingDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">🕐 Orario</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.startTime} - ${booking.endTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">🪑 Tavolo</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.tableName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">👥 Ospiti</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.guestsCount} persone</td>
                </tr>
                ${booking.customerPhone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">📞 Telefono</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.customerPhone}</td>
                </tr>
                ` : ''}
                ${booking.notes ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252; vertical-align: top;">📝 Note</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.notes}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" style="display: inline-block; background: #ed7d1e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin-right: 10px;">✅ Conferma Prenotazione</a>
              <a href="${cancelUrl}" style="display: inline-block; background: #e5e5e5; color: #525252; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">❌ Annulla Prenotazione</a>
            </div>

            <p style="color: #737373; font-size: 14px; margin-top: 30px;">
              <strong>Promemoria:</strong> Riceverai un'email di promemoria 24 ore prima dell'appuntamento.
              <br>L'allegato .ics ti permette di aggiungere l'evento al tuo calendario.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

            <p style="color: #a3a3a3; font-size: 12px; text-align: center;">
              Barino Pavia · Corso Giuseppe Garibaldi 18, 27100 Pavia PV · +39 0382 123456<br>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #ed7d1e;">barino.pavia.it</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Prenotazione Confermata - Barino Pavia

Ciao ${booking.customerName},

La tua prenotazione è stata registrata con successo.

Dettagli:
- Data: ${booking.bookingDate}
- Orario: ${booking.startTime} - ${booking.endTime}
- Tavolo: ${booking.tableName}
- Ospiti: ${booking.guestsCount} persone
${booking.customerPhone ? `- Telefono: ${booking.customerPhone}` : ''}
${booking.notes ? `- Note: ${booking.notes}` : ''}

Conferma: ${confirmUrl}
Annulla: ${cancelUrl}

Promemoria: Riceverai un'email di promemoria 24 ore prima dell'appuntamento.

Barino Pavia
Corso Giuseppe Garibaldi 18, 27100 Pavia PV
+39 0382 123456
      `,
      attachments: [
        {
          filename: `prenotazione-barino-${booking.bookingDate}.ics`,
          content: generateICS(booking),
          contentType: 'text/calendar',
        },
      ],
    }

    return await sendEmailWithFallback(mailOptions)
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    return false
  }
}

export async function sendBookingCancellationEmail(booking: BookingDetails): Promise<boolean> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'
    const confirmUrl = `${siteUrl}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=confirm`
    const cancelUrl = `${siteUrl}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=cancel`

    const mailOptions = {
      from: `"Barino Pavia" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `❌ Prenotazione Annullata - Barino Pavia - ${booking.bookingDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">❌ Prenotazione Annullata</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Barino Pavia</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Ciao <strong>${booking.customerName}</strong>,</p>

            <p>La tua prenotazione per il <strong>${booking.bookingDate}</strong> alle <strong>${booking.startTime}</strong> è stata annullata con successo.</p>

            <p style="margin-top: 20px;">Speriamo di rivederti presto al Barino!</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/prenota" style="display: inline-block; background: #ed7d1e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Prenota un nuovo tavolo</a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

            <p style="color: #a3a3a3; font-size: 12px; text-align: center;">
              Barino Pavia · Corso Giuseppe Garibaldi 18, 27100 Pavia PV · +39 0382 123456
            </p>
          </div>
        </body>
        </html>
      `,
    }

    return await sendEmailWithFallback(mailOptions)
  } catch (error) {
    console.error('Error sending booking cancellation email:', error)
    return false
  }
}

export async function sendBookingReminderEmail(booking: BookingDetails): Promise<boolean> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'
    const confirmUrl = `${siteUrl}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=confirm`
    const cancelUrl = `${siteUrl}/api/bookings/${booking.bookingId}?token=${booking.confirmationToken}&action=cancel`

    const mailOptions = {
      from: `"Barino Pavia" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `⏰ Promemoria: La tua prenotazione domani al Barino Pavia`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Promemoria Prenotazione</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Domani al Barino Pavia</p>
          </div>

          <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 18px; margin-bottom: 20px;">Ciao <strong>${booking.customerName}</strong>,</p>

            <p>Ti ricordiamo che domani hai una prenotazione al Barino:</p>

            <div style="background: #fef7ee; border: 1px solid #fad9ac; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252; width: 40%;">📅 Data</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.bookingDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">🕐 Orario</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.startTime} - ${booking.endTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">🪑 Tavolo</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.tableName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #525252;">👥 Ospiti</td>
                  <td style="padding: 8px 0; color: #171717;">${booking.guestsCount} persone</td>
                </tr>
              </table>
            </div>

            <p style="margin-top: 20px;">Ti aspettiamo! Se hai bisogno di modificare o annullare la prenotazione, usa i link nell'email di conferma.</p>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">

            <p style="color: #a3a3a3; font-size: 12px; text-align: center;">
              Barino Pavia · Corso Giuseppe Garibaldi 18, 27100 Pavia PV · +39 0382 123456
            </p>
          </div>
        </body>
        </html>
      `,
    }

    return await sendEmailWithFallback(mailOptions)
  } catch (error) {
    console.error('Error sending booking reminder email:', error)
    return false
  }
}