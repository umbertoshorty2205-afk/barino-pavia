'use client'

import { motion } from 'framer-motion'
import { EventCard } from '@/components/events'
import type { EventItem } from '@/types/cms'

interface EventsClientProps {
  events: EventItem[]
}

export function EventsClient({ events }: EventsClientProps) {
  return (
    <>
      {/* All Events List */}
      <section id="eventi" className="py-20 px-4" aria-labelledby="eventi-heading">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 id="eventi-heading" className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-surface-100 mb-4 animate-in">
              Tutti gli Eventi
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto animate-in" style={{ animationDelay: '0.1s' }}>
              Non perdere i prossimi appuntamenti al Barino: live music, DJ set, degustazioni e tanto altro.
              Prenota il tuo posto per gli eventi che lo richiedono.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.titolo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}