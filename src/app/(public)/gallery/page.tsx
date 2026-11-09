import { GalleryMasonry } from '@/components/gallery'
import type { GalleryItem as GalleryItemType } from '@/types/cms'

// Simulated CMS data - in production this would come from Keystatic reader
async function getGalleryData(): Promise<GalleryItemType[]> {
  return [
    {
      didascalia: 'Interno Bar - Sala Principale',
      immagine: '/images/gallery/interno-sala.jpg',
      tag: ['interni'],
      ordinamento: 1,
    },
    {
      didascalia: 'Esterno - Dehor su Corso Garibaldi',
      immagine: '/images/gallery/esterno-dehor.jpg',
      tag: ['esterni'],
      ordinamento: 2,
    },
    {
      didascalia: 'Tagliere Aperitivo - Selezione Salumi e Formaggi',
      immagine: '/images/gallery/tagliere-aperitivo.jpg',
      tag: ['piatti', 'aperitivo'],
      ordinamento: 3,
    },
    {
      didascalia: 'Evento Live Music - Venerdì Sera',
      immagine: '/images/gallery/evento-live.jpg',
      tag: ['eventi'],
      ordinamento: 4,
    },
    {
      didascalia: 'Il Nostro Team - Baristi al Lavoro',
      immagine: '/images/gallery/team.jpg',
      tag: ['team'],
      ordinamento: 5,
    },
    {
      didascalia: 'Cocktail Signature - Negroni Barino',
      immagine: '/images/gallery/cocktail-negroni.jpg',
      tag: ['piatti', 'drink'],
      ordinamento: 6,
    },
    {
      didascalia: 'Colazione - Cappuccino e Cornetti',
      immagine: '/images/gallery/colazione.jpg',
      tag: ['piatti', 'colazione'],
      ordinamento: 7,
    },
    {
      didascalia: 'Interno - Dettaglio Bancone',
      immagine: '/images/gallery/interno-bancone.jpg',
      tag: ['interni'],
      ordinamento: 8,
    },
    {
      didascalia: 'Tramonto sul Dehor',
      immagine: '/images/gallery/esterno-tramonto.jpg',
      tag: ['esterni'],
      ordinamento: 9,
    },
    {
      didascalia: 'Tiramisù della Casa',
      immagine: '/images/gallery/tiramisu.jpg',
      tag: ['piatti', 'dolci'],
      ordinamento: 10,
    },
    {
      didascalia: 'Spritz al Tramonto',
      immagine: '/images/gallery/spritz-tramonto.jpg',
      tag: ['piatti', 'drink', 'esterni'],
      ordinamento: 11,
    },
    {
      didascalia: 'Staff durante Evento Degustazione',
      immagine: '/images/gallery/team-degustazione.jpg',
      tag: ['team', 'eventi'],
      ordinamento: 12,
    },
  ]
}

export default async function GalleryPage() {
  const galleryItems = await getGalleryData()

  return (
    <>
      <GalleryMasonry items={galleryItems} />
    </>
  )
}