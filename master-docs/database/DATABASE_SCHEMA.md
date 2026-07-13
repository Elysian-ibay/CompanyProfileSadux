# Database Schema - SaduX Company Profile CMS

> Dokumentasi lengkap semua tabel database. Sequelize auto-generate `id`, `createdAt`, `updatedAt` pada setiap tabel.

> **UPDATE (2026-07-13, terakhir):**
> - **Engine:** production = **PostgreSQL (Supabase)**. Lokal opsional MySQL/XAMPP via `DB_DIALECT=mysql`.
> - **10 tabel:** ditambah tabel `Clients` (v3.4.0 — "Pengguna SaduX").
> - **Tema default:** `active_theme` = **`retro`**, `accent_color` = `#ffd800`.
> - **Auth:** semua route mutasi ditegakkan JWT (`backend/middleware/auth.js`).
> - **Kolom tambahan pasca-rilis** — dijalankan via SQL manual di Supabase. Lihat bagian **"Migrasi Manual"** di bawah.

---

## Migrasi Manual (Post-Release)

> Kolom-kolom ini ditambahkan setelah rilis awal. Di lokal cukup `npm run db:migrate`. Di production (Supabase) dijalankan lewat **SQL Editor** (Vercel tidak auto-sync schema). Semua idempotent (`IF NOT EXISTS`).

```sql
-- ── v3.1–v3.3 ─────────────────────────────────────────────────────────────

-- Produk: urutan drag-and-drop + harga bulanan/tahunan
ALTER TABLE "Products"
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "price_monthly" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "price_yearly" VARCHAR(255);

-- Hero badge editable
ALTER TABLE "LandingPageContents"
  ADD COLUMN IF NOT EXISTS "hero_badge_text" VARCHAR(255)
  DEFAULT 'Premier Tech Ecosystem Management';

-- Branding + footer editable
ALTER TABLE "GeneralSettings"
  ADD COLUMN IF NOT EXISTS "site_logo" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "site_favicon" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "footer_description" TEXT,
  ADD COLUMN IF NOT EXISTS "footer_columns" JSONB,
  ADD COLUMN IF NOT EXISTS "social_links" JSONB,
  ADD COLUMN IF NOT EXISTS "footer_powered_by" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "footer_powered_by_url" VARCHAR(255);

-- ── v3.4.0 ─────────────────────────────────────────────────────────────────

-- Tabel baru: Klien / Pengguna SaduX
CREATE TABLE IF NOT EXISTS "Clients" (
  "id"        SERIAL PRIMARY KEY,
  "name"      VARCHAR(255) NOT NULL,
  "logo"      VARCHAR(255),
  "website"   VARCHAR(255),
  "order"     INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Produk: tipe harga & platform
ALTER TABLE "Products"
  ADD COLUMN IF NOT EXISTS "pricing_type" VARCHAR(255) DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS "platform"     JSON         DEFAULT '[]';
```

**Ringkasan kolom/tabel baru:**
- `Products` (v3.1): `order` (INT), `price_monthly` (STR), `price_yearly` (STR)
- `LandingPageContents` (v3.1): `hero_badge_text` (STR)
- `GeneralSettings` (v3.2–3.3): `site_logo`, `site_favicon`, `footer_description`, `footer_columns` (JSON), `social_links` (JSON), `footer_powered_by`, `footer_powered_by_url`
- `Clients` (v3.4, tabel baru): `name`, `logo`, `website`, `order`
- `Products` (v3.4): `pricing_type` (monthly/yearly/one_time/free), `platform` (JSON array: Web/Mobile/Desktop)

> `footer_columns` = `[{ title, items: [{ label, url }] }]` · `social_links` = `[{ platform, url }]` (platform: instagram/twitter/facebook/linkedin/youtube/website).
> `platform` produk = `["Web", "Mobile", "Desktop"]` — subset, bisa kosong.

---

## ERD Overview

