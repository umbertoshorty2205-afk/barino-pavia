import { config, collection, singleton, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: process.env.GITHUB_REPO || 'username/barino-pavia',
    branch: 'main',
    token: process.env.GITHUB_TOKEN || '',
  },

  collections: {
    menu: collection({
      label: 'Menu',
      slugField: 'nome',
      path: 'content/menu/*',
      format: { contentField: 'descrizione' },
      schema: {
        nome: fields.slug({ name: { label: 'Nome piatto' } }),
        categoria: fields.select({
          label: 'Categoria',
          options: [
            { label: 'Colazione', value: 'colazione' },
            { label: 'Pranzo', value: 'pranzo' },
            { label: 'Aperitivo', value: 'aperitivo' },
            { label: 'Drink', value: 'drink' },
            { label: 'Dolci', value: 'dolci' },
          ],
          defaultValue: 'colazione',
        }),
        descrizione: fields.markdown({
          label: 'Descrizione',
          options: { image: { directory: 'public/images/menu' } },
        }),
        prezzo: fields.number({
          label: 'Prezzo (€)',
          validation: { min: 0, step: 0.5 },
        }),
        allergeni: fields.array(
          fields.checkbox({
            label: 'Allergeni',
            options: [
              { label: 'Glutine', value: 'glutine' },
              { label: 'Lattosio', value: 'lattosio' },
              { label: 'Frutta a guscio', value: 'frutta_guscio' },
              { label: 'Uova', value: 'uova' },
              { label: 'Soia', value: 'soia' },
            ],
          }),
          { label: 'Allergeni', itemLabel: (item) => item.value },
        ),
        vegano: fields.checkbox({
          label: 'Vegano',
          defaultValue: false,
        }),
        immagine: fields.image({
          label: 'Immagine',
          directory: 'public/images/menu',
          publicPath: '/images/menu/',
        }),
        ordinamento: fields.number({
          label: 'Ordinamento',
          validation: { min: 0, step: 1 },
          defaultValue: 0,
        }),
        inEvidenza: fields.checkbox({
          label: 'Piatto del giorno / In evidenza',
          defaultValue: false,
        }),
      },
    }),

    eventi: collection({
      label: 'Eventi',
      slugField: 'titolo',
      path: 'content/eventi/*',
      format: { contentField: 'descrizione' },
      schema: {
        titolo: fields.slug({ name: { label: 'Titolo evento' } }),
        data: fields.text({
          label: 'Data (DD/MM/YYYY)',
          validation: { pattern: '^\\d{2}/\\d{2}/\\d{4}$' },
        }),
        ora: fields.text({
          label: 'Ora (es. 19:30)',
          validation: { pattern: '^\\d{2}:\\d{2}$' },
        }),
        descrizione: fields.markdown({
          label: 'Descrizione',
          options: { image: { directory: 'public/images/eventi' } },
        }),
        tipo: fields.select({
          label: 'Tipo evento',
          options: [
            { label: 'Live Music', value: 'live' },
            { label: 'DJ Set', value: 'dj' },
            { label: 'Degustazione', value: 'degustazione' },
            { label: 'Altro', value: 'altro' },
          ],
          defaultValue: 'live',
        }),
        immagine: fields.image({
          label: 'Immagine evento',
          directory: 'public/images/eventi',
          publicPath: '/images/eventi/',
        }),
        prenotazioneObbligatoria: fields.checkbox({
          label: 'Prenotazione obbligatoria',
          defaultValue: false,
        }),
        linkPrenotazione: fields.url({
          label: 'Link prenotazione (opzionale)',
          validation: { pattern: '^https?://' },
        }),
      },
    }),

    gallery: collection({
      label: 'Gallery',
      path: 'content/gallery/*',
      schema: {
        didascalia: fields.text({
          label: 'Didascalia',
          validation: { maxLength: 200 },
        }),
        immagine: fields.image({
          label: 'Immagine',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
        }),
        tag: fields.array(
          fields.checkbox({
            label: 'Tag',
            options: [
              { label: 'Interni', value: 'interni' },
              { label: 'Esterni', value: 'esterni' },
              { label: 'Piatti', value: 'piatti' },
              { label: 'Eventi', value: 'eventi' },
              { label: 'Team', value: 'team' },
            ],
          }),
          { label: 'Tag', itemLabel: (item) => item.value },
        ),
        ordinamento: fields.number({
          label: 'Ordinamento',
          validation: { min: 0, step: 1 },
          defaultValue: 0,
        }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Impostazioni sito',
      path: 'content/settings',
      format: { data: 'json' },
      schema: {
        orariApertura: fields.object({
          label: 'Orari apertura',
          fields: {
            lunedi: fields.object({
              label: 'Lunedì',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
            martedi: fields.object({
              label: 'Martedì',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
            mercoledi: fields.object({
              label: 'Mercoledì',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
            giovedi: fields.object({
              label: 'Giovedì',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
            venerdi: fields.object({
              label: 'Venerdì',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
            sabato: fields.object({
              label: 'Sabato',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
            domenica: fields.object({
              label: 'Domenica',
              fields: {
                apre: fields.text({ label: 'Apertura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiude: fields.text({ label: 'Chiusura (HH:MM)', validation: { pattern: '^\\d{2}:\\d{2}$' } }),
                chiuso: fields.checkbox({ label: 'Chiuso tutto il giorno', defaultValue: false }),
              },
            }),
          },
        }),
        indirizzo: fields.text({
          label: 'Indirizzo',
          defaultValue: 'Corso Giuseppe Garibaldi, 18',
        }),
        telefono: fields.text({
          label: 'Telefono',
          validation: { pattern: '^\\+?[0-9\\s-]+$' },
          defaultValue: '+39 0382 123456',
        }),
        email: fields.text({
          label: 'Email',
          validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
          defaultValue: 'info@barino.pavia.it',
        }),
        social: fields.object({
          label: 'Social Media',
          fields: {
            instagram: fields.text({ label: 'Instagram URL', validation: { pattern: '^https?://' } }),
            facebook: fields.text({ label: 'Facebook URL', validation: { pattern: '^https?://' } }),
            tripadvisor: fields.text({ label: 'TripAdvisor URL', validation: { pattern: '^https?://' } }),
          },
        }),
        heroVideo: fields.image({
          label: 'Hero Video Poster (Immagine)',
          directory: 'public/images/hero',
          publicPath: '/images/hero/',
        }),
        heroVideoMp4: fields.url({
          label: 'Hero Video MP4 URL',
          validation: { pattern: '^https?://' },
        }),
        heroVideoWebm: fields.url({
          label: 'Hero Video WebM URL',
          validation: { pattern: '^https?://' },
        }),
      },
    }),
  },

  ui: {
    brand: {
      name: 'Barino Pavia CMS',
      color: '#ed7d1e',
    },
  },
})