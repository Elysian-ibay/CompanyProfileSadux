# Master Changelog - SaduX Company Profile CMS

> Catatan lengkap semua perubahan yang sudah diimplementasi berdasarkan Implementation Plan V1 & V2, plus fitur bonus diluar plan.

---

## [v3.3.0] - Dual pricing, editable footer, mobile menu polish (2026-07-10)

- **Harga per-bulan & per-tahun** produk: kolom `Products.price_monthly` + `price_yearly`. Form admin (Label Harga + Harga/Bulan + Harga/Tahun), tampil di kartu admin & landing "Our Ecosystem". Opsional (kosong = tidak tampil).
- **Footer sepenuhnya editable via CMS** (tab **Footer** baru): `GeneralSettings.footer_description`, `footer_columns` (JSON: kolom link + judul), `social_links` (JSON: platform + url), `footer_powered_by` (+`_url`). Footer render dari data ini + fallback default. Copyright & powered-by dinamis.
- **Logo + wordmark "SaduX" tampil bersamaan** di navbar & footer (dulu saling menggantikan).
- **Menu mobile ikut tema**: overlay `bg-black/90` dulu tak terbaca di tema terang → kini pakai `--theme-page-bg`. Ditambah gaya **neobrutalist** (kartu ink + hard shadow + hover accent) khusus tema retro.

## [v3.2.0] - Branding: logo & favicon upload (2026-07-10)

- **Upload logo & favicon** via CMS (Admin → Content → Settings → Branding). Disimpan ke **Supabase Storage** (folder `branding`), URL di `GeneralSettings.site_logo` / `site_favicon`. Kolom baru → **butuh SQL manual**.
- Endpoint: `POST /api/cms/logo` (gambar, maks 5MB), `POST /api/cms/favicon` (**PNG saja, maks 500KB**, `middleware/uploadPng.js`). Keduanya protected admin.
- **Navbar & Footer** menampilkan logo bila di-set (fallback teks). **Favicon tab browser** diambil dari `site_favicon` (di-inject runtime di LandingPage). Footer copyright kini dinamis dari `GeneralSetting`.
- Catatan: file upload TIDAK bisa disimpan di `frontend/src/assets` (statis/read-only di produksi) — memakai Supabase Storage.

## [v3.1.0] - UI polish, product ordering, change password (2026-07-10)

- **Ganti password admin** dari panel (Admin → menu profil → Ganti Password). Endpoint `POST /api/auth/change-password` (protected). `authController.changePassword`.
- **Urutan produk drag-and-drop** di admin (`Products.jsx`, HTML5 DnD). Kolom baru `Products.order`; endpoint `PUT /api/products/reorder`; `getAllProducts` order by `order,id`. Landing page ikut urutan.
- **Hero badge editable via CMS** (`hero_badge_text`) + styling readable di tema retro (solid accent + teks gelap, bukan kuning-di-kuning). Input di tab Hero.
- **Footer** dibuat terbaca di tema terang/retro (`site-footer` + `themes.css`).
- **Visual teaser** diganti lebih menarik (rocket tile + capability chips, themed) + dukung `teaser_image` bila di-upload.
- **Butuh SQL manual** untuk kolom baru di DB yang sudah ada (lihat catatan rilis / chat): `Products.order`, `LandingPageContents.hero_badge_text`.

## [v3.0.0] - Production Deploy, Auth, & Theme System (2026-07-10)

> Aplikasi kini **LIVE** di Vercel + Supabase. Ringkasan serah-terima: `handoff/HANDOFF.md`.

### Added - Deployment (Vercel + Supabase)

- **Database MySQL → Supabase PostgreSQL**
  - `backend/config/database.js`: dialect env-driven (`DB_DIALECT`, default `postgres`), SSL otomatis, dukung `DATABASE_URL` (URI pooler) atau `DB_*` terpisah, pool kecil (`DB_POOL_MAX`). MySQL lokal tetap didukung.
  - Force-bundle driver `pg`/`pg-hstore` (fix `FUNCTION_INVOCATION_FAILED` — Sequelize load driver via dynamic require yang tak ter-bundle Vercel).
  - `scripts/create-db.js`: skip `CREATE DATABASE` untuk non-mysql.
- **Backend serverless di Vercel**
  - `server.js`: export Express `app`, hanya `listen()`+`sync()` saat bukan Vercel; CORS via `CLIENT_ORIGIN` (di-normalize, toleran trailing slash).
  - `backend/vercel.json`: route semua request ke `server.js` via `@vercel/node`.
  - Deps: `pg`, `pg-hstore`, `@supabase/supabase-js`.
- **Upload → Supabase Storage**
  - `backend/config/supabase.js` (client service-role), `backend/utils/storage.js` (`uploadFile()`, auto-buat bucket public `uploads`, return public URL).
  - `middleware/upload.js`: multer `memoryStorage()`. `productController`: simpan URL absolut.
