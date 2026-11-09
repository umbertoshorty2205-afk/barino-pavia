export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="bg-stone-900 text-white px-6 py-12 text-center">
        <h1 className="text-4xl font-bold">Il Barino</h1>
        <p className="mt-2 text-stone-300">Bar · [Città da confermare]</p>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Chi siamo</h2>
          <p>[Descrizione del locale da confermare con il cliente]</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Menu</h2>
          <p>[Menu da inserire]</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Orari</h2>
          <p>[Orari da confermare]</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Contatti</h2>
          <p>[Indirizzo e telefono da confermare]</p>
        </div>
      </section>
    </main>
  );
}