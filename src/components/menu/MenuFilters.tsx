'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MenuCard } from './MenuCard'
import type { MenuItem, Allergene } from '@/types/cms'

const ALLERGENI_LABELS: Record<string, string> = {
  glutine: 'Glutine',
  lattosio: 'Lattosio',
  frutta_guscio: 'Frutta a guscio',
  uova: 'Uova',
  soia: 'Soia',
}

interface MenuFiltersProps {
  dishes: MenuItem[]
  children?: React.ReactNode
}

export function MenuFilters({ dishes, children }: MenuFiltersProps) {
  const [activeAllergeni, setActiveAllergeni] = useState<Allergene[]>([])
  const [activeVegano, setActiveVegano] = useState(false)

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Filter by allergeni (exclude dishes containing selected allergens)
      if (activeAllergeni.length > 0) {
        const hasAllergen = activeAllergeni.some((a) => dish.allergeni.includes(a))
        if (hasAllergen) return false
      }
      // Filter by vegano
      if (activeVegano && !dish.vegano) return false
      return true
    })
  }, [dishes, activeAllergeni, activeVegano])

  const allAllergeni = useMemo(() => {
    const set = new Set<Allergene>()
    dishes.forEach((dish) => dish.allergeni.forEach((a) => set.add(a)))
    return Array.from(set).sort()
  }, [dishes])

  const toggleAllergene = (allergene: Allergene) => {
    setActiveAllergeni((prev) =>
      prev.includes(allergene) ? prev.filter((a) => a !== allergene) : [...prev, allergene]
    )
  }

  return (
    <div className="w-full">
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtri menu">
        <AnimatePresence mode="popLayout">
          {allAllergeni.map((allergene) => (
            <motion.button
              key={allergene}
              type="button"
              role="button"
              aria-pressed={activeAllergeni.includes(allergene)}
              onClick={() => toggleAllergene(allergene)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full',
                'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                activeAllergeni.includes(allergene)
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-surface-100 text-surface-700 hover:bg-brand-50 hover:text-brand-700',
              )}
            >
              <span className="text-xs">⧖</span>
              <span>Senza {ALLERGENI_LABELS[allergene] || allergene}</span>
            </motion.button>
          ))}
        </AnimatePresence>

        <motion.button
          type="button"
          role="button"
          aria-pressed={activeVegano}
          onClick={() => setActiveVegano(!activeVegano)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full',
            'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            activeVegano
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-surface-100 text-surface-700 hover:bg-green-50 hover:text-green-700',
          )}
        >
          <span className="text-xs">🌱</span>
          <span>Vegano</span>
        </motion.button>

        {(activeAllergeni.length > 0 || activeVegano) && (
          <motion.button
            type="button"
            onClick={() => {
              setActiveAllergeni([])
              setActiveVegano(false)
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-surface-100 text-surface-700 hover:bg-surface-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <span>✕</span>
            <span>Reset filtri</span>
          </motion.button>
        )}
      </div>

      {/* Render children (e.g., MenuTabs) */}
      {children}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredDishes.map((dish, index) => (
            <MenuCard key={dish.nome} dish={dish} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {filteredDishes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-surface-500 text-lg">Nessun piatto trovato con i filtri selezionati</p>
          <button
            type="button"
            onClick={() => {
              setActiveAllergeni([])
              setActiveVegano(false)
            }}
            className="mt-4 text-brand-600 hover:text-brand-700 font-medium underline"
          >
            Resetta i filtri
          </button>
        </motion.div>
      )}
    </div>
  )
}