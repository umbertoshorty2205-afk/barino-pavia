import type { Settings } from '@/types/cms'

export function parseSettings(data: unknown): Settings {
  return data as Settings
}

export function getOpeningHours(settings: Settings): Settings['orariApertura'] {
  return settings.orariApertura
}

export function isOpenNow(settings: Settings): boolean {
  const now = new Date()
  const dayNames = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato']
  const today = dayNames[now.getDay()]
  const daySchedule = settings.orariApertura[today as keyof Settings['orariApertura']]

  if (daySchedule.chiuso) return false

  const [openHour, openMin] = daySchedule.apre.split(':').map(Number)
  const [closeHour, closeMin] = daySchedule.chiude.split(':').map(Number)

  const openTime = openHour * 60 + openMin
  const closeTime = closeHour * 60 + closeMin
  const currentTime = now.getHours() * 60 + now.getMinutes()

  // Handle overnight closing (e.g., 23:00 - 01:00)
  if (closeTime < openTime) {
    return currentTime >= openTime || currentTime <= closeTime
  }

  return currentTime >= openTime && currentTime <= closeTime
}