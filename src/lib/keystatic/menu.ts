import type { MenuItem } from '@/types/cms'

export function parseMenuItem(data: unknown): MenuItem {
  return data as MenuItem
}

export function filterMenuByCategory(items: MenuItem[], category: MenuItem['categoria']): MenuItem[] {
  return items.filter((item) => item.categoria === category)
}

export function filterMenuByAllergeni(items: MenuItem[], allergeni: MenuItem['allergeni']): MenuItem[] {
  return items.filter((item) => !allergeni.some((a) => item.allergeni.includes(a)))
}

export function filterMenuByVegano(items: MenuItem[], vegano: boolean): MenuItem[] {
  return items.filter((item) => item.vegano === vegano)
}

export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => a.ordinamento - b.ordinamento)
}

export function getFeaturedDish(items: MenuItem[]): MenuItem | undefined {
  return items.find((item) => item.inEvidenza)
}