'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MenuTabs } from './MenuTabs'
import { MenuFilters } from './MenuFilters'
import type { MenuItem } from '@/types/cms'
import type { MenuCategory } from '@/types/cms'

interface MenuSectionProps {
  dishes: MenuItem[]
}

export function MenuSection({ dishes }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('colazione')

  const dishesByCategory = useMemo(() => {
    const grouped: Record<MenuCategory, MenuItem[]> = {
      colazione: [],
      pranzo: [],
      aperitivo: [],
      drink: [],
      dolci: [],
    }
    dishes.forEach((dish) => {
      grouped[dish.categoria].push(dish)
    })
    // Sort by ordinamento within each category
    Object.keys(grouped).forEach((key) => {
      grouped[key as MenuCategory].sort((a, b) => a.ordinamento - b.ordinamento)
    })
    return grouped
  }, [dishes])

  const hasAnyDishes = dishes.length > 0

  return (
    <section id="menu" className="py-20 px-4" aria-labelledby="menu-heading">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2
            id="menu-heading"
            className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-surface-100 mb-4 animate-in"
          >
            Il Nostro Menu
          </h2>
          <p
            className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto animate-in"
            style={{ animationDelay: '0.1s' }}
          >
            Scopri le nostre proposte: dalla colazione all'aperitivo, passando per pranzo, drink e dolci.
            Tutto preparato con ingredienti freschi e di qualità.
          </p>
        </motion.div>

        {/* Filters */}
        <MenuFilters dishes={dishes}>
          {/* Tabs */}
          <MenuTabs
            dishesByCategory={dishesByCategory}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            hasAnyDishes={hasAnyDishes}
          />
        </MenuFilters>
      </div>
    </section>
  )
}