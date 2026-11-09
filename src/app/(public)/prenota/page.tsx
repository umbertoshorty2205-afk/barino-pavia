'use client'

import { BookingSteps } from '@/components/booking'

export default function PrenotaPage() {
  return (
    <>
      <section className="py-20 px-4" aria-labelledby="prenota-heading">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 id="prenota-heading" className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-surface-100 mb-4 animate-in">
              Prenota il tuo tavolo
            </h1>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto animate-in" style={{ animationDelay: '0.1s' }}>
              Scegli la data, l'orario e compila il modulo. Riceverai un'email di conferma con link per confermare o annullare.
            </p>
          </motion.div>

          <BookingSteps initialGuests={2} />
        </div>
      </section>
    </>
  )
}

import { motion } from 'framer-motion'