# Guida Keystatic CMS - Barino Pavia

> **Per il barista: come gestire il sito in autonomia**
> *Versione semplificata - senza termini tecnici*

---

## 🎯 Cos'è Keystatic?

È il **pannello di controllo** del tuo sito web. Ti permette di:
- ✅ Aggiungere/modificare piatti del menu
- ✅ Creare/pubblicare eventi
- ✅ Caricare foto nella gallery
- ✅ Modificare orari, contatti, info del locale

**Non serve sapere programmare!** È come usare Word o Facebook.

---

## 🔐 Come Accedere

1. Vai su: **https://barino.pavia.it/keystatic**
2. Clicca **"Login with GitHub"**
3. Autorizza l'accesso (solo la prima volta)
4. Sei dentro! 🎉

> **Nota:** Serve un account GitHub. Se non ce l'hai, creane uno gratis su github.com

---

## 📋 Cosa Puoi Fare - Panoramica

| Sezione | Cosa fa | Quanto spesso |
|---------|---------|---------------|
| **Menu** | Aggiungi/rimuovi piatti, cambia prezzi, allergeni | Settimanale |
| **Eventi** | Crea serate live, DJ set, degustazioni | Quando serve |
| **Gallery** | Carica foto del locale, piatti, eventi | Mensile |
| **Impostazioni** | Orari, indirizzo, telefono, social | Raramente |

---

## 🍽️ GESTIONE MENU

### Aggiungere un Piatto Nuovo

1. Clicca **Menu** → **New Entry**
2. Compila i campi:

| Campo | Cosa scrivere | Obbligatorio |
|-------|---------------|--------------|
| **Nome** | Es. "Cappuccino", "Tagliere Misto" | ✅ Sì |
| **Categoria** | Scegli: Colazione / Pranzo / Aperitivo / Drink / Dolci | ✅ Sì |
| **Descrizione** | Breve descrizione (es. "Espresso con latte montato") | ✅ Sì |
| **Prezzo (€)** | Es. 1.50, 12.00 (usa il punto, non la virgola) | ✅ Sì |
| **Allergeni** | Spunta: Glutine, Lattosio, Frutta a guscio, Uova, Soia | No |
| **Vegano** | Spunta se il piatto è vegano | No |
| **Immagine** | Carica foto del piatto (max 2MB, JPG/PNG) | No |
| **Ordinamento** | Numero per ordinare (1 = primo, 2 = secondo...) | No |
| **In evidenza** | Spunta se è il "Piatto del giorno" | No |

3. Clicca **Save** → poi **Commit** (in alto a destra)

### Modificare un Piatto Esistente

1. Clicca **Menu** → cerca il piatto nella lista
2. Clicca sul nome → modifica i campi
3. **Save** → **Commit**

### Eliminare un Piatto

1. Clicca **Menu** → cerca il piatto
2. Clicca i **3 puntini** (⋮) → **Delete**
3. Conferma → **Commit**

### Riordinare i Piatti

1. Cambia il numero in **Ordinamento** (1, 2, 3...)
2. Piatti con stesso numero: ordinamento alfabetico
3. **Save** → **Commit**

### Piatto del Giorno ("In Evidenza")

- Spunta **In evidenza** su un solo piatto per categoria
- Appare in cima alla categoria con stella ⭐
- Solo uno per categoria alla volta!

---

## 🎪 GESTIONE EVENTI

### Creare un Nuovo Evento

1. Clicca **Eventi** → **New Entry**
2. Compila:

| Campo | Cosa scrivere | Obbligatorio |
|-------|---------------|--------------|
| **Titolo** | Es. "Venerdì Live - The Jazz Collective" | ✅ Sì |
| **Data** | Formato: GG/MM/AAAA (es. 15/11/2026) | ✅ Sì |
| **Ora** | Formato: HH:MM (es. 21:00) | ✅ Sì |
| **Descrizione** | Testo libero, anche lungo | ✅ Sì |
| **Tipo** | Scegli: Live Music / DJ Set / Degustazione / Altro | ✅ Sì |
| **Immagine** | Locandina o foto rappresentativa | No |
| **Prenotazione obbligatoria** | Spunta se serve prenotare | No |
| **Link prenotazione** | Link diretto se diverso dal sito | No |

3. **Save** → **Commit**

### Tipi di Evento

| Tipo | Icona | Quando usare |
|------|-------|--------------|
| **Live Music** | 🎵 | Concerti, band, cantanti |
| **DJ Set** | 🎧 | Serate con DJ |
| **Degustazione** | 🍷 | Vini, birre, cibo |
| **Altro** | 📅 | Quiz night, karaoke, brunch... |

### Prenotazione Obbligatoria

- Spunta **"Prenotazione obbligatoria"** se i posti sono limitati
- Il sito mostrerà badge "🎟️ Prenotazione obbligatoria"
- Link "Prenota ora" rimanda alla prenotazione con data pre-selezionata

---

## 🖼️ GALLERY

### Caricare Foto

1. Clicca **Gallery** → **New Entry**
2. Compila:

| Campo | Cosa fare |
|-------|-----------|
| **Didascalia** | Breve descrizione (es. "Interno sala principale") |
| **Immagine** | Carica foto (JPG/PNG, max 5MB) |
| **Tag** | Spunta: Interni / Esterni / Piatti / Eventi / Team |
| **Ordinamento** | Numero per ordine visualizzazione |

