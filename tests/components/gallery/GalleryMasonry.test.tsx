// tests/components/gallery/GalleryMasonry.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GalleryMasonry, GalleryItem } from '@/components/gallery'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props}>{children}</ul>
    ),
    img: ({ ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} />
    ),
    article: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article {...props}>{children}</article>
    ),
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props}>{children}</h3>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockGalleryItems = [
  {
    didascalia: 'Interno Bar',
    immagine: '/images/gallery/interno.jpg',
    tag: ['interni'] as const,
    ordinamento: 1,
  },
  {
    didascalia: 'Esterno Bar',
    immagine: '/images/gallery/esterno.jpg',
    tag: ['esterni'] as const,
    ordinamento: 2,
  },
  {
    didascalia: 'Piatti',
    immagine: '/images/gallery/piatti.jpg',
    tag: ['piatti'] as const,
    ordinamento: 3,
  },
  {
    didascalia: 'Evento Live',
    immagine: '/images/gallery/evento.jpg',
    tag: ['eventi'] as const,
    ordinamento: 4,
  },
  {
    didascalia: 'Team Barino',
    immagine: '/images/gallery/team.jpg',
    tag: ['team'] as const,
    ordinamento: 5,
  },
  {
    didascalia: 'Altro Interno',
    immagine: '/images/gallery/interno2.jpg',
    tag: ['interni'] as const,
    ordinamento: 6,
  },
]

describe('GalleryMasonry', () => {
  it('renders all gallery items', () => {
    render(<GalleryMasonry items={mockGalleryItems} />)
    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBe(6)
    const internoElements = screen.getAllByText('Interno Bar')
    expect(internoElements.length).toBeGreaterThanOrEqual(1)
    const teamElements = screen.getAllByText('Team Barino')
    expect(teamElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders grid with correct CSS classes', () => {
    render(<GalleryMasonry items={mockGalleryItems} />)
    const grids = screen.getAllByRole('list')
    // There are multiple lists (grid + potentially lightbox), find the main one
    const mainGrid = grids.find(g => g.classList.contains('grid-auto-flow-dense'))
    expect(mainGrid).toBeDefined()
    if (mainGrid) {
      expect(mainGrid).toHaveClass('grid')
      expect(mainGrid).toHaveClass('grid-auto-flow-dense')
    }
  })
})

describe('GalleryItem', () => {
  it('renders image with caption', () => {
    const item = mockGalleryItems[0]
    render(<GalleryItem item={item} index={0} onClick={vi.fn()} />)
    const images = screen.getAllByAltText('Interno Bar')
    expect(images.length).toBeGreaterThanOrEqual(1)
    const captions = screen.getAllByText('Interno Bar')
    expect(captions.length).toBeGreaterThanOrEqual(1)
  })

  it('shows tag badges', () => {
    const item = mockGalleryItems[0]
    render(<GalleryItem item={item} index={0} onClick={vi.fn()} />)
    const tags = screen.getAllByText('Interni')
    expect(tags.length).toBeGreaterThanOrEqual(1)
  })

  it('applies featured styling for first items', () => {
    const item = mockGalleryItems[0]
    render(<GalleryItem item={item} index={0} onClick={vi.fn()} />)
    const articles = screen.getAllByRole('listitem')
    // Check the first article (index 0)
    const firstArticle = articles[0]
    expect(firstArticle).toHaveClass('md:col-span-2')
    expect(firstArticle).toHaveClass('md:row-span-2')
  })
})