- **Frontend di Vercel**
  - `frontend/vercel.json`: SPA rewrite (route seperti `/login/super-admin`, `/admin` tak 404).
  - `imageUrl()` helper di `frontend/src/lib/api.js` (URL absolut Supabase dipakai apa adanya).
  - `.env.production.example`. `VITE_API_URL` wajib berakhiran `/api`.

### Added - Autentikasi (JWT enforced)

- `backend/middleware/auth.js`: `verifyToken` + `isAdmin`. Diterapkan ke semua route mutasi (products/content/features/stats/cms POST-PUT-DELETE), `GET /analytics/dashboard`, dan `POST /auth/register` (kini admin-only). GET publik & tracking tetap terbuka.
- Frontend: axios response interceptor → 401 clear sesi + redirect `/login/super-admin`.
- **Catatan:** sebelumnya JWT dibuat saat login tapi TIDAK pernah diverifikasi (semua route mutasi terbuka).

### Added - Sistem Tema (Retro default + switchable)

- `frontend/src/lib/themes.js`: registry `THEMES` + `THEME_LIST` + `resolveThemeSettings()`. 6 tema: **retro (default)**, modern_tech, creative_studio, elegant_dark, neon_cyber, pastel_pop.
- `frontend/src/styles/themes.css`: flip utility dark→light + spesifik retro (hard shadow, uppercase, press button).
- `LandingPage.jsx`: theming via `data-theme`/CSS vars, `cardStyle`/tombol/`page_bg` dari tema, background animasi hanya tema gelap.
- `ContentManager.jsx`: grid preset di-map dari `THEME_LIST`.
- `backend/models/LandingPageContent.js`: default diubah ke retro (`active_theme='retro'`, `background_style='none'`, `accent_color='#ffd800'`, `theme_settings` retro).

### Added - Dokumentasi

- `deployment/VERCEL_SUPABASE_DEPLOY.md` (panduan deploy current), `handoff/HANDOFF.md` (serah-terima). `deployment/DEPLOYMENT_GUIDE.md` ditandai usang.

---

## [v1.0.0] - Initial Release (Implementation Plan V1)

### Added - Backend

- **Model `LandingPageContent`** - Singleton table untuk menyimpan semua konten landing page
  - Hero section: `hero_title`, `hero_subtitle`, `hero_description`
  - Hero buttons: `hero_button_primary_text`, `hero_button_primary_link`, `hero_button_secondary_text`, `hero_button_secondary_link`
  - Feature section: `feature_title`
  - CTA section: `cta_title`, `cta_description`
  - Stats visibility: `stats_visible` (boolean)
  - Teaser section: `teaser_tag`, `teaser_title`, `teaser_description`, `teaser_button_text`, `teaser_image`, `teaser_features` (JSON array)
  - **Files:** `backend/models/LandingPageContent.js`

- **Model `Feature`** - Dynamic "Why Choose Us" cards
  - Fields: `icon_name`, `title`, `description`, `order`
  - Full CRUD controller + routes
  - **Files:** `backend/models/Feature.js`, `backend/controllers/featureController.js`, `backend/routes/featureRoutes.js`

- **Model `Statistic`** - Dynamic numbers strip
  - Fields: `value`, `label`, `order`
  - Full CRUD controller + routes
  - **Files:** `backend/models/Statistic.js`, `backend/controllers/statisticController.js`, `backend/routes/statisticRoutes.js`

- **Model `User`** - Admin authentication
  - Fields: `username`, `password`, `role`
  - **Files:** `backend/models/User.js`

- **Model `Product`** - Ecosystem products
  - Fields: `name`, `price`, `description`, `image`, `link`, `tag`, `click_count`
  - **Files:** `backend/models/Product.js`

- **Content Controller** - GET/PUT untuk LandingPageContent singleton
  - **Files:** `backend/controllers/contentController.js`, `backend/routes/contentRoutes.js`

- **Auth System** - JWT-based login untuk admin
  - **Files:** `backend/routes/authRoutes.js`

- **Database Scripts** - `create-db.js` dan `migrate.js` untuk setup database
  - **Files:** `backend/scripts/create-db.js`, `backend/scripts/migrate.js`

### Added - Frontend

- **LandingPage.jsx** - Full dynamic landing page
  - Hero section dengan dynamic title, subtitle, description, buttons
  - Ecosystem section dengan products dari API
  - Features section - dynamic cards dari Feature API
  - Stats section - dynamic counters dari Statistic API
  - Teaser section - dynamic text dan bullet points
  - CTA section
  - **Files:** `frontend/src/pages/LandingPage.jsx`

