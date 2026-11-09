import type { GalleryItem } from '@/types/cms'

export function parseGalleryItem(data: unknown): GalleryItem {
  return data as GalleryItem
}

export function filterGalleryByTag(items: GalleryItem[], tag: GalleryItem['tag'][number]): GalleryItem[] {
  return items.filter((item) => item.tag.includes(tag))
}

export function sortGalleryItems(items: GalleryItem[]): GalleryItem[] {
  return [...items].sort((a, b) => a.ordinamento - b.ordinamento)
}