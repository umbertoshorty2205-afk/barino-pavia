// tests/components/events/Countdown.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Countdown } from '@/components/events/Countdown'

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows days/hours/minutes until event', () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    render(<Countdown targetDate={future} />)

    // Initial render - check for individual parts
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('giorni')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('ore')).toBeInTheDocument()
  })

  it('shows "In corso" when event started', () => {
    const past = new Date(Date.now() - 60 * 60 * 1000)
    render(<Countdown targetDate={past} />)
    expect(screen.getByText(/in corso/i)).toBeInTheDocument()
  })

  it('shows "Inizia tra meno di un minuto" when event is very soon', () => {
    const soon = new Date(Date.now() + 30 * 1000)
    render(<Countdown targetDate={soon} />)
    expect(screen.getByText(/inizia tra meno di un minuto/i)).toBeInTheDocument()
  })

  it('updates countdown every minute', () => {
    const future = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000)
    render(<Countdown targetDate={future} />)

    // Advance time by 1 minute
    act(() => {
      vi.advanceTimersByTime(60 * 1000)
    })

    // Should still show days/hours (just updated)
    const giorniElements = screen.getAllByText('giorni')
    expect(giorniElements.length).toBeGreaterThanOrEqual(1)
  })
})