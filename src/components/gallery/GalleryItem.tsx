'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { GalleryItem as GalleryItemType } from '@/types/cms'

const TAG_LABELS: Record<string, string> = {
  interni: 'Interni',
  esterni: 'Esterni',
  piatti: 'Piatti',
  eventi: 'Eventi',
  team: 'Team',
}

interface GalleryItemProps {
  item: GalleryItemType
  index: number
  onClick: (index: number) => void
}

export function GalleryItem({ item, index, onClick }: GalleryItemProps) {
  const isFeatured = index < 2 // First 2 items are featured (span 2)

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(index)}
      className={cn(
        'relative group cursor-pointer overflow-hidden rounded-xl',
        'bg-surface-100 dark:bg-surface-800',
        isFeatured ? 'md:col-span-2 md:row-span-2' : '',
      )}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(index)
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.immagine ? (
          <Image
            src={item.immagine}
            alt={item.didascalia}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-all duration-500 ease-out',
              'group-hover:scale-105',
            )}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-100">
            <span className="text-6xl">🖼️</span>
          </div>
        )}

        {/* Overlay with caption */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="w-full text-white">
            <h3 className="text-lg font-semibold mb-1">{item.didascalia}</h3>
            <div className="flex flex-wrap gap-1">
              {item.tag.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm"
                >
                  {TAG_LABELS[tag] || tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Click hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-3 left-3 right-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      >
        <span className="px-3 py-1 bg-white/90 text-surface-900 text-sm font-medium rounded-full shadow-lg">
          Clicca per ingrandire
        </span>
      </motion.div>
    </motion.article>
  )
}