'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Countdown } from './Countdown'
import { cn } from '@/lib/utils'
import type { EventItem } from '@/types/cms'

const EVENT_TYPE_LABELS: Record<string, string> = {
  live: 'Live Music',
  dj: 'DJ Set',
  degustazione: 'Degustazione',
  altro: 'Altro',
}

const EVENT_TYPE_ICONS: Record<string, string> = {
  live: '🎵',
  dj: '🎧',
  degustazione: '🍷',
  altro: '📅',
}

interface EventCardProps {
  event: EventItem
  isFeatured?: boolean
}

export function EventCard({ event, isFeatured = false }: EventCardProps) {
  const eventDate = new Date(
    event.data.split('/').reverse().join('-') + 'T' + event.ora
  )

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
      className={cn(
        'group relative bg-white dark:bg-surface-900 rounded-2xl overflow-hidden',
        'border border-surface-200 dark:border-surface-700',
        'transition-all duration-300 ease-out',
        isFeatured ? 'h-full' : '',
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.immagine ? (
          <Image
            src={event.immagine}
            alt={event.titolo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-500 ease-out',
              'group-hover:scale-105',
            )}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-100">
            <span className="text-6xl">{EVENT_TYPE_ICONS[event.tipo] || '📅'}</span>
          </div>
        )}

        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full shadow-lg">
            <span>{EVENT_TYPE_ICONS[event.tipo] || '📅'}</span>
            <span>{EVENT_TYPE_LABELS[event.tipo] || event.tipo}</span>
          </span>
        </div>

        {/* Required Booking Badge */}
        {event.prenotazioneObbligatoria && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 px-2 py-1 bg-amber-600 text-white text-xs font-semibold rounded-full shadow-lg"
          >
            🎟️ Prenotazione obbligatoria
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Date & Time */}
        <div className="flex items-center gap-3 text-surface-600 dark:text-surface-400">
          <span className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-sm font-medium">
              {formatDate(event.data)} alle {event.ora}
            </span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {event.titolo}
        </h3>

        {/* Description */}
        <p className="text-surface-600 dark:text-surface-400 line-clamp-3">
          {event.descrizione}
        </p>

        {/* Countdown */}
        <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
          <Countdown targetDate={eventDate} />
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <a
            href={`/prenota?date=${event.data.split('/').reverse().join('-')}`}
            className={cn(
              'inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-semibold rounded-xl',
              'transition-all duration-300 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              'focus-visible:ring-offset-2',
              event.prenotazioneObbligatoria
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300',
            )}
          >
            {event.prenotazioneObbligatoria ? '🎟️ Prenota ora' : 'Scopri di più'}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </motion.article>
  )
}

function formatDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/')
  const date = new Date(`${year}-${month}-${day}`)
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}