```
Users (auth)
Products (ecosystem showcase)          ← pricing_type, platform (v3.4)
LandingPageContents (singleton - semua konten & theme settings)
Features ("Why Choose Us" cards)
Statistics (numbers strip)
Testimonials (social proof)
Faqs (accordion FAQ)
GeneralSettings (singleton - site identity, contacts, branding)
Visitors (analytics tracking)
Clients (pengguna SaduX — logo klien)  ← baru v3.4
```

---

## Table: `Users`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `username` | STRING | NOT NULL, UNIQUE | - | Admin username |
| `password` | STRING | NOT NULL | - | Hashed password (bcryptjs) |
| `role` | STRING | - | `'admin'` | User role |
| `createdAt` | DATETIME | AUTO | - | Sequelize timestamp |
| `updatedAt` | DATETIME | AUTO | - | Sequelize timestamp |

---

## Table: `Products`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `name` | STRING | NOT NULL | - | Nama produk/ecosystem |
| `price` | STRING | NOT NULL | - | Label harga (e.g. "FREE", "Subscription") |
| `price_monthly` | STRING | NULLABLE | - | Harga per-bulan (e.g. "Rp 150.000") |
| `price_yearly` | STRING | NULLABLE | - | Harga per-tahun (e.g. "Rp 1.500.000") |
| `pricing_type` | STRING | - | `'monthly'` | Tipe: `monthly` / `yearly` / `one_time` / `free` |
| `description` | TEXT | NULLABLE | - | Deskripsi produk |
| `image` | STRING | NULLABLE | - | Supabase Storage URL gambar produk |
| `link` | STRING | NULLABLE | - | External URL ke produk |
| `tag` | STRING | NULLABLE | - | Kategori produk (e.g. "Esports & Olahraga") |
| `platform` | JSON | - | `[]` | Platform target: `["Web","Mobile","Desktop"]` (subset) |
| `click_count` | INTEGER | - | `0` | Jumlah klik (tracking) |
| `order` | INTEGER | - | `0` | Urutan tampil (drag-and-drop di admin) |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

---

## Table: `LandingPageContents`

> Singleton table (hanya 1 row). Menyimpan semua konten dan konfigurasi visual.

### Hero Section Fields

| Column | Type | Default | Description |
|---|---|---|---|
| `hero_title` | STRING | `'Sadulur Teknologi Indonesia'` | Judul utama hero |
| `hero_subtitle` | STRING | `'Innovate. Integrate. Inspire.'` | Subtitle gradient text |
| `hero_description` | TEXT | `'Transforming businesses with cutting-edge...'` | Paragraph deskripsi |
| `hero_button_primary_text` | STRING | `'Explore Ecosystem'` | Text tombol utama |
| `hero_button_primary_link` | STRING | `'#ecosystem'` | Link tombol utama |
| `hero_button_secondary_text` | STRING | `'Watch Video'` | Text tombol sekunder |
| `hero_button_secondary_link` | STRING | `'#'` | Link tombol sekunder |

### Feature Section Fields

| Column | Type | Default | Description |
|---|---|---|---|
| `feature_title` | STRING | `'Our Ecosystem'` | Judul section features |

### CTA Section Fields

| Column | Type | Default | Description |
|---|---|---|---|
| `cta_title` | STRING | `'Ready to Transform Your Business?'` | Judul CTA |
| `cta_description` | TEXT | `'Join the SaduX network and experience...'` | Deskripsi CTA |

### Stats Section Fields

| Column | Type | Default | Description |
|---|---|---|---|
| `stats_visible` | BOOLEAN | `true` | Toggle tampil/sembunyikan stats |

### Teaser Section Fields

| Column | Type | Default | Description |
|---|---|---|---|
| `teaser_tag` | STRING | `'Enterprise Solutions'` | Badge tag kecil |
| `teaser_title` | STRING | `'Build Your Digital Future'` | Judul teaser |
| `teaser_description` | TEXT | *(default text)* | Deskripsi teaser |
| `teaser_button_text` | STRING | `'Consult Now'` | Text tombol teaser |
| `teaser_image` | STRING (NULLABLE) | `null` | Path gambar teaser (belum diimplementasi upload) |
| `teaser_features` | JSON | `["Custom Software Development", ...]` | Array of strings - bullet points |

