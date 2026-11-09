// tests/lib/seo/schema.test.ts
import { describe, it, expect } from 'vitest'
import { generateBarSchema, generateEventSchema, generateMenuSchema } from '@/lib/seo/schema'

const mockSettings = {
  orariApertura: {
    lunedi: { apre: '07:00', chiude: '23:00', chiuso: false },
    martedi: { apre: '07:00', chiude: '23:00', chiuso: false },
    mercoledi: { apre: '07:00', chiude: '23:00', chiuso: false },
    giovedi: { apre: '07:00', chiude: '23:00', chiuso: false },
    venerdi: { apre: '07:00', chiude: '01:00', chiuso: false },
    sabato: { apre: '08:00', chiude: '01:00', chiuso: false },
    domenica: { apre: '08:00', chiude: '22:00', chiuso: false },
  },
  indirizzo: 'Corso Giuseppe Garibaldi, 18',
  telefono: '+39 0382 123456',
  email: 'info@barino.pavia.it',
  social: {
    instagram: 'https://instagram.com/barino_pavia',
    facebook: 'https://facebook.com/barinopavia',
    tripadvisor: 'https://tripadvisor.it/barino_pavia',
  },
}

const mockEvent = {
  titolo: 'Live Music - The Jazz Collective',
  data: '15/11/2026',
  ora: '21:00',
  descrizione: 'Una serata all\'insegna del jazz contemporaneo.',
  tipo: 'live',
  immagine: '/images/eventi/jazz-collective.jpg',
  prenotazioneObbligatoria: true,
}

const mockMenu = [
  {
    nome: 'Cappuccino',
    categoria: 'colazione',
    descrizione: 'Espresso con latte montato.',
    prezzo: 1.5,
    allergeni: ['lattosio'],
    vegano: false,
    immagine: '/images/menu/cappuccino.jpg',
    ordinamento: 1,
    inEvidenza: true,
  },
]

describe('SEO Schema Generation', () => {
  it('generates valid BarOrPub JSON-LD', () => {
    const schema = generateBarSchema(mockSettings)
    expect(schema['@type']).toBe('BarOrPub')
    expect(schema.name).toBe('Barino')
    expect(schema.address.streetAddress).toBe('Corso Giuseppe Garibaldi, 18')
    expect(schema.geo.latitude).toBe('45.1847')
    expect(schema.hasMenu).toBe('https://barino.pavia.it/menu')
  })

  it('generates valid Event JSON-LD', () => {
    const schema = generateEventSchema(mockEvent)
    expect(schema['@type']).toBe('Event')
    expect(schema.name).toBe('Live Music - The Jazz Collective')
    expect(schema.startDate).toBeDefined()
    expect(schema.location).toBeDefined()
  })

  it('generates valid Menu JSON-LD', () => {
    const schema = generateMenuSchema(mockMenu)
    expect(schema['@type']).toBe('Menu')
    expect(schema.hasMenuSection).toBeDefined()
  })
})