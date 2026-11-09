import type { Metadata, Viewport } from 'next'
import { Inter, Outfit, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  fallback: ['system-ui', 'sans-serif'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['monospace'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://barino.pavia.it'),
  title: {
    default: 'Barino Pavia | Caffè, Aperitivi & Eventi in Corso Garibaldi',
    template: '%s | Barino Pavia',
  },
  description: 'Il tuo bar di fiducia a Pavia. Colazione, pranzo veloce, aperitivo con taglieri, cocktail e eventi live. Prenota il tuo tavolo online.',
  keywords: ['bar', 'pavia', 'caffè', 'aperitivo', 'colazione', 'cocktail', 'eventi', 'prenotazione'],
  authors: [{ name: 'Barino Pavia' }],
  creator: 'Barino Pavia',
  publisher: 'Barino Pavia',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://barino.pavia.it',
    siteName: 'Barino Pavia',
    title: 'Barino Pavia | Caffè, Aperitivi & Eventi in Corso Garibaldi',
    description: 'Il tuo bar di fiducia a Pavia. Colazione, pranzo veloce, aperitivo con taglieri, cocktail e eventi live. Prenota il tuo tavolo online.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Barino Pavia - Interno',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barino Pavia | Caffè, Aperitivi & Eventi',
    description: 'Il tuo bar di fiducia a Pavia. Colazione, pranzo veloce, aperitivo con taglieri, cocktail e eventi live.',
    images: ['/images/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" suppressHydrationWarning className={cn('h-full antialiased', inter.variable, outfit.variable, geistMono.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          Vai al contenuto principale
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}