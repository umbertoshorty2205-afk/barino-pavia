'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryItem } from './GalleryItem'
import type { GalleryItem as GalleryItemType } from '@/types/cms'

interface GalleryMasonryProps {
  items: GalleryItemType[]
  itemsPerPage?: number
}

export function GalleryMasonry({ items, itemsPerPage = 12 }: GalleryMasonryProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const loadMoreRef = useRef<HTMLButtonElement>(null)

  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  const handleItemClick = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + itemsPerPage, items.length))
  }, [itemsPerPage, items.length])

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasMore, handleLoadMore])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox()
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, items.length, handleCloseLightbox])

  return (
    <section id="gallery" className="py-20 px-4" aria-labelledby="gallery-heading">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 id="gallery-heading" className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-surface-100 mb-4 animate-in">
            Gallery
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto animate-in" style={{ animationDelay: '0.1s' }}>
            Scopri l'atmosfera del Barino attraverso i nostri scatti: interni, esterni, piatti, eventi e il nostro team.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <motion.ul
          role="list"
          aria-label="Gallery fotografica"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-auto-flow-dense"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gridAutoFlow: 'dense',
          }}
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <GalleryItem
                key={item.didascalia}
                item={item}
                index={index}
                onClick={handleItemClick}
              />
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Load More / Infinite Scroll Trigger */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              ref={loadMoreRef}
              type="button"
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              aria-label={`Carica altre ${Math.min(itemsPerPage, items.length - visibleCount)} immagini`}
            >
              Carica altro
              <span aria-hidden="true">({items.length - visibleCount} rimanenti)</span>
            </button>
          </motion.div>
        )}

        {/* Lightbox */}
        {selectedIndex !== null && (
          <Lightbox
            items={items}
            currentIndex={selectedIndex}
            onClose={handleCloseLightbox}
            onNavigate={(dir) => setSelectedIndex((prev) => {
              if (prev === null) return 0
              const next = prev + dir
              if (next < 0) return items.length - 1
              if (next >= items.length) return 0
              return next
            })}
          />
        )}
      </div>
    </section>
  )
}

// Lightbox Component
interface LightboxProps {
  items: GalleryItemType[]
  currentIndex: number
  onClose: () => void
  onNavigate: (dir: -1 | 1) => void
}

function Lightbox({ items, currentIndex, onClose, onNavigate }: LightboxProps) {
  const item = items[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Immagine ${currentIndex + 1} di ${items.length}: ${item.didascalia}`}
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        type="button"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Chiudi lightbox"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>

      {/* Navigation - Previous */}
      <motion.button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Immagine precedente"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.button>

      {/* Navigation - Next */}
      <motion.button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Immagine successiva"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.button>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-[90vw] max-h-[85vh]"
      >
        {item.immagine ? (
          <img
            src={item.immagine}
            alt={item.didascalia}
            className="max-w-[90vw] max-h-[85vh] object-contain"
          />
        ) : (
          <div className="w-[60vw] h-[60vh] flex items-center justify-center bg-surface-100 rounded-xl">
            <span className="text-8xl">🖼️</span>
          </div>
        )}

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white"
        >
          <h3 className="text-xl font-semibold mb-2">{item.didascalia}</h3>
          <div className="flex flex-wrap gap-2">
            {item.tag.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium rounded-full bg-white/20 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-white/70 text-center">
            {currentIndex + 1} / {items.length}
          </p>
        </motion.div>
      </motion.div>

      {/* Keyboard hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/60 text-sm"
      >
        <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
        <span>/</span>
        <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
        <span>naviga</span>
        <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd>
        <span>chiudi</span>
      </motion.div>
    </motion.div>
  )
}