# Barino Pavia - Handoff Document

## 📋 Project Overview

**Project:** Barino Pavia - Professional Website for a Bar in Pavia
**Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Supabase, Keystatic CMS
**Deploy:** Vercel (Production)

---

## 🔗 Important URLs

| Service | URL | Access |
|---------|-----|--------|
| **Production Site** | `https://barino.pavia.it` | Public |
| **Vercel Dashboard** | `https://vercel.com/dashboard` | Owner |
| **Supabase Dashboard** | `https://supabase.com/dashboard/project/your-project` | Owner |
| **Keystatic CMS** | `https://barino.pavia.it/keystatic` | Owner (via GitHub) |
| **GitHub Repo** | `https://github.com/your-username/barino-pavia` | Owner |

---

## 🔐 Environment Variables (Vercel)

### Required
```bash
# Next.js
NEXT_PUBLIC_SITE_URL=https://barino.pavia.it

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Primary - Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM="Barino Pavia <noreply@barinopavia.it>"

# Email Fallback (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Keystatic (GitHub)
KEYSTATIC_GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
KEYSTATIC_GITHUB_OWNER=your-github-username
KEYSTATIC_GITHUB_REPO=barino-pavia

# Cron Secret (for booking reminders)
CRON_SECRET=your-random-secret-string
```

### Optional
```bash
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

---

## 🗄️ Supabase Database Schema

### Tables
```sql
-- Tables (tavoli)
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  zone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Time Slots (slot orari)
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL,           -- 0=Domenica ... 6=Sabato
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT DEFAULT 90,
  max_bookings_per_slot INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true
);

-- Bookings (prenotazioni)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID REFERENCES tables(id),
  time_slot_id UUID REFERENCES time_slots(id),
  booking_date DATE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30),
  guests_count INT NOT NULL CHECK (guests_count > 0 AND guests_count <= 20),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  confirmation_token UUID DEFAULT gen_random_uuid(),
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(table_id, time_slot_id, booking_date)
);

-- Indexes
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
```

### RLS Policies
```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access" ON bookings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Public insert only" ON bookings FOR INSERT WITH CHECK (true);
```

---

## 📧 Email Configuration

### Primary: Gmail SMTP
- **Host:** smtp.gmail.com
- **Port:** 587
- **User:** your-email@gmail.com
- **Password:** Gmail App Password (NOT your login password)

### Fallback: Resend
- **API Key:** `re_xxxxxxxxxxxxx`
- Automatically used when Gmail hits rate limits (429)

### Email Templates
1. **Booking Confirmation** - Sent immediately after booking
2. **Booking Reminder** - 24h before appointment (Cron: 09:00 daily)
3. **Booking Cancellation** - Sent when booking is cancelled

All emails include `.ics` calendar attachment.

---

## 📝 Keystatic CMS (Content Management)

### Access
- URL: `https://barino.pavia.it/keystatic`
- Authentication: GitHub OAuth (via Keystatic)
- Storage: GitHub repository (commits on save)

### Collections

| Collection | Path | Description |
|------------|------|-------------|
| **Menu** | `content/menu/*` | Piatti e bevande |
| **Eventi** | `content/eventi/*` | Eventi live, DJ set, degustazioni |
| **Gallery** | `content/gallery/*` | Foto del locale |
| **Settings** | `content/settings` | Singleton - Info sito, orari, social |

### Menu Item Fields
| Field | Type | Required |
|-------|------|----------|
| nome | Slug | ✅ |
| categoria | Select (colazione/pranzo/aperitivo/drink/dolci) | ✅ |
| descrizione | Markdown | ✅ |
| prezzo | Number (step 0.5) | ✅ |
| allergeni | Checkbox array | ❌ |
| vegano | Checkbox | ❌ |
| immagine | Image | ❌ |
| ordinamento | Number | ❌ |
| inEvidenza | Checkbox | ❌ |

### Evento Fields
| Field | Type | Required |
|-------|------|----------|
| titolo | Slug | ✅ |
| data | Text (DD/MM/YYYY) | ✅ |
| ora | Text (HH:MM) | ✅ |
| descrizione | Markdown | ✅ |
| tipo | Select (live/dj/degustazione/altro) | ✅ |
| immagine | Image | ❌ |
| prenotazioneObbligatoria | Checkbox | ❌ |
| linkPrenotazione | URL | ❌ |

### Settings Fields
| Field | Type | Required |
|-------|------|----------|
| orariApertura | Object (7 giorni) | ✅ |
| indirizzo | Text | ✅ |
| telefono | Text | ✅ |
| email | Text | ✅ |
| social | Object (instagram, facebook, tripadvisor) | ❌ |
| heroVideo | Image | ❌ |
| heroVideoMp4 | URL | ❌ |
| heroVideoWebm | URL | ❌ |

---

## 📅 Booking System

### User Flow
1. **Calendar** → Select date (green = available, red = full)
2. **Time Slots** → Select time slot (shows capacity)
3. **Form** → Name, email, phone, guests, notes
4. **Confirmation** → Email sent with .ics + confirm/cancel links

### Email Links
- **Confirm:** `/api/bookings/{id}?token={token}&action=confirm`
- **Cancel:** `/api/bookings/{id}?token={token}&action=cancel`

### Admin Actions
- View all bookings in Supabase Dashboard
- Export CSV from Supabase
- Manual confirm/cancel via email links

---

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Deploy (auto on push to main)
4. Custom domain: `barino.pavia.it`

### Cron Jobs
- **Booking Reminders:** Daily 09:00 → `/api/cron/booking-reminders`
- Requires `CRON_SECRET` in Vercel env vars

### Build Commands
```bash
npm ci --legacy-peer-deps
npm run build
```

---

## 🐛 Troubleshooting

### Email Not Sending
1. Check Gmail App Password (not login password)
2. Check Gmail "Less secure apps" or 2FA + App Password
3. Check Resend fallback (RESEND_API_KEY)
4. Check Vercel logs for 429 errors

### CMS Not Updating
1. Check Keystatic GitHub token permissions
2. Check GitHub Actions for commit failures
3. Clear Next.js cache: `rm -rf .next && npm run build`

### Booking Conflicts
- Check Supabase for duplicate bookings
- Verify time_slots and tables configuration
- Check RLS policies

### Build Fails
1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm ci`
3. Check TypeScript errors: `npx tsc --noEmit`

---

## 📞 Support Contacts

| Service | Contact |
|---------|---------|
| **Vercel** | https://vercel.com/support |
| **Supabase** | https://supabase.com/support |
| **Resend** | https://resend.com/docs |
| **Keystatic** | https://keystatic.com/docs |
| **GitHub** | https://github.com/your-username/barino-pavia/issues |

---

## 📝 Notes for Future Development

- **ISR Revalidation:** 60 seconds (configured in next.config.ts)
- **Image Optimization:** AVIF/WebP, responsive sizes
- **Fonts:** Self-hosted (Inter + Display) via next/font
- **Analytics:** Vercel Analytics (optional)
- **Security:** CSP headers, CSP headers via vercel.json

---

*Document generated: 2026-11-09*
*Project: Barino Pavia - Professional Website for a Bar in Pavia*