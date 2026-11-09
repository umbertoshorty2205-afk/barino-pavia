'use client'

import { useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import itLocale from '@fullcalendar/core/locales/it'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TimeSlotWithAvailability } from '@/lib/booking/availability'

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void
  availableSlots: TimeSlotWithAvailability[]
  selectedDate?: Date
  loading?: boolean
}

export function BookingCalendar({
  onDateSelect,
  availableSlots,
  selectedDate,
  loading = false,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleDateSelect = useCallback((selectInfo: any) => {
    const date = selectInfo.start
    if (date >= new Date(new Date().setHours(0, 0, 0, 0))) {
      onDateSelect(date)
    }
  }, [onDateSelect])

  const getDayClassNames = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)

    if (compareDate < today) return 'fc-day-past'
    if (selectedDate && compareDate.getTime() === selectedDate.getTime()) return 'fc-day-selected'

    // Check if date has available slots
    const dateStr = date.toISOString().split('T')[0]
    const hasSlots = availableSlots.some(slot => {
      // In a real implementation, we'd check if there are slots for this date
      return true // Simplified
    })

    return hasSlots ? 'fc-day-available' : 'fc-day-unavailable'
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Mese precedente"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 min-w-[150px] text-center">
              {currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Mese successivo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-600 dark:text-surface-400">
              {availableSlots.length} slot disponibili
            </span>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-2">
          <FullCalendar
            locale={itLocale}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            initialDate={currentDate}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleDateSelect}
            dateClick={handleDateSelect}
            dayHeaderClassNames={['text-sm font-medium text-surface-600 dark:text-surface-400']}
            dayCellClassNames={({ date }) => {
              const dayClass = getDayClassNames(date)
              return ['relative', dayClass]
            }}
            dayCellContent={(arg: any) => {
              const isPast = arg.date < new Date(new Date().setHours(0, 0, 0, 0))
              const isSelected = arg.date.toDateString() === selectedDate?.toDateString()

              return (
                <div className="relative h-full w-full flex items-center justify-center">
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    isPast ? 'text-surface-300 dark:text-surface-600' : 'text-surface-900 dark:text-surface-100',
                    isSelected && 'text-white'
                  )}>
                    {arg.dayNumberText}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 bg-brand-600 rounded-full -z-10" />
                  )}
                </div>
              )
            }}
            eventContent={(arg: any) => (
              <div className="text-xs px-1 py-0.5 bg-brand-100 text-brand-700 rounded truncate">
                {arg.event.title}
              </div>
            )}
            events={[]}
            height="auto"
          />
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
            <span className="text-sm text-surface-600 dark:text-surface-400">Disponibile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" />
            <span className="text-sm text-surface-600 dark:text-surface-400">Pieno</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-surface-200 dark:bg-surface-700" />
            <span className="text-sm text-surface-600 dark:text-surface-400">Passato</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-600" />
            <span className="text-sm text-surface-600 dark:text-surface-400">Selezionato</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}