3. **Save** → **Commit**

### Tag Consigliati

| Tag | Quando usare |
|-----|--------------|
| **Interni** | Sale, bancone, dettagli arredo |
| **Esterni** | Dehor, vetrine, ingresso |
| **Piatti** | Foto cibo, drink, presentazioni |
| **Eventi** | Foto serate, pubblico, artisti |
| **Team** | Baristi, cuochi, staff |

### Ordine Foto

- Numero basso = prima in gallery
- Foto "In evidenza" (ordinamento 1, 2) → più grandi
- Altre → griglia standard

---

## ⚙️ IMPOSTAZIONI (Raramente)

### Orari di Apertura

1. Vai su **Settings** (in basso a sinistra)
2. Modifica orari per ogni giorno:

```
Lunedì:    07:00 - 23:00
Martedì:   07:00 - 23:00
Mercoledì: 07:00 - 23:00
Giovedì:   07:00 - 23:00
Venerdì:   07:00 - 01:00
Sabato:    08:00 - 01:00
Domenica:  08:00 - 22:00
```

- Spunta "Chiuso" se il giorno non apri
- Formato: HH:MM (24h)

### Contatti

```
Indirizzo: Corso Giuseppe Garibaldi, 18, 27100 Pavia PV
Telefono: +39 0382 123456
Email: info@barino.pavia.it
```

### Social Media

Incolla i link completi:
- Instagram: `https://instagram.com/barino_pavia`
- Facebook: `https://facebook.com/barinopavia`
- TripAdvisor: `https://tripadvisor.it/barino_pavia`

### Video Hero (Homepage)

- **Poster:** Immagine di anteprima (mostrata prima del play)
- **Video MP4:** Link al file .mp4 (hostato esternamente)
- **Video WebM:** Link al file .webm (opzionale, meglio per browser)

---

## 💾 COME SALVARE LE MODIFICHE

**IMPORTANTISSIMO:** Dopo ogni modifica:

1. Clicca **Save** (in basso a destra nel form)
2. In alto a destra appare **Commit** → clicca!
3. Scrivi un messaggio breve: es. "Aggiunto nuovo dolce", "Cambiato orario venerdì"
3. Clicca **Commit**

> **Senza Commit le modifiche NON vanno online!**

---

## 📸 CONSIGLI FOTO

| Tipo | Dimensioni | Formato | Note |
|------|------------|---------|------|
| Piatti | 800x600 px | JPG/PNG | Bene illuminate, sfondo pulito |
| Eventi | 1200x630 px | JPG/PNG | Stile locandina |
| Gallery | 1200x800 px | JPG/PNG | Mix orizzontali/verticali |
| Hero Video Poster | 1920x1080 | JPG | Anteprima video |
| Hero Video MP4 | 1920x1080 | MP4 | < 50MB, H.264 |
| Hero Video WebM | 1920x1080 | WebM | Opzionale, meglio compressione |

**Strumenti gratuiti per ridimensionare:**
- 🌐 [squoosh.app](https://squoosh.app) (online, Google)
- 🌐 [tinyjpg.com](https://tinyjpg.com) (comprime JPG/PNG)
- 📱 Foto app telefono → Modifica → Ritaglia/Ridimensiona

---

## ✅ CHECKLIST PRIMA DI PUBBLICARE

- [ ] Testo corretto (niente errori)
- [ ] Prezzi con punto (1.50 non 1,50)
- [ ] Foto caricate e visibili
- [ ] **Save** cliccato
- [ ] **Commit** cliccato con messaggio chiaro
- [ ] Verificato sul sito (aspetta 1-2 min per aggiornamento)

---

## 🆘 PROBLEMI COMUNI

| Problema | Soluzione |
|----------|-----------|
| "Non vedo le modifiche" | Aspetta 1-2 min, ricarica pagina (Ctrl+F5) |
| "Errore salvataggio" | Controlla campi obbligatori, riprova |
| "Foto non carica" | Deve essere JPG/PNG, max 5MB |
| "Non vedo Commit" | Devi essere loggato su GitHub |
| "Orari non aggiornati" | Controlla formato HH:MM, fai Commit |

---

## 📞 CONTATTI SUPPORTO

| Problema | Contatto |
|----------|----------|
| Sito non funziona | Sviluppatore: [email/telefono] |
| Email non arrivano | Controlla spam, poi sviluppatore |
| CMS non apre | Prova browser diverso, pulisci cache |
| Foto non caricano | Riduci dimensioni, riprova |

---

## 📹 VIDEO TUTORIAL

> **Guarda il video da 10 minuti:** [Link Loom/YouTube qui]

Il video mostra:
1. Login Keystatic
2. Aggiungere piatto al menu
3. Creare evento
4. Caricare foto gallery
5. Cambiare orari
6. Salvare e Commit

---

## 📝 NOTE PERSONALI

> *Scrivi qui i tuoi appunti...*

```
__________________________________________________________
__________________________________________________________
__________________________________________________________
__________________________________________________________
```

---

*Guida aggiornata: Novembre 2026*
*Per Barino Pavia - Corso Giuseppe Garibaldi 18, Pavia*