# JetWash24 — Production Deployment Guide

Complete production-ready car detailing booking platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js v4 (Credentials) |
| Payments | Stripe Checkout |
| Email | Resend |
| Storage | Vercel Blob (gallery images) |
| i18n | next-intl (PT / EN) |
| Hosting | Vercel |
| Styling | Tailwind CSS |

---

## Prerequisites

- Node.js 18+
- PostgreSQL database (Neon, Supabase, Railway, or any provider)
- Stripe account
- Resend account
- Vercel account

---

## Step 1 — Clone & Install

```bash
cd jetwash24
npm install
```

---

## Step 2 — Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### Required variables:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/jetwash24?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="<run: openssl rand -base64 32>"
NEXTAUTH_URL="https://jetwash24.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="JetWash24 <noreply@jetwash24.com>"

# Admin notifications
ADMIN_EMAIL="jetwash24detailing@gmail.com"
WHATSAPP_NOTIFY_NUMBER="+351928380478"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# App URL
NEXT_PUBLIC_URL="https://jetwash24.com"

# Optional: WhatsApp automation webhook
WHATSAPP_WEBHOOK_URL=""
WHATSAPP_WEBHOOK_SECRET=""
```

---

## Step 3 — Database Setup

### Push schema to database:
```bash
npm run db:push
```

### Or run migrations (production):
```bash
npm run db:migrate
```

### Seed initial data (services, add-ons, default users):
```bash
npm run db:seed
```

**Default credentials created by seed:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@jetwash24.com | Admin@JetWash24! |
| Worker | worker@jetwash24.com | Worker@JetWash24! |

> **IMPORTANT:** Change both passwords immediately after first login.

---

## Step 4 — Stripe Setup

### 4a. Enable Payment Methods

In your Stripe Dashboard:
1. Go to **Settings → Payment methods**
2. Enable: **Cards**, **MB WAY**
3. Apple Pay and Google Pay are automatic with card payments

### 4b. Configure Stripe Webhook

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://jetwash24.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Copy the **Signing secret** → add to `STRIPE_WEBHOOK_SECRET`

### 4c. Local webhook testing (development)

Install Stripe CLI and run:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Step 5 — Resend Email Setup

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (`jetwash24.com`)
3. Get API key → add to `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` to a verified sender address

---

## Step 6 — Vercel Blob Setup (Gallery images)

1. In Vercel dashboard, go to your project → **Storage**
2. Create a **Blob** store
3. Copy the `BLOB_READ_WRITE_TOKEN` → add to env variables

---

## Step 7 — Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B: GitHub Integration

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy

### Build command (auto-detected):
```
prisma generate && next build
```

### Vercel project settings:

| Setting | Value |
|---|---|
| Framework | Next.js |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Node.js Version | 18.x |

---

## Step 8 — Database Migration (Post-Deploy)

After first deploy, run the seed to create services and users:

```bash
# Via Vercel CLI
vercel env pull .env.local
npm run db:push
npm run db:seed
```

Or connect directly to your database and run the seed script.

---

## Post-Deployment Checklist

- [ ] Change admin password (`admin@jetwash24.com`)
- [ ] Change worker password (`worker@jetwash24.com`)
- [ ] Verify Stripe webhook is receiving events
- [ ] Send a test booking and confirm email delivery
- [ ] Verify WhatsApp notification (if webhook configured)
- [ ] Add real before/after photos in `/admin/gallery`
- [ ] Test booking flow end-to-end (use Stripe test cards)
- [ ] Confirm cancellation policy works (12h limit)
- [ ] Set NEXTAUTH_URL to production domain
- [ ] Enable Stripe live mode (swap test keys for live keys)

---

## Application Routes

### Public

| Route | Description |
|---|---|
| `/` → `/pt` | Homepage (PT, default) |
| `/en` | Homepage (English) |
| `/pt/booking` | Booking wizard |
| `/pt/booking/success` | Payment success |
| `/pt/booking/cancel` | Payment cancelled |

### Protected

| Route | Role | Description |
|---|---|---|
| `/pt/admin` | Admin | Dashboard |
| `/pt/admin/bookings` | Admin | All bookings |
| `/pt/admin/calendar` | Admin | 14-day calendar view |
| `/pt/admin/services` | Admin | Edit prices & durations |
| `/pt/admin/gallery` | Admin | Upload before/after photos |
| `/pt/admin/blocked-slots` | Admin | Block time slots |
| `/pt/worker` | Worker/Admin | Daily schedule |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/availability` | — | Get available time slots |
| POST | `/api/bookings` | — | Create pending booking |
| GET | `/api/bookings` | Auth | List bookings |
| PATCH | `/api/bookings/:id` | Admin | Cancel/complete booking |
| GET | `/api/services` | — | List services |
| PATCH | `/api/services/:id` | Admin | Update service |
| GET | `/api/addons` | — | List add-ons |
| POST | `/api/stripe/create-checkout` | — | Create Stripe session |
| POST | `/api/stripe/webhook` | Stripe | Handle payment events |
| GET | `/api/gallery` | — | Get gallery images |
| POST | `/api/gallery` | Admin | Upload gallery image |
| DELETE | `/api/gallery/:id` | Admin | Remove gallery image |
| GET | `/api/blocked-slots` | Auth | Get blocked slots |
| POST | `/api/blocked-slots` | Admin | Create blocked slot |
| DELETE | `/api/blocked-slots/:id` | Admin | Delete blocked slot |

---

## WhatsApp Automation Setup

The system sends a POST webhook to `WHATSAPP_WEBHOOK_URL` when a booking is confirmed.

**Payload:**
```json
{
  "to": "+351928380478",
  "message": "Nova reserva JetWash24 Detailing\n\n📅 Data: 15/06/2025\n⏰ Hora: 11:30\n🚗 Serviço: Limpeza Interior Completa\n🚙 Carro: BMW X3\n⏱ Duração: 2h\n👤 Cliente: João Silva\n📞 Telefone: +351 912 345 678",
  "bookingData": { ... }
}
```

Compatible services:
- **Make.com** (Webhook trigger → WhatsApp Business module)
- **n8n** (Webhook node → WhatsApp node)
- **Zapier** (Webhook trigger → WhatsApp action)
- Custom server using Twilio, WhatsApp Business API, etc.

---

## Booking Logic

- Working hours: **09:00 – 17:00, every day**
- Buffer between jobs: **20 minutes**
- Time slot increment: **30 minutes**
- Latest start time = `17:00 - service_duration`
- Buffer is added to blocked time (not shown to customer)
- Pending bookings expire after **30 minutes** if payment is not completed
- Customers can cancel up to **12 hours** before appointment (admin can always cancel)

---

## Vehicle Size Pricing

| Size | Surcharge |
|---|---|
| Small Car | +€0 |
| Medium Car | +€10 |
| SUV | +€20 |
| Large Vehicle | +€30 |

---

## Security Notes

- All admin/worker routes are protected server-side (middleware + layout)
- Prices are recalculated server-side before Stripe checkout (prevents tampering)
- Availability is double-checked at booking creation (prevents race conditions)
- Stripe webhooks verify signature before processing
- Passwords hashed with bcrypt (cost factor 12)
- NEXTAUTH_SECRET must be unique and kept secret

---

## Local Development

```bash
# Install dependencies
npm install

# Set up local environment
cp .env.example .env.local
# Fill in DATABASE_URL with your local/test database

# Push schema
npm run db:push

# Seed database
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/pt/admin/login](http://localhost:3000/pt/admin/login)

---

## Support

For issues: jetwash24detailing@gmail.com
WhatsApp: +351 928 380 478