- **Admin Panel - ContentManager.jsx** - Tabbed admin interface
  - Hero tab: edit title, subtitle, description, button texts/links, CTA
  - Features tab: CRUD features (icon, title, description)
  - Stats tab: CRUD stats (value, label), visibility toggle
  - Teaser tab: edit tag, title, description, button text, dynamic features list
  - **Files:** `frontend/src/pages/admin/ContentManager.jsx`

- **Admin Panel - Products.jsx** - Product management
  - **Files:** `frontend/src/pages/admin/Products.jsx`

- **Shared Components**
  - Navbar (hardcoded links)
  - Footer (hardcoded content)
  - DynamicBackground
  - AdminLayout
  - **Files:** `frontend/src/components/`, `frontend/src/layouts/`

---

## [v2.0.0] - WordPress-Style CMS (Implementation Plan V2)

### Added - Backend

- **Model `Testimonial`** - Customer testimonials / social proof
  - Fields: `name`, `role`, `comment`, `rating` (1-5), `photo`
  - CRUD via generic controller pattern
  - **Files:** `backend/models/Testimonial.js`

- **Model `Faq`** - Frequently Asked Questions
  - Fields: `question`, `answer`, `order`
  - CRUD via generic controller pattern
  - **Files:** `backend/models/Faq.js`

- **Model `GeneralSetting`** - Site identity & contacts
  - Fields: `site_title`, `site_name`, `contact_phone`, `contact_email`, `address`, `footer_copyright`
  - Singleton pattern (findOne / create if not exist)
  - **Files:** `backend/models/GeneralSetting.js`

- **CMS Controller** - Centralized controller untuk V2 models
  - Settings: GET/PUT `/api/cms/settings`
  - Testimonials: full CRUD `/api/cms/testimonials`
  - FAQ: full CRUD `/api/cms/faqs`
  - `createGenericController()` helper untuk reusable CRUD logic
  - **Files:** `backend/controllers/cmsController.js`, `backend/routes/cmsRoutes.js`

- **Model `Visitor`** - Analytics tracking
  - Fields: `ip_address`, `user_agent`
  - **Files:** `backend/models/Visitor.js`

- **Analytics Controller** - Visit tracking & dashboard stats
  - POST `/api/analytics/visit`, GET `/api/analytics/dashboard`
  - **Files:** `backend/controllers/analyticsController.js`

### Added - Frontend

- **Testimonials Section** - di LandingPage.jsx
  - Star rating display, comment cards, avatar dari initial
  - Conditional render (hanya tampil jika data > 0)
  - **Files:** `frontend/src/pages/LandingPage.jsx:348-378`

- **FAQ Section** - di LandingPage.jsx
  - Accordion style dengan `<details>` HTML5
  - Icon dan smooth toggle animation
  - Conditional render (hanya tampil jika data > 0)
  - **Files:** `frontend/src/pages/LandingPage.jsx:381-409`

- **Settings Tab** - di ContentManager.jsx
  - Edit site title, company name, phone, email, address, footer copyright
  - **Files:** `frontend/src/pages/admin/ContentManager.jsx:1049-1083`

- **Testimonials Admin Tab** - di ContentManager.jsx
  - Add/Edit/Delete testimonials (name, role, comment, rating)
  - **Files:** `frontend/src/pages/admin/ContentManager.jsx:740-766`

- **FAQ Admin Tab** - di ContentManager.jsx
  - Add/Edit/Delete FAQ items (question, answer)
  - **Files:** `frontend/src/pages/admin/ContentManager.jsx:769-788`

- **Landing Page Data Fetching** - Updated to fetch all V2 data
  - Parallel fetch: content, products, features, stats, testimonials, faqs, settings
  - Auto set `document.title` dari settings
  - **Files:** `frontend/src/pages/LandingPage.jsx:38-61`

---

## [v2.1.0] - Bonus Features (Diluar Original Plan)

### Added - Dynamic Background System

- 16 animated background options:
  `galaxy`, `starry_night`, `clouds`, `sunny_clouds`, `sunset_vibes`, `neon_grid`, `floating_bubbles`, `geometric_shapes`, `soft_gradient`, `aurora`, `minimal_dark`, `snowfall`, `fireflies`, `digital_rain`, `shooting_stars`, `gradient_waves`
- Stored di `LandingPageContent.background_style`
- Background tab di ContentManager untuk pilih background
- **Files:** `frontend/src/components/DynamicBackground.jsx`, `frontend/src/components/GalaxyBackground.jsx`

### Added - Appearance / Theme System

- **Preset Themes:** Modern Tech, Creative Studio, Elegant Dark
  - Setiap theme set font, button style, colors, card glassmorphism
