// tests/components/layout/Footer.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/layout/Footer'

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
  useScroll: () => ({ scrollY: { current: 0 } }),
  useTransform: () => 0,
}))

describe('Footer', () => {
  it('renders footer with all sections', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText(/Barino Pavia/i)).toBeInTheDocument()
    expect(screen.getByText(/Corso Giuseppe Garibaldi/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tripadvisor/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iscriviti/i })).toBeInTheDocument()
  })

  it('renders opening hours', () => {
    render(<Footer />)
    const hoursHeadings = screen.getAllByText(/orari di apertura/i)
    expect(hoursHeadings.length).toBeGreaterThanOrEqual(1)
    const lunediElements = screen.getAllByText(/Lunedì/i)
    expect(lunediElements.length).toBeGreaterThanOrEqual(1)
    const orarioElements = screen.getAllByText(/07:00 - 23:00/i)
    expect(orarioElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders schema.org JSON-LD', () => {
    render(<Footer />)
    const scripts = screen.getAllByTestId('schema-org')
    expect(scripts.length).toBeGreaterThanOrEqual(1)
    const schema = JSON.parse(scripts[0].textContent || '{}')
    expect(schema['@type']).toBe('BarOrPub')
    expect(schema.name).toBe('Barino')
  })
})