import { MenuSection } from '@/components/menu'
import { parseMenuItem, sortMenuItems } from '@/lib/keystatic/menu'
import type { MenuItem } from '@/types/cms'

// Simulated CMS data - in production this would come from Keystatic reader
async function getMenuData(): Promise<MenuItem[]> {
  return [
    // Colazione
    {
      nome: 'Caffè Espresso',
      categoria: 'colazione',
      descrizione: 'Caffè 100% Arabica, tostatura media, crema persistente.',
      prezzo: 1.0,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/espresso.jpg',
      ordinamento: 1,
      inEvidenza: false,
    },
    {
      nome: 'Cappuccino',
      categoria: 'colazione',
      descrizione: 'Espresso con latte montato, preparato con caffè 100% Arabica.',
      prezzo: 1.5,
      allergeni: ['lattosio'],
      vegano: false,
      immagine: '/images/menu/cappuccino.jpg',
      ordinamento: 2,
      inEvidenza: true,
    },
    {
      nome: 'Latte Macchiato',
      categoria: 'colazione',
      descrizione: 'Latte caldo con una macchia di espresso.',
      prezzo: 1.5,
      allergeni: ['lattosio'],
      vegano: false,
      immagine: '/images/menu/latte-macchiato.jpg',
      ordinamento: 3,
      inEvidenza: false,
    },
    {
      nome: 'Cornetto Vuoto',
      categoria: 'colazione',
      descrizione: 'Cornetto artigianale vuoto, fragrante e dorato.',
      prezzo: 1.2,
      allergeni: ['glutine', 'lattosio', 'uova'],
      vegano: false,
      immagine: '/images/menu/cornetto.jpg',
      ordinamento: 4,
      inEvidenza: false,
    },
    {
      nome: 'Cornetto alla Crema',
      categoria: 'colazione',
      descrizione: 'Cornetto artigianale farcito con crema pasticcera.',
      prezzo: 1.5,
      allergeni: ['glutine', 'lattosio', 'uova'],
      vegano: false,
      immagine: '/images/menu/cornetto-crema.jpg',
      ordinamento: 5,
      inEvidenza: false,
    },
    {
      nome: 'Cornetto Integrale Vegano',
      categoria: 'colazione',
      descrizione: 'Cornetto integrale con marmellata di albicocche, senza ingredienti di origine animale.',
      prezzo: 1.5,
      allergeni: ['glutine'],
      vegano: true,
      immagine: '/images/menu/cornetto-vegano.jpg',
      ordinamento: 6,
      inEvidenza: false,
    },

    // Pranzo
    {
      nome: 'Panino Prosciutto e Formaggio',
      categoria: 'pranzo',
      descrizione: 'Pane artigianale, prosciutto crudo DOP, formaggio fresco, rucola.',
      prezzo: 6.0,
      allergeni: ['glutine', 'lattosio'],
      vegano: false,
      immagine: '/images/menu/panino-prosciutto.jpg',
      ordinamento: 1,
      inEvidenza: false,
    },
    {
      nome: 'Insalata Caprese',
      categoria: 'pranzo',
      descrizione: 'Mozzarella di bufala DOP, pomodori datterini, basilico fresco, olio EVO.',
      prezzo: 9.0,
      allergeni: ['lattosio'],
      vegano: false,
      immagine: '/images/menu/caprese.jpg',
      ordinamento: 2,
      inEvidenza: true,
    },
    {
      nome: 'Club Sandwich',
      categoria: 'pranzo',
      descrizione: 'Pane tostato, pollo arrosto, bacon croccante, lattuga, pomodoro, maionese.',
      prezzo: 8.5,
      allergeni: ['glutine', 'uova'],
      vegano: false,
      immagine: '/images/menu/club-sandwich.jpg',
      ordinamento: 3,
      inEvidenza: false,
    },
    {
      nome: 'Poke Bowl Vegetariano',
      categoria: 'pranzo',
      descrizione: 'Riso basmati, edamame, avocado, carote, cetrioli, semi di sesamo, salsa soia.',
      prezzo: 11.0,
      allergeni: ['soia', 'frutta_guscio'],
      vegano: true,
      immagine: '/images/menu/poke-veggie.jpg',
      ordinamento: 4,
      inEvidenza: false,
    },

    // Aperitivo
    {
      nome: 'Tagliere Aperitivo',
      categoria: 'aperitivo',
      descrizione: 'Selezione di salumi e formaggi locali con crostini, confetture e verdure grigliate.',
      prezzo: 12.0,
      allergeni: ['glutine', 'lattosio'],
      vegano: false,
      immagine: '/images/menu/tagliere.jpg',
      ordinamento: 1,
      inEvidenza: true,
    },
    {
      nome: 'Tagliere Vegetariano',
      categoria: 'aperitivo',
      descrizione: 'Formaggi locali, verdure grigliate, hummus, olive, crostini integrali.',
      prezzo: 10.0,
      allergeni: ['glutine', 'lattosio'],
      vegano: false,
      immagine: '/images/menu/tagliere-veg.jpg',
      ordinamento: 2,
      inEvidenza: false,
    },
    {
      nome: 'Bruschette Miste (4 pz)',
      categoria: 'aperitivo',
      descrizione: 'Pane casereccio tostato con pomodoro e basilico, crema di carciofi, paté di olive.',
      prezzo: 8.0,
      allergeni: ['glutine'],
      vegano: true,
      immagine: '/images/menu/bruschette.jpg',
      ordinamento: 3,
      inEvidenza: false,
    },

    // Drink
    {
      nome: 'Spritz Classico',
      categoria: 'drink',
      descrizione: 'Prosecco DOC, Aperol, soda, fetta d\'arancia.',
      prezzo: 5.0,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/spritz.jpg',
      ordinamento: 1,
      inEvidenza: true,
    },
    {
      nome: 'Spritz Hugo',
      categoria: 'drink',
      descrizione: 'Prosecco DOC, sciroppo di fiori di sambuco, soda, menta fresca, lime.',
      prezzo: 5.5,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/spritz-hugo.jpg',
      ordinamento: 2,
      inEvidenza: false,
    },
    {
      nome: 'Negroni',
      categoria: 'drink',
      descrizione: 'Gin, Vermouth rosso, Campari, scorza d\'arancia.',
      prezzo: 8.0,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/negroni.jpg',
      ordinamento: 3,
      inEvidenza: false,
    },
    {
      nome: 'Gin Tonic Premium',
      categoria: 'drink',
      descrizione: 'Gin premium, tonica artigianale, ginepro, lime.',
      prezzo: 9.0,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/gin-tonic.jpg',
      ordinamento: 4,
      inEvidenza: false,
    },
    {
      nome: 'Mocktail Analcolico',
      categoria: 'drink',
      descrizione: 'Succo di melograno, lime, menta, ginger beer analcolico.',
      prezzo: 4.5,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/mocktail.jpg',
      ordinamento: 5,
      inEvidenza: false,
    },

    // Dolci
    {
      nome: 'Tiramisù della Casa',
      categoria: 'dolci',
      descrizione: 'Il classico dolce italiano con savoiardi, mascarpone, caffè e cacao.',
      prezzo: 5.5,
      allergeni: ['glutine', 'lattosio', 'uova'],
      vegano: false,
      immagine: '/images/menu/tiramisu.jpg',
      ordinamento: 1,
      inEvidenza: true,
    },
    {
      nome: 'Panna Cotta ai Frutti di Bosco',
      categoria: 'dolci',
      descrizione: 'Panna cotta alla vaniglia con coulis di frutti di bosco freschi.',
      prezzo: 5.0,
      allergeni: ['lattosio'],
      vegano: false,
      immagine: '/images/menu/panna-cotta.jpg',
      ordinamento: 2,
      inEvidenza: false,
    },
    {
      nome: 'Torta al Cioccolato Fondente',
      categoria: 'dolci',
      descrizione: 'Torta morbida al cioccolato 70%, servita con gelato alla vaniglia.',
      prezzo: 6.0,
      allergeni: ['glutine', 'lattosio', 'uova'],
      vegano: false,
      immagine: '/images/menu/torta-cioccolato.jpg',
      ordinamento: 3,
      inEvidenza: false,
    },
    {
      nome: 'Sorbetto al Limone',
      categoria: 'dolci',
      descrizione: 'Sorbetto rinfrescante al limone di Sicilia, senza lattosio.',
      prezzo: 4.0,
      allergeni: [],
      vegano: true,
      immagine: '/images/menu/sorbetto-limone.jpg',
      ordinamento: 4,
      inEvidenza: false,
    },
  ]
}

export default async function MenuPage() {
  const menuItems = await getMenuData()
  const sortedMenu = sortMenuItems(menuItems)

  return (
    <>
      <section className="py-16 px-4 bg-surface-50 dark:bg-surface-900/50" aria-labelledby="menu-page-title">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 id="menu-page-title" className="text-4xl md:text-5xl font-display font-bold text-surface-900 dark:text-surface-100 mb-4">
            Il Nostro Menu
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
            Scopri tutte le nostre proposte: dalla colazione all'aperitivo, passando per pranzo, drink e dolci.
            Filtra per allergeni o preferenze alimentari.
          </p>
        </div>
      </section>

      <MenuSection dishes={sortedMenu} />
    </>
  )
}