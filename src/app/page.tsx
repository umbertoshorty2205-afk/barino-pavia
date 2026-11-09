import { Hero } from '@/components/hero'
import { MenuSection } from '@/components/menu'
import { parseMenuItem, sortMenuItems, getFeaturedDish } from '@/lib/keystatic/menu'
import { parseSettings, getOpeningHours, isOpenNow } from '@/lib/keystatic/settings'
import type { MenuItem } from '@/types/cms'

// Simulated CMS data - in production this would come from Keystatic reader
async function getMenuData(): Promise<MenuItem[]> {
  // This is a placeholder - real implementation would use Keystatic reader
  return [
    {
      nome: 'Cappuccino',
      categoria: 'colazione',
      descrizione: 'Espresso con latte montato, preparato con caffè 100% Arabica.',
      prezzo: 1.5,
      allergeni: ['lattosio'],
      vegano: false,
      immagine: '/images/menu/cappuccino.jpg',
      ordinamento: 1,
      inEvidenza: true,
    },
    {
      nome: 'Cornetto Vuoto',
      categoria: 'colazione',
      descrizione: 'Cornetto artigianale vuoto, fragrante e dorato.',
      prezzo: 1.2,
      allergeni: ['glutine', 'lattosio', 'uova'],
      vegano: false,
      immagine: '/images/menu/cornetto.jpg',
      ordinamento: 2,
      inEvidenza: false,
    },
    {
      nome: 'Tagliere Aperitivo',
      categoria: 'aperitivo',
      descrizione: 'Selezione di salumi e formaggi locali con crostini e confetture.',
      prezzo: 12.0,
      allergeni: ['glutine', 'lattosio'],
      vegano: false,
      immagine: '/images/menu/tagliere.jpg',
      ordinamento: 1,
      inEvidenza: true,
    },
    {
      nome: 'Spritz Classico',
      categoria: 'drink',
      descrizione: 'Prosecco, Aperol, soda e una fetta d\'arancia.',
      prezzo: 5.0,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/spritz.jpg',
      ordinamento: 1,
      inEvidenza: false,
    },
    {
      nome: 'Tiramisù della Casa',
      categoria: 'dolci',
      descrizione: 'Il classico dolce italiano con savoiardi, mascarpone e caffè.',
      prezzo: 5.5,
      allergeni: ['glutine', 'lattosio', 'uova'],
      vegano: false,
      immagine: '/images/menu/tiramisu.jpg',
      ordinamento: 1,
      inEvidenza: false,
    },
    {
      nome: 'Insalata Caprese',
      categoria: 'pranzo',
      descrizione: 'Mozzarella di bufala, pomodori datterini, basilico fresco e olio EVO.',
      prezzo: 9.0,
      allergeni: ['lattosio'],
      vegano: false,
      immagine: '/images/menu/caprese.jpg',
      ordinamento: 1,
      inEvidenza: false,
    },
  ]
}

async function getSettingsData() {
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
    heroVideo: '/images/hero/poster.svg',
    heroVideoMp4: undefined,
    heroVideoWebm: undefined,
  }
}

export default async function HomePage() {
  const [menuItems, settings] = await Promise.all([getMenuData(), getSettingsData()])
  const featuredDish = getFeaturedDish(menuItems)
  const sortedMenu = sortMenuItems(menuItems)

  return (
    <>
      <Hero
        videoPoster={settings.heroVideo}
        videoMp4={settings.heroVideoMp4}
        videoWebm={settings.heroVideoWebm}
      />

      {/* Featured Dish Section */}
      {featuredDish && (
        <section className="py-20 px-4 bg-surface-50 dark:bg-surface-900/50" aria-labelledby="featured-heading">
          <div className="container mx-auto max-w-4xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                {featuredDish.immagine ? (
                  <img
                    src={featuredDish.immagine}
                    alt={featuredDish.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-100">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    ⭐ Piatto del giorno
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-sm font-medium rounded-full">
                  {featuredDish.categoria.charAt(0).toUpperCase() + featuredDish.categoria.slice(1)}
                </span>
                <h2 id="featured-heading" className="text-3xl md:text-4xl font-display font-bold text-surface-900 dark:text-surface-100">
                  {featuredDish.nome}
                </h2>
                <p className="text-lg text-surface-600 dark:text-surface-400">
                  {featuredDish.descrizione}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                    €{featuredDish.prezzo.toFixed(2).replace('.', ',')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {featuredDish.vegano && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        🌱 Vegano
                      </span>
                    )}
                    {featuredDish.allergeni.map((a) => (
                      <span key={a} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-semibold rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                >
                  Vedi tutto il menu
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <MenuSection dishes={sortedMenu} />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-brand-900 text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-display font-bold mb-6">
            Pronto a venirci a trovare?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Prenota il tuo tavolo online in pochi click o vieni a trovarci in Corso Garibaldi.
            Siamo aperti tutti i giorni per offrirti la migliore esperienza.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/prenota"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-white text-brand-700 hover:bg-brand-50 transition-colors"
            >
              Prenota ora
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="/contatti"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Contattaci
            </a>
          </div>
        </div>
      </section>
    </>
  )
}