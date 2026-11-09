'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { menuIconVariants, closeIconVariants, navLinkVariants } from '@/lib/animations'

const menuIconVariantsLocal = {
  hidden: { opacity: 0, rotate: -90, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
}

const closeIconVariantsLocal = {
  hidden: { opacity: 0, rotate: 90, scale: 0.8 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
  transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = scrollYProgress.on?.('change', (value) => {
      setScrolled(value > 0.05)
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [scrollYProgress])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Eventi', href: '/eventi' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Prenota', href: '/prenota' },
    { name: 'Contatti', href: '/contatti' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.span
            className="text-xl font-bold text-brand-600"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Barino
          </motion.span>
          <span className="text-sm text-muted-foreground hidden sm:inline">Pavia</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-brand-600',
                pathname === item.href && 'text-brand-600',
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Link
          href="/prenota"
          className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium',
                'transition-colors focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                'bg-brand-600 text-white hover:bg-brand-700',
              )}
        >
          Prenota
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          role="button"
          aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
          className={cn(
            'relative flex md:hidden items-center justify-center w-10 h-10 rounded-full',
            'hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-500',
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <AnimatePresence mode="wait">
            <motion.span
              className="absolute w-6 h-6"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuOpen ? closeIconVariantsLocal : menuIconVariantsLocal}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-background border-t border-border"
          >
            <nav className="flex flex-col p-4 space-y-2" role="navigation" aria-label="Menu principale">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'py-2 text-base font-medium transition-colors hover:text-brand-600',
                    pathname === item.href && 'text-brand-600',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}