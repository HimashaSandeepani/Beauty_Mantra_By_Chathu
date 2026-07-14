# Beauty_Mantra_By_Chathu

A Next.js (App Router) website for Beauty Mantra by Chathu, styled with Bootstrap 5.
Includes a public site (home, services, gallery, reviews) and a password-protected
admin dashboard for managing the gallery, moderating reviews, and editing the
service menu and package pricing.

## Features

- **Home** — hero, highlights, package preview, gallery teaser, review teaser
- **Services** — full service menu (from your service card) + 4/7/10-service packages
- **Gallery** — public grid of photos/videos with filter tabs and a lightbox
- **Reviews** — visitors can submit a star rating + review (goes in as "pending");
  only "approved" reviews show publicly
- **WhatsApp booking** — a floating button and buttons throughout the site open
  WhatsApp with a pre-filled message to +971 52 742 2431
- **Admin dashboard** (`/admin`) —
  - Log in with a password
  - **Reviews tab**: approve, unapprove, or delete any review
  - **Gallery tab**: add photos/videos (file upload or a URL), delete items
  - **Services & Packages tab**: add, edit, and delete menu services and package bundles

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then edit the values below
npm run dev
```

Visit `http://localhost:3000`. Admin login is at `http://localhost:3000/admin`.

### Environment variables (`.env.local`)

| Variable | Purpose | Default |
|---|---|---|
| `ADMIN_PASSWORD` | Password to log into `/admin` | `beautymantra2026` |
| `ADMIN_SESSION_SECRET` | Random secret used to sign the admin session cookie | dev placeholder |

**Change both before putting this online.**

## Editing content

- **Phone number / WhatsApp**: `lib/salonInfo.js` → `WHATSAPP_NUMBER` and `DISPLAY_PHONE`
- **Service menu & packages**: `data/serviceMenu.json` (editable in the admin dashboard)
- **Logo**: `public/logo.png`
- **Colors/fonts**: CSS variables at the top of `app/globals.css`
- **Seed reviews**: `data/reviews.json` (safe to clear once you have real reviews)

## How data is stored

Reviews, gallery items, and the service/package menu are stored in JSON files
(`data/reviews.json`, `data/gallery.json`, `data/serviceMenu.json`), and uploaded gallery files are saved to `public/uploads/`.
This keeps the project dependency-free and easy to run anywhere, but it has one
important limitation:

> **This only works on a server with a persistent, writable filesystem** (e.g. a VPS,
> Render, Railway, a Docker container, or `next start` on your own machine).
> It will **not** work as-is on serverless hosts like Vercel, because their
> filesystem is read-only/ephemeral at runtime — writes would be lost between
> requests. If you deploy to Vercel, swap `lib/db.js` for a real database
> (e.g. Postgres via Vercel Postgres/Supabase, or a KV store) — the rest of the
> app (API routes, admin UI) can stay the same, since they all go through the
> `readData` / `writeData` helpers in `lib/db.js`.

## Admin authentication

Admin sessions use a signed, httpOnly cookie (no third-party auth library).
`middleware`/`proxy.js` blocks `/admin/dashboard` for anyone without a cookie,
and every admin API route double-checks the cookie's signature and 12-hour
expiry server-side.

## Project structure

```
app/
  page.js                Home
  services/page.js       Services & packages
  gallery/page.js        Public gallery
  reviews/page.js        Public reviews + submit form
  admin/page.js           Admin login
  admin/dashboard/page.js Admin dashboard (reviews + gallery tabs)
  api/reviews/route.js         GET approved reviews, POST new review
  api/gallery/route.js         GET public gallery
  api/admin/reviews/route.js   GET/PATCH/DELETE (auth required)
  api/admin/gallery/route.js   GET/POST/DELETE (auth required)
  api/admin/services/route.js  GET/POST/PATCH/DELETE (auth required)
  api/admin/packages/route.js  GET/POST/PATCH/DELETE (auth required)
  api/admin/login|logout       Session cookie management
components/              Navbar, Footer, Gallery grid, Review form, Admin widgets
lib/                     salonInfo.js, db.js (JSON storage), auth.js
data/                    reviews.json, gallery.json, serviceMenu.json
public/uploads/          Uploaded gallery images/videos land here
```

## Build & deploy

```bash
npm run build
npm run start
```

Deploy to any Node host (VPS, Railway, Render, Docker, a cPanel Node app, etc.)
that keeps a persistent filesystem, and set `ADMIN_PASSWORD` /
`ADMIN_SESSION_SECRET` as real environment variables there.
