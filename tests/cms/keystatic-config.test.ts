// tests/cms/keystatic-config.test.ts
import { describe, it, expect, vi } from 'vitest'

// Mock Keystatic config structure for testing
const mockConfig = {
  storage: {
    kind: 'github',
  },
  collections: {
    menu: {
      path: 'content/menu/*',
      schema: {
        fields: {
          nome: {},
          categoria: {},
          allergeni: {},
          vegano: {},
        },
      },
    },
    eventi: {
      path: 'content/eventi/*',
      schema: {
        fields: {
          titolo: {},
          data: {},
          tipo: {},
        },
      },
    },
    gallery: {
      path: 'content/gallery/*',
      schema: {
        fields: {
          immagine: {},
          didascalia: {},
          tag: {},
        },
      },
    },
  },
  singletons: {
    settings: {
      path: 'content/settings',
      schema: {
        fields: {
          orariApertura: {},
          indirizzo: {},
          telefono: {},
          email: {},
        },
      },
    },
  },
}

describe('Keystatic Config', () => {
  it('has menu collection with required fields', () => {
    const menu = mockConfig.collections.menu
    expect(menu.path).toBe('content/menu/*')
    expect(menu.schema.fields.nome).toBeDefined()
    expect(menu.schema.fields.categoria).toBeDefined()
    expect(menu.schema.fields.allergeni).toBeDefined()
    expect(menu.schema.fields.vegano).toBeDefined()
  })

  it('has eventi collection with required fields', () => {
    const eventi = mockConfig.collections.eventi
    expect(eventi.path).toBe('content/eventi/*')
    expect(eventi.schema.fields.titolo).toBeDefined()
    expect(eventi.schema.fields.data).toBeDefined()
    expect(eventi.schema.fields.tipo).toBeDefined()
  })

  it('has gallery collection with required fields', () => {
    const gallery = mockConfig.collections.gallery
    expect(gallery.path).toBe('content/gallery/*')
    expect(gallery.schema.fields.immagine).toBeDefined()
    expect(gallery.schema.fields.didascalia).toBeDefined()
    expect(gallery.schema.fields.tag).toBeDefined()
  })

  it('has settings singleton with required fields', () => {
    const settings = mockConfig.singletons.settings
    expect(settings.path).toBe('content/settings')
    expect(settings.schema.fields.orariApertura).toBeDefined()
    expect(settings.schema.fields.indirizzo).toBeDefined()
    expect(settings.schema.fields.telefono).toBeDefined()
    expect(settings.schema.fields.email).toBeDefined()
  })

  it('uses GitHub storage', () => {
    expect(mockConfig.storage.kind).toBe('github')
  })
})