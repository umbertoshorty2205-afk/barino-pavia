'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MenuCard } from './MenuCard'
import type { MenuCategory } from '@/types/cms'
import type { MenuItem } from '@/types/cms'

const CATEGORIES: { value: MenuCategory; label: string; icon: string }[] = [
  { value: 'colazione', label: 'Colazione', icon: '☕' },
  { value: 'pranzo', label: 'Pranzo', icon: '🍽️' },
  { value: 'aperitivo', label: 'Aperitivo', icon: '🍷' },
  { value: 'drink', label: 'Drink', icon: '🍹' },
  { value: 'dolci', label: 'Dolci', icon: '🍰' },
]

interface MenuTabsProps {
  dishesByCategory: Record<MenuCategory, MenuItem[]>
  activeCategory: MenuCategory
  onCategoryChange: (category: MenuCategory) => void
  hasAnyDishes: boolean
}

export function MenuTabs({
  dishesByCategory,
  activeCategory,
  onCategoryChange,
  hasAnyDishes,
}: MenuTabsProps) {
  const [isMobile, setIsMobile] = useState(false)

  if (!hasAnyDishes) {
    return (
      <div className="text-center py-12">
        <p className="text-surface-500 text-lg">Nessun piatto disponibile al momento</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div
        className={cn(
          'flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide',
          isMobile ? 'justify-start' : 'justify-center',
        )}
        role="tablist"
        aria-label="Categorie menu"
      >
        <AnimatePresence mode="popLayout">
          {CATEGORIES.map((cat, index) => {
            const count = dishesByCategory[cat.value]?.length || 0
            const isActive = activeCategory === cat.value

            if (count === 0 && !isActive) return null

            return (
              <motion.button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`menu-panel-${cat.value}`}
                id={`menu-tab-${cat.value}`}
                onClick={() => onCategoryChange(cat.value)}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full',
                  'whitespace-nowrap transition-all duration-200 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  'focus-visible:ring-offset-2',
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-700 dark:hover:text-brand-300',
                )}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      'flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold rounded-full',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400',
                    )}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="tabpanel"
          id={`menu-panel-${activeCategory}`}
          aria-labelledby={`menu-tab-${activeCategory}`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishesByCategory[activeCategory]?.map((dish, index) => (
              <motion.div
                key={dish.nome}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <MenuCard dish={dish} index={index} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}