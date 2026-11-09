// tests/components/layout/Header.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/layout/Header'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
    nav: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <nav {...props}>{children}</nav>
    ),
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a {...props}>{children}</a>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useScroll: () => ({
    scrollY: { current: 0 },
    scrollYProgress: {
      on: vi.fn(),
      current: 0,
    },
  }),
  useTransform: () => 0,
}))

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('Barino')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /menu/i })).toBeInTheDocument()
    // CTA button is a button-like link, use getAllByRole and check
    const prenotaLinks = screen.getAllByRole('link', { name: /prenota/i })
    expect(prenotaLinks.length).toBeGreaterThanOrEqual(1)
  })

  it('mobile menu opens on hamburger click', async () => {
    render(<Header />)
    const buttons = screen.getAllByRole('button', { name: /apri menu/i })
    fireEvent.click(buttons[0])
    const navs = screen.getAllByRole('navigation', { name: /menu principale/i })
    expect(navs.length).toBeGreaterThanOrEqual(1)
    expect(navs[0]).toBeVisible()
  })
})