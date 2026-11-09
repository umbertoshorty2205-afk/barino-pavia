import type { Settings, EventItem, MenuItem } from '@/types/cms'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://barino.pavia.it'

interface OpeningHoursSpec {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string
  opens: string
  closes: string
}

function formatOpeningHours(settings: Settings): OpeningHoursSpec[] {
  const dayMap: Record<string, string> = {
    lunedi: 'Monday',
    martedi: 'Tuesday',
    mercoledi: 'Wednesday',
    giovedi: 'Thursday',
    venerdi: 'Friday',
    sabato: 'Saturday',
    domenica: 'Sunday',
  }

  return Object.entries(settings.orariApertura).map(([day, hours]) => {
    if (hours.chiuso) {
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[day],
        opens: '00:00',
        closes: '00:00',
        validFrom: '2024-01-01',
        validThrough: '2025-12-31',
      } as any
    }
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[day],
      opens: hours.apre,
      closes: hours.chiude,
    }
  })
}

export function generateBarSchema(settings: Settings) {
  const openingHours = formatOpeningHours(settings)

  return {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: 'Barino',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.indirizzo,
      addressLocality: 'Pavia',
      addressRegion: 'PV',
      postalCode: '27100',
      addressCountry: 'IT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '45.1847',
      longitude: '9.1582',
    },
    telephone: settings.telefono,
    email: settings.email,
    url: SITE_URL,
    openingHoursSpecification: openingHours,
    priceRange: '€€',
    servesCuisine: 'Italian',
    hasMenu: `${SITE_URL}/menu`,
    image: `${SITE_URL}/images/og-image.jpg`,
    sameAs: [
      settings.social.instagram,
      settings.social.facebook,
      settings.social.tripadvisor,
    ].filter(Boolean),
  }
}

export function generateEventSchema(event: EventItem) {
  const [day, month, year] = event.data.split('/')
  const startDate = `${year}-${month}-${day}T${event.ora}:00`
  const endDate = `${year}-${month}-${day}T23:00:00`

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.titolo,
    description: event.descrizione,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Barino',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Corso Giuseppe Garibaldi, 18',
        addressLocality: 'Pavia',
        addressRegion: 'PV',
        postalCode: '27100',
        addressCountry: 'IT',
      },
    },
    image: `${SITE_URL}${event.immagine}`,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/prenota?date=${year}-${month}-${day}`,
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    organizer: {
      '@type': 'Organization',
      name: 'Barino',
      url: SITE_URL,
    },
  }
}

export function generateMenuSchema(menuItems: MenuItem[]) {
  const sections = menuItems.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = []
    }
    acc[item.categoria].push({
      '@type': 'MenuItem',
      name: item.nome,
      description: item.descrizione,
      offers: {
        '@type': 'Offer',
        price: item.prezzo.toFixed(2).replace('.', ','),
        priceCurrency: 'EUR',
      },
      suitableForDiet: item.vegano ? 'https://schema.org/VeganDiet' : undefined,
    })
    return acc
  }, {} as Record<string, any>)

  const hasMenuSection = Object.entries(sections).map(([category, items]) => ({
    '@type': 'MenuSection',
    name: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Sezione ${category}`,
    hasMenuItem: items,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Menu Barino',
    description: 'Il menu completo del Barino Pavia',
    hasMenuSection,
  }
}