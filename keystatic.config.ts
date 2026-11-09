import { config, collection, singleton, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'local',
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
        descrizione: fields.markdoc({
          label: 'Descrizione',
          options: { image: { directory: 'public/images/menu' } },
        }),
        prezzo: fields.number({
          label: 'Prezzo (€)',
          validation: { isRequired: true, min: 0, max: 100 },
          step: 0.5,
        }),
        allergeni: fields.array(
          fields.select({
            label: 'Allergeni',
            options: [
              { label: 'Glutine', value: 'glutine' },
              { label: 'Lattosio', value: 'lattosio' },
              { label: 'Frutta a guscio', value: 'frutta_guscio' },
              { label: 'Uova', value: 'uova' },
              { label: 'Soia', value: 'soia' },
            ],
            defaultValue: 'glutine',
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
          validation: { isRequired: true, min: 0, max: 1000 },
          step: 1,
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
          validation: { isRequired: true },
        }),
        ora: fields.text({
          label: 'Ora (es. 19:30)',
          validation: { isRequired: true },
        }),
        descrizione: fields.markdoc({
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
        }),
      },
    }),

    gallery: collection({
      label: 'Gallery',
      path: 'content/gallery/*',
      slugField: 'didascalia',
      schema: {
        didascalia: fields.slug({ name: { label: 'Didascalia' } }),
        immagine: fields.image({
          label: 'Immagine',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
        }),
        tag: fields.array(
          fields.select({
            label: 'Tag',
            options: [
              { label: 'Interni', value: 'interni' },
              { label: 'Esterni', value: 'esterni' },
              { label: 'Piatti', value: 'piatti' },
              { label: 'Eventi', value: 'eventi' },
              { label: 'Team', value: 'team' },
            ],
            defaultValue: 'interni',
          }),
          { label: 'Tag', itemLabel: (item) => item.value },
        ),
        ordinamento: fields.number({
          label: 'Ordinamento',
          validation: { isRequired: true, min: 0, max: 1000 },
          step: 1,
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
        orariApertura: fields.text({
          label: 'Orari apertura (JSON)',
          defaultValue: JSON.stringify({
            lunedi: { apre: '07:00', chiude: '23:00', chiuso: false },
            martedi: { apre: '07:00', chiude: '23:00', chiuso: false },
            mercoledi: { apre: '07:00', chiude: '23:00', chiuso: false },
            giovedi: { apre: '07:00', chiude: '23:00', chiuso: false },
            venerdi: { apre: '07:00', chiude: '01:00', chiuso: false },
            sabato: { apre: '08:00', chiude: '01:00', chiuso: false },
            domenica: { apre: '08:00', chiude: '22:00', chiuso: false },
          }, null, 2),
        }),
        indirizzo: fields.text({
          label: 'Indirizzo',
          defaultValue: 'Corso Giuseppe Garibaldi, 18',
        }),
        telefono: fields.text({
          label: 'Telefono',
          defaultValue: '+39 0382 123456',
        }),
        email: fields.text({
          label: 'Email',
          defaultValue: 'info@barino.pavia.it',
        }),
        social: fields.text({
          label: 'Social Media (JSON)',
          defaultValue: JSON.stringify({
            instagram: 'https://instagram.com/barino_pavia',
            facebook: 'https://facebook.com/barinopavia',
            tripadvisor: 'https://tripadvisor.it/barino_pavia',
          }, null, 2),
        }),
        heroVideo: fields.image({
          label: 'Hero Video Poster (Immagine)',
          directory: 'public/images/hero',
          publicPath: '/images/hero/',
        }),
        heroVideoMp4: fields.url({
          label: 'Hero Video MP4 URL',
        }),
        heroVideoWebm: fields.url({
          label: 'Hero Video WebM URL',
        }),
      },
    }),
  },

  ui: {
    brand: {
      name: 'Barino Pavia CMS',
    },
  },
})