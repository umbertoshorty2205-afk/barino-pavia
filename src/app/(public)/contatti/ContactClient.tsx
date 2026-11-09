'use client'

import { motion } from 'framer-motion'
import { ContactForm } from '@/components/contacts/ContactForm'
import type { Settings } from '@/types/cms'

interface ContactClientProps {
  settings: Settings
}

export function ContactPageClient({ settings }: ContactClientProps) {
  return (
    <>
      <section className="py-20 px-4" aria-labelledby="contatti-heading">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 id="contatti-heading" className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-surface-100 mb-4 animate-in">
              Contattaci
            </h1>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto animate-in" style={{ animationDelay: '0.1s' }}>
              Hai una domanda, una richiesta speciale o vuoi prenotare per un gruppo numeroso?
              Compila il modulo o vieni a trovarci direttamente in Corso Garibaldi.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info & Map */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-100 mb-6">
                  Dove siamo
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 0111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">Indirizzo</h3>
                      <address className="not-italic text-surface-600 dark:text-surface-400 mt-1">
                        Corso Giuseppe Garibaldi, 18<br />
                        27100 Pavia (PV), Italia
                      </address>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">Telefono</h3>
                      <a href="tel:+390382123456" className="text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mt-1 block">
                        +39 0382 123456
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">Email</h3>
                      <a href="mailto:info@barino.pavia.it" className="text-surface-600 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mt-1 block">
                        info@barino.pavia.it
                      </a>
                    </div>
                  </div>
                </div>

                {/* Orari */}
                <div className="mt-8 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Orari di apertura</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-surface-600 dark:text-surface-400">Lunedì</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">07:00 - 23:00</dd>
                    <dt className="text-surface-600 dark:text-surface-400">Martedì</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">07:00 - 23:00</dd>
                    <dt className="text-surface-600 dark:text-surface-400">Mercoledì</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">07:00 - 23:00</dd>
                    <dt className="text-surface-600 dark:text-surface-400">Giovedì</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">07:00 - 23:00</dd>
                    <dt className="text-surface-600 dark:text-surface-400">Venerdì</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">07:00 - 01:00</dd>
                    <dt className="text-surface-600 dark:text-surface-400">Sabato</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">08:00 - 01:00</dd>
                    <dt className="text-surface-600 dark:text-surface-400">Domenica</dt>
                    <dd className="font-medium text-surface-900 dark:text-surface-100">08:00 - 22:00</dd>
                  </dl>
                </div>

                {/* Mappa */}
                <div className="mt-8">
                  <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Come trovarci</h3>
                  <div className="aspect-video rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.838434792584!2d9.1582!3d45.1847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47868b7b5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sCorso%20Giuseppe%20Garibaldi%2C%2018%2C%2027100%20Pavia%20PV!5e0!3m2!1sit!2sit!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mappa Barino Pavia"
                    ></iframe>
                  </div>
                  <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 text-center">
                    <a href="https://maps.google.com/?q=Corso+Giuseppe+Garibaldi+18+Pavia" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
                      Apri in Google Maps →
                    </a>
                  </p>
                </div>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Seguici sui social</h3>
                <div className="flex gap-4">
                  <a href="https://instagram.com/barino_pavia" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="https://facebook.com/barinopavia" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://tripadvisor.it/barino_pavia" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor" className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1.5-7.5c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zM7 10c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm7 0c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 7c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100 mb-2">
                  Scrivici
                </h2>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  Compila il modulo e ti risponderemo entro 24 ore.
                </p>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}