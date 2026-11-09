import { EventsCarousel } from '@/components/events'
import { EventCard } from '@/components/events'
import { EventsClient } from './EventsClient'
import type { EventItem } from '@/types/cms'

// Simulated CMS data - in production this would come from Keystatic reader
async function getEventsData(): Promise<EventItem[]> {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return [
    // Featured events (prenotazioneObbligatoria = true)
    {
      titolo: 'Venerdì Live - The Jazz Collective',
      data: formatDate(nextWeek),
      ora: '21:00',
      descrizione: 'Una serata all\'insegna del jazz contemporaneo con The Jazz Collective, trio emergente della scena milanese. Standard rivisitati e composizioni originali in un\'atmosfera intima e accogliente.',
      tipo: 'live',
      immagine: '/images/eventi/jazz-collective.jpg',
      prenotazioneObbligatoria: true,
      linkPrenotazione: '/prenota',
    },
    {
      titolo: 'Sabato DJ Set - Marco Bianchi',
      data: formatDate(new Date(nextWeek.getTime() + 24 * 60 * 60 * 1000)),
      ora: '22:30',
      descrizione: 'Marco Bianchi torna al Barino per un DJ set che spazia dal deep house al techno melodico. Preparatevi a ballare fino a tarda notte con i suoi set ipnotici e coinvolgenti.',
      tipo: 'dj',
      immagine: '/images/eventi/dj-marco.jpg',
      prenotazioneObbligatoria: true,
      linkPrenotazione: '/prenota',
    },
    {
      titolo: 'Degustazione Vini Naturali - Cantina La Rocca',
      data: formatDate(new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000)),
      ora: '19:30',
      descrizione: 'Un viaggio sensoriale tra i vini naturali della Cantina La Rocca. 5 calici in abbinamento a stuzzichini selezionati dal nostro chef. Posti limitati a 20 persone.',
      tipo: 'degustazione',
      immagine: '/images/eventi/degustazione-vini.jpg',
      prenotazioneObbligatoria: true,
      linkPrenotazione: '/prenota',
    },
    // Regular events
    {
      titolo: 'Aperitivo con Live Acustico - Giulia Rossi',
      data: formatDate(tomorrow),
      ora: '19:00',
      descrizione: 'Giulia Rossi, cantautrice pavese, presenta il suo nuovo EP in versione acustica. Ingresso libero con consumazione obbligatoria.',
      tipo: 'live',
      immagine: '/images/eventi/giulia-rossi.jpg',
      prenotazioneObbligatoria: false,
    },
    {
      titolo: 'Quiz Night - Trivia del Giovedì',
      data: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
      ora: '20:30',
      descrizione: 'Torna l\'appuntamento settimanale con il Quiz Night! Forma la tua squadra (max 6 persone) e metti alla prova la tua cultura generale. Premi per i primi 3 classificati.',
      tipo: 'altro',
      immagine: '/images/eventi/quiz-night.jpg',
      prenotazioneObbligatoria: false,
    },
    {
      titolo: 'Domenica Brunch & Jazz',
      data: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
      ora: '11:30',
      descrizione: 'Il nostro brunch della domenica accompagnato dal jazz soft del trio "Blue Notes". Menu speciale brunch a 25€ (bevande escluse).',
      tipo: 'live',
      immagine: '/images/eventi/brunch-jazz.jpg',
      prenotazioneObbligatoria: true,
      linkPrenotazione: '/prenota',
    },
    {
      titolo: 'Degustazione Birre Artigianali - Birrificio Pavese',
      data: formatDate(new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000)),
      ora: '18:00',
      descrizione: 'Scopri le migliori birre artigianali del territorio pavese. 6 birre in degustazione guidata dal mastro birraio. Tagliere di accompagnamento incluso.',
      tipo: 'degustazione',
      immagine: '/images/eventi/degustazione-birre.jpg',
      prenotazioneObbligatoria: true,
      linkPrenotazione: '/prenota',
    },
    {
      titolo: 'Karaoke Night - Venerdì Sera',
      data: formatDate(new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000)),
      ora: '21:00',
      descrizione: 'La serata più divertente del mese! Microfono aperto a tutti, basi musicali di ogni genere. Premi per le migliori performance. Ingresso libero.',
      tipo: 'altro',
      immagine: '/images/eventi/karaoke.jpg',
      prenotazioneObbligatoria: false,
    },
  ]
}

export default async function EventiPage() {
  const events = await getEventsData()

  return (
    <>
      {/* Featured Events Carousel */}
      <EventsCarousel events={events} />

      {/* All Events List - Client Component */}
      <EventsClient events={events} />
    </>
  )
}