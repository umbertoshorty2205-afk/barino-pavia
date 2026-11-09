'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EventCard } from './EventCard'
import type { EventItem } from '@/types/cms'

interface EventsCarouselProps {
  events: EventItem[]
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 1 })
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index)
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
    }
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
    const onScroll = () => {
      setScrollProgress(emblaApi.scrollProgress())
    }

    onInit()
    onSelect()

    emblaApi.on('init', onInit)
    emblaApi.on('select', onSelect)
    emblaApi.on('scroll', onScroll)
    emblaApi.on('reInit', onInit)

    return () => {
      emblaApi.off('init', onInit)
      emblaApi.off('select', onSelect)
      emblaApi.off('scroll', onScroll)
      emblaApi.off('reInit', onInit)
    }
  }, [emblaApi])

  const featuredEvents = events.filter(e => e.prenotazioneObbligatoria).slice(0, 5)

  if (featuredEvents.length === 0) return null

  return (
    <section className="py-16 px-4" aria-labelledby="featured-events-heading">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            id="featured-events-heading"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-display font-bold text-surface-900 dark:text-surface-100"
          >
            Eventi in Evidenza
          </motion.h2>
        </div>

        <div className="relative" ref={emblaRef}>
          <div className="overflow-hidden">
            <div className="flex" style={{ transform: `translate3d(${-scrollProgress * 100}%, 0, 0)` }}>
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.titolo}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex-[0_0_100%] min-w-0 px-2"
                >
                  <EventCard event={event} isFeatured={true} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            type="button"
            onClick={scrollPrev}
            disabled={selectedIndex === 0}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: selectedIndex === 0 ? 0.3 : 1, x: 0 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-2 rounded-full bg-white/90 dark:bg-surface-900/90 text-surface-900 dark:text-surface-100 hover:bg-white dark:hover:bg-surface-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Evento precedente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>

          <motion.button
            type="button"
            onClick={scrollNext}
            disabled={selectedIndex === scrollSnaps.length - 1}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: selectedIndex === scrollSnaps.length - 1 ? 0.3 : 1, x: 0 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-2 rounded-full bg-white/90 dark:bg-surface-900/90 text-surface-900 dark:text-surface-100 hover:bg-white dark:hover:bg-surface-800 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Evento successivo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>

        {/* Dots Navigation */}
        {scrollSnaps.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-2 mt-8"
            role="tablist"
            aria-label="Navigazione eventi in evidenza"
          >
            {scrollSnaps.map((_, index) => (
              <motion.button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Vai all'evento ${index + 1}`}
                onClick={() => scrollTo(index)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all duration-200',
                  index === selectedIndex
                    ? 'bg-brand-600 w-8'
                    : 'bg-surface-300 dark:bg-surface-600 hover:bg-brand-400',
                )}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}