'use client'

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute -top-10 left-0 z-50 px-4 py-2 bg-brand-600 text-white transition-all duration-200 focus-visible:top-0"
    >
      Vai al contenuto principale
    </a>
  )
}