'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { TimeSlotWithAvailability } from '@/lib/booking/availability'

interface TimeSlotGridProps {
  slots: TimeSlotWithAvailability[]
  selectedSlotId?: string | null
  onSlotSelect: (slotId: string) => void
  guests: number
  loading?: boolean
}

export function TimeSlotGrid({
  slots,
  selectedSlotId,
  onSlotSelect,
  guests,
  loading = false,
}: TimeSlotGridProps) {
  const formatTime = (time: string) => {
    return time.slice(0, 5) // HH:MM
  }

  if (slots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
          Nessuno slot disponibile
        </h3>
        <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
          Per la data selezionata e {guests} ospiti non ci sono tavoli disponibili.
          Prova a cambiare data o ridurre il numero di ospiti.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          Scegli l'orario ({slots.length} disponibili)
        </h3>
        <span className="text-sm text-surface-500 dark:text-surface-400">
          {guests} ospiti
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {slots.map((slot, index) => (
            <motion.button
              key={slot.slot_id}
              type="button"
              onClick={() => onSlotSelect(slot.slot_id)}
              disabled={loading}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative px-4 py-3 rounded-xl font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                selectedSlotId === slot.slot_id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 ring-2 ring-brand-600 ring-offset-2'
                  : 'bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold tabular-nums">
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </span>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  {slot.availableCapacity} tavolo{slot.availableCapacity !== 1 ? 'i' : ''} disponibile{slot.availableCapacity !== 1 ? 'i' : ''}
                </span>
              </div>
              {selectedSlotId === slot.slot_id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-white text-brand-600 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
        <p className="text-sm text-surface-500 dark:text-surface-400 text-center">
          La prenotazione ha una durata di 90 minuti. Ti chiediamo di liberare il tavolo per l'orario successivo.
        </p>
      </div>
    </motion.div>
  )
}

function formatTime(time: string): string {
  return time.slice(0, 5) // HH:MM
}