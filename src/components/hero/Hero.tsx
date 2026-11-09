'use client'

import { useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HeroVideo } from './HeroVideo'
import {
  heroTitle,
  heroSubtitle,
  heroCTA,
  heroScrollIndicator,
  staggerContainer,
} from '@/lib/animations'

interface HeroProps {
  title?: string
  subtitle?: string
  ctaPrimaryText?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
  videoPoster?: string
  videoMp4?: string
  videoWebm?: string
}

export function Hero({
  title = 'Barino Pavia',
  subtitle = 'Il tuo bar di fiducia in Corso Garibaldi. Colazione, pranzo, aperitivo ed eventi live.',
  ctaPrimaryText = 'Prenota un tavolo',
  ctaPrimaryHref = '/prenota',
  ctaSecondaryText = 'Scopri il menu',
  ctaSecondaryHref = '/menu',
  videoPoster = '/images/hero/poster.jpg',
  videoMp4,
  videoWebm,
}: HeroProps) {
  const { scrollY } = useScroll()
  const reducedMotion = useReducedMotion()

  const y = useTransform(scrollY, [0, 500], [0, reducedMotion ? 0 : 150])
  const opacity = useTransform(scrollY, [0, 300], [1, reducedMotion ? 1 : 0.3])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-title">
      {/* Background Video */}
      <div className="absolute inset-0 z-0" style={{ transform: reducedMotion ? 'none' : `translate3d(0, ${y}px, 0)` }}>
        <HeroVideo poster={videoPoster} mp4={videoMp4} webm={videoWebm} />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-900/60 via-brand-800/40 to-brand-700/60"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            id="hero-title"
            variants={heroTitle}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroSubtitle}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={heroCTA}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={ctaPrimaryHref}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full',
                'bg-white text-brand-700 hover:bg-brand-50',
                'transition-all duration-300 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700',
                'shadow-lg shadow-brand-700/25',
              )}
            >
              {ctaPrimaryText}
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href={ctaSecondaryHref}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full',
                'bg-white/10 text-white border border-white/30 hover:bg-white/20',
                'backdrop-blur-sm transition-all duration-300 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900',
              )}
            >
              {ctaSecondaryText}
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={heroScrollIndicator}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            role="img"
            aria-label="Scorri per scoprire di più"
          >
            <motion.div
              animate={{ y: reducedMotion ? 0 : [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-white/70"
            >
              <span className="text-xs font-medium tracking-widest uppercase">Scopri di più</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Parallax effect on scroll - only when not reduced motion */}
      {!reducedMotion && (
        <motion.div
          style={{ y, opacity }}
          className="pointer-events-none"
          aria-hidden="true"
        />
      )}
    </section>
  )
}