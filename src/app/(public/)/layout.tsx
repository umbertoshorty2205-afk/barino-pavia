'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SkipLink } from '@/components/ui/skip-link'
import { Providers } from '@/components/Providers'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </Providers>
  )
}