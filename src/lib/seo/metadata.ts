import { Metadata } from 'next'
import type { Settings } from '@/types/cms'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'

export function generateMetadata(settings: Settings, page?: string): Metadata {
  const pageTitles: Record<string, string> = {
    home: 'Barino Pavia | Caffè, Aperitivi & Eventi in Corso Garibaldi',
    menu: 'Menu | Barino Pavia',
    eventi: 'Eventi | Barino Pavia',
    gallery: 'Gallery | Barino Pavia',
    prenota: 'Prenota un Tavolo | Barino Pavia',
    contatti: 'Contatti | Barino Pavia',
  }

  const pageDescriptions: Record<string, string> = {
    home: 'Il tuo bar di fiducia a Pavia. Colazione, pranzo veloce, aperitivo con taglieri, cocktail e eventi live. Prenota il tuo tavolo online.',
    menu: 'Scopri il menu del Barino: colazione, pranzo, aperitivo, drink e dolci. Filtra per allergeni e preferenze vegane.',
    eventi: 'Eventi live, DJ set, degustazioni al Barino Pavia. Scopri i prossimi appuntamenti e prenota il tuo posto.',
    gallery: 'Gallery fotografica del Barino Pavia: interni, esterni, piatti, eventi e il nostro team.',
    prenota: 'Prenota il tuo tavolo al Barino Pavia in pochi click. Scegli data, orario e numero ospiti. Conferma via email.',
    contatti: 'Contatta il Barino Pavia: indirizzo, telefono, email, orari e modulo di contatto. Vieni a trovarci in Corso Garibaldi 18.',
  }

  const title = pageTitles[page || 'home'] || pageTitles.home
  const description = pageDescriptions[page || 'home'] || pageDescriptions.home

  return {
    title: {
      default: title,
      template: '%s | Barino Pavia',
    },
    description,
    keywords: ['bar', 'pavia', 'caffè', 'aperitivo', 'colazione', 'cocktail', 'eventi', 'prenotazione'],
    authors: [{ name: 'Barino Pavia' }],
    creator: 'Barino Pavia',
    publisher: 'Barino Pavia',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      url: `${SITE_URL}${page ? `/${page}` : ''}`,
      siteName: 'Barino Pavia',
      title,
      description,
      images: [
        {
          url: `${SITE_URL}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Barino Pavia - ${page || 'Home'}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/og-image.jpg`],
    },
    other: {
      'geo.region': 'IT-PV',
      'geo.placename': 'Pavia',
      'geo.position': '45.1847;9.1582',
      'ICBM': '45.1847, 9.1582',
    },
    verification: {
      google: 'google-site-verification-code',
    },
  }
}

export function generatePageMetadata(settings: Settings, page: string): Metadata {
  return generateMetadata(settings, page)
}