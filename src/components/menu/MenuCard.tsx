'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { MenuItem } from '@/types/cms'

const ALLERGENE_ICONS: Record<string, string> = {
  glutine: '🌾',
  lattosio: '🥛',
  frutta_guscio: '🌰',
  uova: '🥚',
  soia: '🫘',
}

const ALLERGENE_LABELS: Record<string, string> = {
  glutine: 'Glutine',
  lattosio: 'Lattosio',
  frutta_guscio: 'Frutta a guscio',
  uova: 'Uova',
  soia: 'Soia',
}

interface MenuCardProps {
  dish: MenuItem
  index?: number
}

export function MenuCard({ dish, index = 0 }: MenuCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
      className={cn(
        'group relative bg-white dark:bg-surface-900 rounded-xl overflow-hidden',
        'border border-surface-200 dark:border-surface-700',
        'transition-all duration-300 ease-out',
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
        {dish.immagine ? (
          <img
            src={dish.immagine}
            alt={dish.nome}
            className={cn(
              'w-full h-full object-cover transition-all duration-500 ease-out',
              'group-hover:scale-105',
            )}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-100">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Featured badge */}
        {dish.inEvidenza && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 z-10 px-2 py-1 bg-brand-600 text-white text-xs font-medium rounded-full shadow-lg"
          >
            ⭐ Piatto del giorno
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Header with name and price */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {dish.nome}
          </h3>
          <motion.span
            className="text-lg font-bold text-brand-600 dark:text-brand-400 whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            €{dish.prezzo.toFixed(2).replace('.', ',')}
          </motion.span>
        </div>

        {/* Description */}
        <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
          {dish.descrizione}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5" role="list" aria-label="Caratteristiche del piatto">
          {dish.vegano && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
              )}
              role="listitem"
            >
              <span>🌱</span>
              <span>Vegano</span>
            </motion.span>
          )}

          {dish.allergeni.map((allergene) => (
            <motion.span
              key={allergene}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
                'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
              )}
              role="listitem"
            >
              <span>{ALLERGENE_ICONS[allergene] || '⚠'}</span>
              <span>{ALLERGENE_LABELS[allergene] || allergene}</span>
            </motion.span>
          ))}
        </div>

        {/* Category badge */}
        <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400">
            {dish.categoria.charAt(0).toUpperCase() + dish.categoria.slice(1)}
          </span>
        </div>
      </div>
    </motion.article>
  )
}