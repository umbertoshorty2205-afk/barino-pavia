'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri'),
  email: z.string().email('Email non valida'),
  phone: z.string().optional().refine(val => !val || /^(\+39\s?)?[0-9\s]{9,15}$/.test(val), 'Formato telefono non valido'),
  subject: z.string().min(5, 'L\'oggetto deve contenere almeno 5 caratteri'),
  message: z.string().min(10, 'Il messaggio deve contenere almeno 10 caratteri').max(1000, 'Il messaggio non può superare 1000 caratteri'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('submitting')
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante l\'invio')
      }

      setSubmitStatus('success')
      toast.success('Messaggio inviato! Ti risponderemo al più presto.')
      reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore sconosciuto'
      setSubmitStatus('error')
      setSubmitError(message)
      toast.error(message)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            placeholder="Mario Rossi"
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              errors.name
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-surface-300 dark:border-surface-600'
            )}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="name-error"
                className="mt-1.5 text-sm text-red-500"
                role="alert"
              >
                {errors.name.message}
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
            disabled={isSubmitting}
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
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
            disabled={isSubmitting}
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
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Oggetto <span className="text-red-500">*</span>
          </label>
          <select
            {...register('subject')}
            id="subject"
            className={cn(
              'w-full px-4 py-3 rounded-lg border transition-colors appearance-none',
              'bg-white dark:bg-surface-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              errors.subject
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-surface-300 dark:border-surface-600'
            )}
            aria-invalid={errors.subject ? 'true' : 'false'}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            disabled={isSubmitting}
          >
            <option value="">Seleziona un argomento</option>
            <option value="prenotazione">Informazioni prenotazione</option>
            <option value="eventi">Eventi e serate</option>
            <option value="menu">Menu e allergeni</option>
            <option value="lavora">Lavora con noi</option>
            <option value="altro">Altro</option>
          </select>
          <AnimatePresence>
            {errors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                id="subject-error"
                className="mt-1.5 text-sm text-red-500"
                role="alert"
              >
                {errors.subject.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
          Messaggio <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={5}
          placeholder="Scrivi qui il tuo messaggio..."
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-colors resize-none',
            'bg-white dark:bg-surface-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            errors.message
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-surface-300 dark:border-surface-600'
          )}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          disabled={isSubmitting}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id="message-error"
              className="mt-1.5 text-sm text-red-500"
              role="alert"
            >
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          Massimo 1000 caratteri
        </p>
      </div>

      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
            role="alert"
          >
            <p className="font-medium">Errore durante l'invio</p>
            <p className="text-sm mt-1">{submitError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button
          type="submit"
          className={cn(
            'flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            isSubmitting
              ? 'bg-brand-500 text-white cursor-not-allowed'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25'
          )}
          disabled={isSubmitting}
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
            'Invia messaggio'
          )}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="flex-1 px-6 py-3 text-sm font-semibold rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          disabled={isSubmitting}
        >
          Resetta
        </button>
      </div>

      <p className="text-center text-xs text-surface-500 dark:text-surface-400">
        Inviando il modulo, accetti i nostri{' '}
        <a href="/privacy" className="underline hover:text-brand-600">Termini e Privacy</a>
        . I tuoi dati saranno usati solo per rispondere alla tua richiesta.
      </p>
    </motion.form>
  )
}