### Visual/Theme Fields

| Column | Type | Default | Description |
|---|---|---|---|
| `background_style` | STRING | `'galaxy'` | ID background animation |
| `active_theme` | STRING | `'modern_tech'` | Nama preset theme aktif |
| `font_family` | STRING | `'Inter'` | Global font family |
| `accent_color` | STRING | `'#06b6d4'` | Warna aksen global (cyan-500) |
| `theme_settings` | JSON | *(lihat bawah)* | Object konfigurasi theme detail |

### `theme_settings` JSON Structure

```json
{
  "font_heading": "Outfit",
  "font_body": "Inter",
  "button_style": "rounded-xl",
  "button_gradient_start": "#3b82f6",
  "button_gradient_end": "#8b5cf6",
  "card_bg_opacity": 0.08,
  "card_border_color": "rgba(255,255,255,0.1)",
  "card_blur": "xl",
  "section_hero_bg": "transparent",
  "section_ecosystem_bg": "rgba(0,0,0,0.2)",
  "section_features_bg": "transparent",
  "section_stats_bg": "linear-gradient(to right, rgba(30,58,138,0.2), rgba(21,94,117,0.2))",
  "sections": {
    "<sectionKey>": {
      "enabled": false,
      "fontFamily": "",
      "titleSize": "",
      "textColor": "",
      "accentColor": "",
      "background": ""
    }
  }
}
```

---

## Table: `Features`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `icon_name` | STRING | NOT NULL | - | Nama icon Lucide (e.g. 'Star', 'Trophy', 'Shield') |
| `title` | STRING | NOT NULL | - | Judul feature card |
| `description` | TEXT | NOT NULL | - | Deskripsi feature |
| `order` | INTEGER | - | `0` | Urutan tampil (ASC) |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

**Icon options yang di-support di frontend:** `Trophy`, `Users`, `ShoppingBag`, `Globe`, `Star`, `Shield`, `Heart`, `Truck`

---

## Table: `Statistics`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `value` | STRING | NOT NULL | - | Angka statistik (e.g. '10k+', '99%') |
| `label` | STRING | NOT NULL | - | Label statistik (e.g. 'Pelanggan Puas') |
| `order` | INTEGER | - | `0` | Urutan tampil (ASC) |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

---

## Table: `Testimonials`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `name` | STRING | NOT NULL | - | Nama reviewer |
| `role` | STRING | - | `'Pelanggan'` | Peran/jabatan reviewer |
| `comment` | TEXT | NOT NULL | - | Isi testimoni |
| `rating` | INTEGER | - | `5` | Rating 1-5 |
| `photo` | STRING | NULLABLE | `null` | Path foto (belum diimplementasi) |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

---

## Table: `Faqs`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `question` | STRING | NOT NULL | - | Pertanyaan FAQ |
| `answer` | TEXT | NOT NULL | - | Jawaban FAQ |
| `order` | INTEGER | - | `0` | Urutan tampil |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

---

## Table: `GeneralSettings`

> Singleton table (hanya 1 row). Site identity & contact info.

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `site_title` | STRING | - | `'SaduX - Company Profile'` | SEO title / document.title |
| `site_name` | STRING | - | `'SaduX Technology'` | Nama perusahaan |
| `contact_phone` | STRING | - | `'6281234567890'` | Nomor telepon |
| `contact_email` | STRING | - | `'hello@sadux.com'` | Email kontak |
| `address` | STRING | - | `'Indonesia'` | Alamat |
| `footer_copyright` | STRING | - | `'(c) 2025 Sadulur Teknologi Indonesia.'` | Text copyright footer |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

---

## Table: `Visitors`

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `ip_address` | STRING | NOT NULL | - | IP address pengunjung |
| `user_agent` | STRING | NULLABLE | - | Browser user agent |
| `createdAt` | DATETIME | AUTO | - | Timestamp kunjungan |
| `updatedAt` | DATETIME | AUTO | - | |

