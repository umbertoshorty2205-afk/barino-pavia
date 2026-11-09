'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NavigationProps {
  variant?: 'header' | 'mobile'
  onClose?: () => void
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Eventi', href: '/eventi' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Prenota', href: '/prenota' },
  { name: 'Contatti', href: '/contatti' },
]

export function Navigation({ variant = 'header', onClose }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (variant === 'mobile') {
    return (
      <motion.nav
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-background border-t border-border"
        role="navigation"
        aria-label="Menu principale"
      >
        <ul className="flex flex-col p-4 space-y-2">
          {navigation.map((item, index) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'block py-3 text-base font-medium transition-colors hover:text-brand-600',
                  pathname === item.href && 'text-brand-600',
                )}
                onClick={onClose}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    )
  }

  return (
    <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navigazione principale">
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
  )
}