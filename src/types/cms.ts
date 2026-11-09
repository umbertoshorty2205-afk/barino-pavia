/**
 * CMS Types for Barino Pavia
 * Defines the shape of content managed through Keystatic
 */

export type MenuCategory = 'colazione' | 'pranzo' | 'aperitivo' | 'drink' | 'dolci'
export type Allergene = 'glutine' | 'lattosio' | 'frutta_guscio' | 'uova' | 'soia'
export type EventType = 'live' | 'dj' | 'degustazione' | 'altro'
export type GalleryTag = 'interni' | 'esterni' | 'piatti' | 'eventi' | 'team'

export interface MenuItem {
  nome: string
  categoria: MenuCategory
  descrizione: string
  prezzo: number
  allergeni: Allergene[]
  vegano: boolean
  immagine: string
  ordinamento: number
  inEvidenza: boolean
}

export interface EventItem {
  titolo: string
  data: string // DD/MM/YYYY
  ora: string
  descrizione: string
  tipo: EventType
  immagine: string
  prenotazioneObbligatoria: boolean
  linkPrenotazione?: string
}

export interface GalleryItem {
  didascalia: string
  immagine: string
  tag: GalleryTag[]
  ordinamento: number
}

export interface Settings {
  orariApertura: {
    lunedi: { apre: string; chiude: string; chiuso: boolean }
    martedi: { apre: string; chiude: string; chiuso: boolean }
    mercoledi: { apre: string; chiude: string; chiuso: boolean }
    giovedi: { apre: string; chiude: string; chiuso: boolean }
    venerdi: { apre: string; chiude: string; chiuso: boolean }
    sabato: { apre: string; chiude: string; chiuso: boolean }
    domenica: { apre: string; chiude: string; chiuso: boolean }
  }
  indirizzo: string
  telefono: string
  email: string
  social: {
    instagram?: string
    facebook?: string
    tripadvisor?: string
  }
  heroVideo: string
  heroVideoMp4?: string
  heroVideoWebm?: string
}