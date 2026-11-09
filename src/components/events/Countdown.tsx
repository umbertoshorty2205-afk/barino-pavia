'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CountdownProps {
  targetDate: Date
  className?: string
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    isPast: boolean
  }>(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    const updateTimeLeft = () => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }

    // Initial calculation
    updateTimeLeft()

    // Update every minute
    const interval = setInterval(updateTimeLeft, 60 * 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft.isPast) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', className)}
      >
        <span className="text-lg">▶</span>
        <span>In corso</span>
      </motion.span>
    )
  }

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 1) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', className)}
      >
        <span className="text-lg">⏰</span>
        <span>Inizia tra meno di un minuto</span>
      </motion.span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {timeLeft.days > 0 && (
        <CountdownUnit value={timeLeft.days} label={timeLeft.days === 1 ? 'giorno' : 'giorni'} />
      )}
      {timeLeft.hours > 0 && (
        <CountdownUnit value={timeLeft.hours} label={timeLeft.hours === 1 ? 'ora' : 'ore'} />
      )}
      {timeLeft.minutes > 0 && (
        <CountdownUnit value={timeLeft.minutes} label={timeLeft.minutes === 1 ? 'minuto' : 'minuti'} />
      )}
    </motion.div>
  )
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex flex-col items-center gap-0.5 px-2 py-1.5 bg-surface-100 dark:bg-surface-800 rounded-lg min-w-[3.5rem]">
      <span className="text-lg font-bold text-surface-900 dark:text-surface-100 tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wider">
        {label}
      </span>
    </span>
  )
}

function calculateTimeLeft(targetDate: Date) {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isPast: false }
}