---

## Table: `Clients` _(baru v3.4.0)_

> Digunakan untuk section "Pengguna SaduX" di landing page. Tampilkan logo & nama klien.

| Column | Type | Constraints | Default | Description |
|---|---|---|---|---|
| `id` | INTEGER | PK, AUTO_INCREMENT | - | Primary key |
| `name` | STRING | NOT NULL | - | Nama perusahaan klien |
| `logo` | STRING | NULLABLE | - | Supabase Storage URL logo klien |
| `website` | STRING | NULLABLE | - | URL website klien |
| `order` | INTEGER | - | `0` | Urutan tampil (ASC) |
| `createdAt` | DATETIME | AUTO | - | |
| `updatedAt` | DATETIME | AUTO | - | |

---

## API Routes Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/content` | No | Get landing page content |
| PUT | `/api/content` | Yes | Update landing page content |
| **Products** | | | |
| GET | `/api/products` | No | Get all products (ordered by `order` ASC) |
| POST | `/api/products` | Yes | Create product (incl. `pricing_type`, `platform`) |
| PUT | `/api/products/:id` | Yes | Update product (incl. `pricing_type`, `platform`) |
| DELETE | `/api/products/:id` | Yes | Delete product |
| POST | `/api/products/:id/click` | No | Track product click |
| PUT | `/api/products/reorder` | Yes | Reorder products (body `{ ids: [...] }`) |
| **Features** | | | |
| GET | `/api/features` | No | Get all features |
| POST | `/api/features` | Yes | Create feature |
| PUT | `/api/features/:id` | Yes | Update feature |
| DELETE | `/api/features/:id` | Yes | Delete feature |
| **Statistics** | | | |
| GET | `/api/stats` | No | Get all statistics |
| POST | `/api/stats` | Yes | Create statistic |
| PUT | `/api/stats/:id` | Yes | Update statistic |
| DELETE | `/api/stats/:id` | Yes | Delete statistic |
| **CMS — Settings & Branding** | | | |
| GET | `/api/cms/settings` | No | Get general settings (incl. logo, favicon, footer) |
| PUT | `/api/cms/settings` | Yes | Update general settings (incl. footer_columns/social_links) |
| POST | `/api/cms/logo` | Yes | Upload site logo (image ≤5MB) → Supabase Storage |
| POST | `/api/cms/favicon` | Yes | Upload favicon (PNG ≤500KB) → Supabase Storage |
| **CMS — Testimonials** | | | |
| GET | `/api/cms/testimonials` | No | Get all testimonials |
| POST | `/api/cms/testimonials` | Yes | Create testimonial |
| PUT | `/api/cms/testimonials/:id` | Yes | Update testimonial |
| DELETE | `/api/cms/testimonials/:id` | Yes | Delete testimonial |
| **CMS — FAQs** | | | |
| GET | `/api/cms/faqs` | No | Get all FAQs |
| POST | `/api/cms/faqs` | Yes | Create FAQ |
| PUT | `/api/cms/faqs/:id` | Yes | Update FAQ |
| DELETE | `/api/cms/faqs/:id` | Yes | Delete FAQ |
| **CMS — Clients (v3.4)** | | | |
| GET | `/api/cms/clients` | No | Get all clients (ordered by `order` ASC) |
| POST | `/api/cms/clients` | Yes | Create client |
| PUT | `/api/cms/clients/:id` | Yes | Update client |
| DELETE | `/api/cms/clients/:id` | Yes | Delete client |
| POST | `/api/cms/clients/:id/logo` | Yes | Upload client logo → Supabase Storage `clients/` |
| **Analytics** | | | |
| POST | `/api/analytics/visit` | No | Track page visit |
| GET | `/api/analytics/dashboard` | Yes | Get analytics stats |
| **Auth** | | | |
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/auth/change-password` | Yes | Change own password |
| POST | `/api/auth/register` | Yes | Register admin (admin-only) |
