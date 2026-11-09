'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { bookingSchema, type BookingInput } from '@/lib/booking/validation'

interface BookingFormProps {
  selectedDate: string
  selectedSlotId: string
  selectedSlot: { start_time: string; end_time: string }
  onBack: () => void
  onSuccess: (confirmationData: { bookingId: string; token: string }) => void
  loading?: boolean
}

export function BookingForm({
  selectedDate,
  selectedSlotId,
  selectedSlot,
  onBack,
  onSuccess,
  loading = false,
}: BookingFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      booking_date: selectedDate,
      time_slot_id: selectedSlotId,
    },
  })

  const guestsCount = watch('guests_count')

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => time.slice(0, 5)

  const onSubmit = async (data: BookingInput) => {
    setSubmitError(null)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante la prenotazione')
      }

      toast.success('Prenotazione inviata! Controlla la tua email per confermare.')
      onSuccess({ bookingId: result.bookingId, token: result.confirmationToken })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore sconosciuto'
      setSubmitError(message)
      toast.error(message)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4"
      >
        <h3 className="font-semibold text-brand-900 dark:text-brand-100 mb-3 flex items-center gap-2">
          <span>📋</span>
          Riepilogo prenotazione
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-surface-500 dark:text-surface-400">Data</span>
            <p className="font-medium text-surface-900 dark:text-surface-100">
              {formatDate(selectedDate)}
            </p>
          </div>
          <div>
            <span className="text-surface-500 dark:text-surface-400">Orario</span>
            <p className="font-medium text-surface-900 dark:text-surface-100">
              {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
            </p>
          </div>
          <div>
            <span className="text-surface-500 dark:text-surface-400">Ospiti</span>
            <p className="font-medium text-surface-900 dark:text-surface-100">
              {guestsCount || 1} persona{guestsCount !== 1 ? 'e' : ''}
            </p>
          </div>
          <div>
            <span className="text-surface-500 dark:text-surface-400">Durata</span>
            <p className="font-medium text-surface-900 dark:text-surface-100">90 minuti</p>
          </div>
        </div>
      </motion.div>

      {/* Form Fields */}
      <div className="space-y-5">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            {...register('customer_name')}
            type="text"
            id="customer_name"
            placeholder="Mario Rossi"
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              errors.customer_name
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-surface-300 dark:border-surface-600'
            )}
            aria-invalid={errors.customer_name ? 'true' : 'false'}
            aria-describedby={errors.customer_name ? 'customer_name-error' : undefined}
            disabled={loading || isSubmitting}
          />
          <AnimatePresence>
            {errors.customer_name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="customer_name-error"
                className="mt-1.5 text-sm text-red-500"
                role="alert"
              >
                {errors.customer_name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="mario@example.com"
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              errors.email
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-surface-300 dark:border-surface-600'
            )}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={loading || isSubmitting}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="email-error"
                className="mt-1.5 text-sm text-red-500"
                role="alert"
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Telefono (opzionale)
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            placeholder="+39 3XX XXXXXXX"
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              errors.phone
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-surface-300 dark:border-surface-600'
            )}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            disabled={loading || isSubmitting}
          />
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="phone-error"
                className="mt-1.5 text-sm text-red-500"
                role="alert"
              >
                {errors.phone.message}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            Formato: +39 3XX XXXXXXX (usato solo per conferme urgenti)
          </p>
        </div>

        <div>
          <label htmlFor="guests_count" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Numero ospiti <span className="text-red-500">*</span>
          </label>
          <select
            {...register('guests_count', { valueAsNumber: true })}
            id="guests_count"
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors appearance-none',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              errors.guests_count
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-surface-300 dark:border-surface-600'
            )}
            aria-invalid={errors.guests_count ? 'true' : 'false'}
            aria-describedby={errors.guests_count ? 'guests_count-error' : undefined}
            disabled={loading || isSubmitting}
          >
            {[...Array(20)].map((_, i) => i + 1).map(n => (
              <option key={n} value={n}>
                {n} persona{n !== 1 ? 'e' : ''}
              </option>
            ))}
          </select>
          <AnimatePresence>
            {errors.guests_count && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="guests_count-error"
                className="mt-1.5 text-sm text-red-500"
                role="alert"
              >
                {errors.guests_count.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Note (opzionale)
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            placeholder="Allergie, richieste particolari, occasione speciale..."
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors resize-none',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              'border-surface-300 dark:border-surface-600'
            )}
            disabled={loading || isSubmitting}
          />
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            Massimo 500 caratteri
          </p>
        </div>

        {/* Hidden fields */}
        <input type="hidden" {...register('booking_date')} />
        <input type="hidden" {...register('time_slot_id')} />
        <input type="hidden" {...register('table_id')} />
      </div>

      {/* Submit Error */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
            role="alert"
          >
            <p className="font-medium">Errore durante la prenotazione</p>
            <p className="text-sm mt-1">{submitError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 text-sm font-medium rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          disabled={loading || isSubmitting}
        >
          Indietro
        </button>
        <button
          type="submit"
          className={cn(
            'flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            loading || isSubmitting
              ? 'bg-brand-500 text-white cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25'
          )}
          disabled={loading || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Invio...
            </span>
          ) : (
            'Invia prenotazione'
          )}
        </button>
      </div>

      <p className="text-center text-xs text-surface-500 dark:text-surface-400">
        Inviando la prenotazione, accetti i nostri{' '}
        <a href="/privacy" className="underline hover:text-brand-600">Termini e Privacy</a>
        . Riceverai un'email di conferma con link per confermare/annullare.
      </p>
    </motion.form>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  return time.slice(0, 5)
}