- **Custom Typography:** Heading & body font selector (Inter, Roboto, Playfair Display, Poppins, Montserrat, Open Sans, Outfit, Space Grotesk)
- **Button Styling:** Shape (none, rounded-xl, rounded-full), gradient start/end color picker, live preview
- **Card Glassmorphism:** Background opacity slider, blur amount, border color
- **Per-Section Custom Styling:** Setiap section (hero, features, stats, teaser, testimonials, faq) bisa punya:
  - Custom font family
  - Custom title size
  - Custom text color & accent color
  - Custom section background (CSS value)
  - Enable/disable toggle
- Stored di `LandingPageContent.theme_settings` (JSON), `active_theme`, `font_family`, `accent_color`
- Appearance tab di ContentManager
- **Files:** `frontend/src/pages/admin/ContentManager.jsx` (appearance tab + renderSectionStyler), `frontend/src/pages/LandingPage.jsx` (getSectionStyle, getTitleStyle, containerStyle)

### Added - PWA Support

- `vite-plugin-pwa` dependency added
- **Files:** `frontend/package.json`

### Added - Visit Analytics

- Auto track setiap kunjungan landing page
- Dashboard stats endpoint
- **Files:** `backend/controllers/analyticsController.js`, `frontend/src/pages/LandingPage.jsx:69-75`

---

## [v2.2.0] - Code Quality & DevOps Improvements

### Fixed - Hardcoded Values Dipindah ke Environment Variables

- **`frontend/src/lib/api.js`** - `baseURL` sekarang baca dari `VITE_API_URL` env variable, export `SERVER_URL` untuk image URLs
- **`frontend/src/pages/LandingPage.jsx`** - Image URL pakai `SERVER_URL` (bukan hardcode `localhost:5192`)
- **`frontend/src/pages/admin/Products.jsx`** - Image URL pakai `SERVER_URL`
- **`frontend/.env`** - `VITE_API_URL=http://localhost:5202/api`
- **`backend/.env`** - Dikonfigurasi untuk XAMPP lokal (localhost:3306, root)

### Fixed - Model Defaults Disesuaikan dengan SaduX Branding

- **`backend/models/LandingPageContent.js`** - Default values diubah dari konten "MyBoneka" ke konten SaduX:
  - `hero_title`: "MyBoneka" -> "Sadulur Teknologi Indonesia"
  - `hero_subtitle`: "Kelembutan Abadi." -> "Innovate. Integrate. Inspire."
  - `feature_title`: "Kenapa Memilih MyBoneka?" -> "Our Ecosystem"
  - `cta_title` & `cta_description` disesuaikan

### Fixed - Frontend Fallback Data Disesuaikan

- **`frontend/src/pages/LandingPage.jsx`** - Product fallback sekarang 4 items (sesuai seed data), hero title fallback konsisten
- **CTA Section** sekarang dynamic dari `content.cta_title` dan `content.cta_description`

### Added - Database Backup & Restore Scripts

- **`backend/scripts/backup-db.js`** - Export semua data ke JSON file di `backend/backups/`
  - Usage: `npm run db:backup`
  - Output: `backups/backup_YYYY-MM-DD_HH-mm-ss.json`
- **`backend/scripts/restore-db.js`** - Restore data dari backup JSON
  - Usage: `npm run db:restore` (latest) atau `npm run db:restore backup_file.json`
- NPM scripts ditambahkan: `db:backup`, `db:restore`

### Added - Documentation

- **`master-docs/MASTER_SUMMARY.md`** - Rangkuman lengkap implementasi V1 & V2
- **`master-docs/MASTER_CHANGELOG.md`** - Changelog semua perubahan
- **`master-docs/database/DATABASE_SCHEMA.md`** - Schema semua 9 tables + API routes
- **`master-docs/deployment/GITHUB_PUSH_GUIDE.md`** - Panduan push ke GitHub
- **`master-docs/deployment/DEPLOYMENT_GUIDE.md`** - Panduan deploy Vercel + Supabase

---

## Known Issues / Backlog

| # | Item | Severity | Notes |
|---|---|---|---|
| 1 | Teaser image upload belum berfungsi | Medium | Backend belum pakai multer di content route, frontend belum ada upload component |
| 2 | Footer hardcoded | Medium | Tidak consume `GeneralSetting` data (copyright, contacts) |
| 3 | Navbar menu hardcoded | Low | Plan V2 point 4 (Optional), belum dimulai |
| 4 | Testimonial photo upload | Low | Masih pakai avatar initial letter |
| 5 | `meta_description` belum ada di GeneralSetting | Low | Ada di plan V2 tapi belum di model |
| 6 | `contact_whatsapp` & `contact_instagram` belum ada | Low | Plan V2 pakai whatsapp/instagram, implementasi pakai phone/email |
| 7 | Database pakai MySQL, perlu migrasi ke Supabase (PostgreSQL) untuk deployment | High | Lihat deployment guide |
