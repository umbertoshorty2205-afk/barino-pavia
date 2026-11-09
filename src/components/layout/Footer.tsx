import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/barino_pavia',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/barinopavia',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'TripAdvisor',
    href: 'https://tripadvisor.it/barino_pavia',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

const openingHours = [
  { day: 'Lunedì', hours: '07:00 - 23:00' },
  { day: 'Martedì', hours: '07:00 - 23:00' },
  { day: 'Mercoledì', hours: '07:00 - 23:00' },
  { day: 'Giovedì', hours: '07:00 - 23:00' },
  { day: 'Venerdì', hours: '07:00 - 01:00' },
  { day: 'Sabato', hours: '08:00 - 01:00' },
  { day: 'Domenica', hours: '08:00 - 22:00' },
]

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'BarOrPub',
  name: 'Barino',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Corso Giuseppe Garibaldi, 18',
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
  telephone: '+39-0382-123456',
  email: 'info@barino.pavia.it',
  url: 'https://barino.pavia.it',
  openingHoursSpecification: openingHours.map((item) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: item.day,
    opens: item.hours.split(' - ')[0],
    closes: item.hours.split(' - ')[1],
  })),
  priceRange: '€€',
  servesCuisine: 'Italian',
  hasMenu: 'https://barino.pavia.it/menu',
  image: 'https://barino.pavia.it/images/og-image.jpg',
  sameAs: [
    'https://instagram.com/barino_pavia',
    'https://facebook.com/barinopavia',
    'https://tripadvisor.it/barino_pavia',
  ],
}

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-surface-950 text-surface-50 pt-16 pb-8">
      <script
        type="application/ld+json"
        data-testid="schema-org"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-brand-400">Barino</h3>
            <p className="text-surface-400 text-sm leading-relaxed">
              Il tuo bar di fiducia a Pavia. Colazione, pranzo veloce, aperitivo con taglieri, cocktail e eventi live.
            </p>
            <address className="not-italic text-sm text-surface-400 space-y-1">
              <p>Corso Giuseppe Garibaldi, 18</p>
              <p>27100 Pavia (PV), Italia</p>
              <p>
                <a href="tel:+390382123456" className="hover:text-brand-400 transition-colors">
                  +39 0382 123456
                </a>
              </p>
              <p>
                <a href="mailto:info@barino.pavia.it" className="hover:text-brand-400 transition-colors">
                  info@barino.pavia.it
                </a>
              </p>
            </address>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-semibold text-surface-100">Orari di apertura</h4>
            <dl className="space-y-2 text-sm">
              {openingHours.map((item) => (
                <div key={item.day} className="flex justify-between">
                  <dt className="text-surface-400">{item.day}</dt>
                  <dd className="text-surface-100 font-medium">{item.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-surface-100">Seguici</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full bg-surface-800',
                    'text-surface-400 hover:text-brand-400 hover:bg-surface-700',
                    'transition-all duration-300 focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-surface-100">Newsletter</h4>
            <p className="text-sm text-surface-400">
              Ricevi novità, eventi e offerte speciali direttamente nella tua casella di posta.
            </p>
            <form className="flex flex-col space-y-2" action="/api/newsletter" method="POST">
              <label htmlFor="newsletter-email" className="sr-only">
                Indirizzo email
              </label>
              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="La tua email"
                required
                className={cn(
                  'w-full px-4 py-2 rounded-md bg-surface-800 border border-surface-700',
                  'text-surface-100 placeholder-surface-500',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
                )}
              />
              <button
                type="submit"
                className={cn(
                  'w-full px-4 py-2 rounded-md bg-brand-600 text-white font-medium',
                  'hover:bg-brand-700 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
                )}
              >
                Iscriviti
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} Barino Pavia. Tutti i diritti riservati.
          </p>
          <nav className="flex space-x-6 text-sm" aria-label="Link legali">
            <a
              href="/privacy"
              className="text-surface-500 hover:text-brand-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/cookie"
              className="text-surface-500 hover:text-brand-400 transition-colors"
            >
              Cookie Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}