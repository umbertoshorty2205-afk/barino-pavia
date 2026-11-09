'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BookingCalendar } from './BookingCalendar'
import { TimeSlotGrid } from './TimeSlotGrid'
import { BookingForm } from './BookingForm'
import { getAvailableSlots } from '@/lib/booking/availability'
import type { TimeSlotWithAvailability } from '@/lib/booking/availability'

type Step = 'calendar' | 'time' | 'form' | 'confirmation'

interface BookingStepsProps {
  initialGuests?: number
}

export function BookingSteps({ initialGuests = 2 }: BookingStepsProps) {
  const [step, setStep] = useState<Step>('calendar')
  const [guests, setGuests] = useState(initialGuests)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ start_time: string; end_time: string } | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlotWithAvailability[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState<{ bookingId: string; token: string } | null>(null)

  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date)
    setSelectedSlotId(null)
    setSelectedSlot(null)
    setLoading(true)

    try {
      const dateStr = date.toISOString().split('T')[0]
      const slots = await getAvailableSlots(dateStr, guests)
      setAvailableSlots(slots)
      setStep('time')
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoading(false)
    }
  }, [guests])

  const handleSlotSelect = useCallback((slotId: string) => {
    const slot = availableSlots.find(s => s.slot_id === slotId)
    if (slot) {
      setSelectedSlotId(slotId)
      setSelectedSlot({ start_time: slot.start_time, end_time: slot.end_time })
      setStep('form')
    }
  }, [availableSlots])

  const handleBack = useCallback(() => {
    if (step === 'time') {
      setStep('calendar')
      setSelectedDate(null)
      setAvailableSlots([])
    } else if (step === 'form') {
      setStep('time')
      setSelectedSlotId(null)
      setSelectedSlot(null)
    }
  }, [step])

  const handleGuestChange = useCallback((newGuests: number) => {
    setGuests(newGuests)
    if (step === 'time' && selectedDate) {
      setLoading(true)
      getAvailableSlots(selectedDate.toISOString().split('T')[0], newGuests)
        .then(slots => setAvailableSlots(slots))
        .finally(() => setLoading(false))
    }
  }, [step, selectedDate])

  const handleFormSuccess = useCallback((confirmationData: { bookingId: string; token: string }) => {
    setConfirmation(confirmationData)
    setStep('confirmation')
  }, [])

  const handleRestart = useCallback(() => {
    setStep('calendar')
    setSelectedDate(null)
    setSelectedSlotId(null)
    setSelectedSlot(null)
    setAvailableSlots([])
    setConfirmation(null)
    setGuests(initialGuests)
  }, [initialGuests])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          {['calendar', 'time', 'form', 'confirmation'].map((s, index) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center relative"
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                step === s || (['calendar', 'time', 'form'].indexOf(step) > ['calendar', 'time', 'form'].indexOf(s))
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
              )}>
                {['📅', '🕐', '📝', '✅'][index]}
              </div>
              <span className={cn(
                'mt-1 text-xs font-medium text-center w-24',
                step === s ? 'text-brand-600 dark:text-brand-400' : 'text-surface-500 dark:text-surface-400'
              )}>
                {['Data', 'Orario', 'Dati', 'Conferma'][index]}
              </span>
              {index < 3 && (
                <motion.div
                  className="absolute top-5 left-[50%] w-full h-1 bg-surface-200 dark:bg-surface-700"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: ['calendar', 'time', 'form'].indexOf(step) > index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingCalendar
              onDateSelect={handleDateSelect}
              availableSlots={availableSlots}
              selectedDate={selectedDate ?? undefined}
              loading={loading}
            />
            <div className="mt-4 flex justify-center">
              <label className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={guests}
                  onChange={e => handleGuestChange(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                />
                <span className="text-sm text-surface-600 dark:text-surface-400">ospiti</span>
              </label>
            </div>
          </motion.div>
        )}

        {step === 'time' && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <TimeSlotGrid
              slots={availableSlots}
              selectedSlotId={selectedSlotId}
              onSlotSelect={(slotId) => {
                const slot = availableSlots.find(s => s.slot_id === slotId)
                if (slot) {
                  setSelectedSlotId(slotId)
                  setSelectedSlot({ start_time: slot.start_time, end_time: slot.end_time })
                }
              }}
              guests={guests}
              loading={loading}
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setStep('calendar')}
                className="px-6 py-3 text-sm font-medium rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                Cambia data
              </button>
            </div>
          </motion.div>
        )}

        {step === 'form' && selectedSlot && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingForm
              selectedDate={selectedDate?.toISOString().split('T')[0] ?? ''}
              selectedSlotId={selectedSlotId ?? ''}
              selectedSlot={selectedSlot!}
              onBack={() => setStep('time')}
              onSuccess={handleFormSuccess}
              loading={loading}
            />
          </motion.div>
        )}

        {step === 'confirmation' && confirmation && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h2 className="text-3xl font-display font-bold text-surface-900 dark:text-surface-100 mb-2">
              Prenotazione inviata!
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
              Controlla la tua email per confermare la prenotazione. Riceverai un messaggio con i dettagli e i link per confermare o annullare.
            </p>

            <div className="bg-surface-50 dark:bg-surface-800 rounded-xl p-6 mb-8 max-w-md mx-auto text-left space-y-3">
              <p className="font-medium text-surface-900 dark:text-surface-100">Dettagli prenotazione:</p>
              <div className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
                <p><span className="font-medium">ID:</span> {confirmation.bookingId.slice(0, 8)}...</p>
                <p><span className="font-medium">Token:</span> {confirmation.token.slice(0, 8)}...</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-8 py-3 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Nuova prenotazione
              </button>
              <a
                href="/"
                className="px-8 py-3 text-sm font-semibold rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 text-center"
              >
                Torna alla home
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}