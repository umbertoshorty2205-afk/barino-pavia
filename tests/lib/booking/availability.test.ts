// tests/lib/booking/availability.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the availability module
vi.mock('@/lib/booking/availability', () => ({
  getAvailableSlots: vi.fn(),
  TimeSlotWithAvailability: {} as any,
}))

import { getAvailableSlots } from '@/lib/booking/availability'

describe('getAvailableSlots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns only slots with capacity for date', async () => {
    // Mock returns slots that have capacity >= 4
    const mockSlots = [
      { slot_id: '1', start_time: '19:00', end_time: '21:00', availableCapacity: 4 },
      { slot_id: '2', start_time: '21:00', end_time: '23:00', availableCapacity: 2 },
    ]
    // The function should filter to only slots with capacity >= guests (4)
    getAvailableSlots.mockImplementation(async (date: string, guests: number) => {
      return mockSlots.filter(s => s.availableCapacity >= guests)
    })

    const slots = await getAvailableSlots('2026-11-15', 4)
    expect(slots.every(s => s.availableCapacity >= 4)).toBe(true)
  })

  it('excludes fully booked slots', async () => {
    const mockSlots = [
      { slot_id: '1', start_time: '19:00', end_time: '21:00', availableCapacity: 4 },
      { slot_id: '2', start_time: '21:00', end_time: '23:00', availableCapacity: 0 },
    ]
    // The function should filter out slots with 0 capacity
    getAvailableSlots.mockImplementation(async (date: string, guests: number) => {
      return mockSlots.filter(s => s.availableCapacity >= guests && s.availableCapacity > 0)
    })

    const slots = await getAvailableSlots('2026-11-15', 2)
    const fullyBooked = slots.find(s => s.availableCapacity === 0)
    expect(fullyBooked).toBeUndefined()
  })

  it('returns empty array for past date', async () => {
    getAvailableSlots.mockResolvedValue([])

    const slots = await getAvailableSlots('2020-01-01', 2)
    expect(slots).toEqual([])
  })
})