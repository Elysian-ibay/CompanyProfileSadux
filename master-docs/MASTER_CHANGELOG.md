# Master Changelog - SaduX Company Profile CMS

> Catatan lengkap semua perubahan yang sudah diimplementasi berdasarkan Implementation Plan V1 & V2, plus fitur bonus diluar plan.

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
