import { ContactForm } from '@/components/contacts/ContactForm'
import { ContactPageClient } from './ContactClient'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Settings } from '@/types/cms'

// Simulated CMS settings
async function getSettings(): Promise<Settings> {
  return {
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
    heroVideo: '/images/hero/poster.jpg',
  }
}

export async function generateMetadata() {
  const settings = await getSettings()
  return generatePageMetadata(settings, 'contatti')
}

export default async function ContattiPage() {
  const settings = await getSettings()

  return (
    <ContactPageClient settings={settings} />
  )
}