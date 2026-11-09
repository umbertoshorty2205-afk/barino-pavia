import type { EventItem } from '@/types/cms'

export function parseEventItem(data: unknown): EventItem {
  return data as EventItem
}

export function filterEventsByType(items: EventItem[], type: EventItem['tipo']): EventItem[] {
  return items.filter((item) => item.tipo === type)
}

export function filterUpcomingEvents(items: EventItem[]): EventItem[] {
  const today = new Date()
  return items
    .filter((item) => {
      const [day, month, year] = item.data.split('/').map(Number)
      const eventDate = new Date(year, month - 1, day)
      return eventDate >= today
    })
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.data.split('/').map(Number)
      const [dayB, monthB, yearB] = b.data.split('/').map(Number)
      const dateA = new Date(yearA, monthA - 1, dayA)
      const dateB = new Date(yearB, monthB - 1, dayB)
      return dateA.getTime() - dateB.getTime()
    })
}

export function getNextEvent(items: EventItem[]): EventItem | undefined {
  const upcoming = filterUpcomingEvents(items)
  return upcoming[0]
}