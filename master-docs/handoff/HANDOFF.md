# 🚀 Handoff — SaduX Company Profile CMS

> Dokumen serah-terima. Status: **LIVE di production** (Vercel + Supabase). Landing page + admin CMS berjalan penuh.
> Terakhir diperbarui: 2026-07-10 (mencakup s/d v3.3.0).

---

## 1. Ringkasan

SaduX Company Profile adalah **CMS landing page dinamis** (gaya WordPress): seluruh isi landing page (hero, produk/ekosistem, fitur, statistik, testimoni, FAQ, pengaturan, tema, background) dapat diedit lewat **Admin Panel** tanpa menyentuh kode.

| Item | Nilai |
|---|---|
| **Stack FE** | React 19 + Vite 7 + TailwindCSS 4 |
| **Stack BE** | Express 5 + Sequelize 6 (serverless) |
| **Database** | Supabase **PostgreSQL** |
| **File Storage** | Supabase **Storage** (bucket `uploads`) |
| **Hosting** | **Vercel** (2 project: frontend & backend) dari **1 repo** |
| **Tema default** | Retro / Neobrutalist (bisa diganti di CMS) |

---

## 2. URL Live

| Bagian | URL |
|---|---|
| **Landing page** | https://compro-frontend-sadux.vercel.app |
| **Admin login** | https://compro-frontend-sadux.vercel.app/login/super-admin |
| **Backend API** | https://compro-backend-sadux.vercel.app |
| **API health** | https://compro-backend-sadux.vercel.app/ → "API SaduX Company Profile is running..." |
| **API contoh** | https://compro-backend-sadux.vercel.app/api/content |

> ⚠️ URL login adalah **`/login/super-admin`**, BUKAN `/login`.

---

## 3. Kredensial

### Admin panel
```
Username : admin
Password : admin123
```
> ⚠️ **Ganti password default ini** (lihat §11 Rekomendasi). Dibuat oleh `npm run db:seed`.

### Secrets / API keys — LOKASI (bukan nilai)
Nilai rahasia **TIDAK** ditulis di repo. Ambil dari:
- **Lokal:** `backend/.env` (di-`.gitignore`, tidak ter-push).
- **Production:** Vercel → project **backend** → Settings → Environment Variables.
- **Supabase:** Dashboard project (Database password & API keys).

Variabel yang dipakai: `DATABASE_URL`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `CLIENT_ORIGIN`, `DB_DIALECT`, `NODE_ENV` (lihat §7).

---

## 4. Repository

- **GitHub:** https://github.com/Elysian-ibay/CompanyProfileSadux (branch `main`)
- **Struktur (monorepo, 2 npm project terpisah):**
  ```
  frontend/     React SPA (Vite)        → Vercel project "compro-frontend-sadux"  (Root Directory: frontend)
  backend/      Express API (serverless)→ Vercel project "compro-backend-sadux"   (Root Directory: backend)
  master-docs/  Dokumentasi (schema, changelog, deploy, handoff)
  ```
- **Deploy otomatis:** setiap `git push` ke `main` → Vercel me-redeploy kedua project.

---

## 5. Arsitektur

```
[Browser]
   │
   ▼
[Vercel: FRONTEND]  ── VITE_API_URL ──►  [Vercel: BACKEND (serverless Express)]
 React SPA (Vite)                              │
 Root: frontend/                               ├─► [Supabase PostgreSQL]  (data, pooler :6543)
                                               └─► [Supabase Storage]     (gambar upload, bucket "uploads")
```

- Frontend memanggil backend via `VITE_API_URL = https://compro-backend-sadux.vercel.app/api`.
- Backend membatasi CORS via `CLIENT_ORIGIN = https://compro-frontend-sadux.vercel.app`.
- Backend konek DB via `DATABASE_URL` (Supabase **Transaction pooler**, port **6543**, region ap-northeast-1).

---

## 6. Environment Variables

### Backend (Vercel project backend + `backend/.env` lokal)
| Key | Keterangan |
|---|---|
| `DB_DIALECT` | `postgres` |
| `DATABASE_URL` | URI Supabase transaction pooler (port 6543) |
| `JWT_SECRET` | Secret penandatangan JWT (harus **sama** di lokal & Vercel agar token konsisten) |
| `SUPABASE_URL` | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Secret key (`sb_secret_...`) — server-side only |
| `SUPABASE_BUCKET` | `uploads` |
| `CLIENT_ORIGIN` | Origin frontend (CORS), tanpa slash akhir |
| `NODE_ENV` | `production` |

### Frontend (Vercel project frontend)
| Key | Keterangan |
|---|---|
| `VITE_API_URL` | `https://compro-backend-sadux.vercel.app/api` (**wajib** `/api`; dibaca saat build → ubah = harus Redeploy) |

---

## 7. Menjalankan di Lokal

Prasyarat: Node 18+. DB bisa pakai Supabase (default) atau MySQL/XAMPP lokal.

```bash
# Backend
cd backend
cp .env.example .env         # lalu isi DATABASE_URL, JWT_SECRET, SUPABASE_* (lihat §6)
npm install
npm run db:migrate           # buat tabel (sekali, atau setelah ubah model)
npm run db:seed              # isi data awal (idempotent)
npm run dev                  # http://localhost:5202

# Frontend (terminal baru)
cd frontend
npm install                  # pastikan frontend/.env berisi VITE_API_URL
npm run dev                  # http://localhost:5203
```

Pakai MySQL lokal (XAMPP): set `DB_DIALECT=mysql`, kosongkan `DATABASE_URL`, isi `DB_HOST/DB_NAME/DB_USER/DB_PASS`.

---

## 8. Deploy & Redeploy

- **Update kode biasa:** `git push` → Vercel auto-redeploy kedua project.
- **Ubah Environment Variable:** setelah simpan di Vercel, **wajib Redeploy manual** (Deployments → ⋯ → Redeploy) agar terpakai.
- **Ubah model DB** (kolom/tabel baru): jalankan `npm run db:migrate` dari lokal (Vercel TIDAK auto-sync schema).
- Panduan lengkap step-by-step: [`../deployment/VERCEL_SUPABASE_DEPLOY.md`](../deployment/VERCEL_SUPABASE_DEPLOY.md).

---

## 9. Database (Supabase PostgreSQL)

- **9 tabel:** Users, Products, LandingPageContents (singleton, isi semua konten + `theme_settings`), Features, Statistics, Testimonials, Faqs, GeneralSettings (singleton), Visitors.
- **Schema lengkap:** [`../database/DATABASE_SCHEMA.md`](../database/DATABASE_SCHEMA.md).
- **Migrate/seed** dijalankan dari lokal (bukan di Vercel). Sudah dilakukan → DB production sudah terisi.
- **⚠️ Migrasi kolom pasca-rilis** ditambahkan lewat **SQL manual di Supabase** (Vercel tidak auto-sync schema). Semua statement `ALTER ... IF NOT EXISTS` terkumpul di bagian **"Migrasi Manual (Post-Release)"** pada `DATABASE_SCHEMA.md`. **Setiap kali menambah kolom/model baru**, jalankan `npm run db:migrate` dari lokal (mengubah Supabase) ATAU paste SQL-nya di Supabase.
- **Verifikasi:** Supabase → Table Editor.
- **Backup/restore lokal:** `npm run db:backup` / `npm run db:restore` (JSON di `backend/backups/`).

---

## 10. Upload Gambar (Supabase Storage)

- Upload produk (multer memory storage) → di-upload ke Supabase Storage bucket `uploads` (public, auto-dibuat).
- Field `image` menyimpan **URL absolut** Supabase. Frontend memakai helper `imageUrl()` (`frontend/src/lib/api.js`).
- Butuh `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` di env backend. Tanpa itu, fitur lain tetap jalan; hanya upload yang nonaktif.

---

## 11. Sistem Tema

- **Default: Retro / Neobrutalist** (krem + grid titik, border tebal, hard shadow, kuning, uppercase). Termasuk navbar mobile bergaya neobrutalist & flip warna otomatis untuk tema terang.
- **6 tema** bisa diganti via **Admin → Content → Appearance → Preset Themes**: Retro, Modern Tech, Creative Studio, Elegant Dark, Neon Cyberpunk, Pastel Pop.
- **Registry terpusat:** `frontend/src/lib/themes.js` — tambah tema baru = tambah 1 entry di `THEMES` + `THEME_LIST`.
- **Default backend** ada di `backend/models/LandingPageContent.js` (harus sinkron dengan `THEMES.retro`).
- Styling: `frontend/src/styles/themes.css` + logika di `frontend/src/pages/LandingPage.jsx`.

---

## 12. Autentikasi & Keamanan

- **JWT admin enforced** di semua route mutasi (`backend/middleware/auth.js`): products/content/features/stats/cms POST-PUT-DELETE, `GET /analytics/dashboard`, `POST /auth/register` (admin-only).
- **Publik:** semua GET (landing baca data), `POST /products/:id/click`, `POST /analytics/visit`, `POST /auth/login`.
- Frontend: token disimpan di `localStorage`, dikirim via axios interceptor; response 401 → redirect ke `/login/super-admin`.

---

## 13. Yang Dikerjakan di Sesi Ini

1. **Adaptasi deploy** MySQL → Supabase PostgreSQL; backend jadi serverless (Vercel `builds`/`routes` → `server.js`); env-driven dialect + `DATABASE_URL`.
2. **Upload** dipindah dari disk lokal → **Supabase Storage** (multer memory + `utils/storage.js`).
3. **Auth JWT** diberlakukan di semua route mutasi (sebelumnya token dibuat tapi tak pernah diverifikasi).
4. **Sistem tema** baru: registry 6 tema, **Retro jadi default**, bisa diganti via CMS.
5. **Frontend Vercel:** SPA rewrite, `imageUrl()` helper untuk URL absolut.
6. **Perbaikan deploy:** force-bundle driver `pg` (fix `FUNCTION_INVOCATION_FAILED`), CORS di-normalize (trailing slash), `VITE_API_URL` harus `/api`.
7. **Dokumentasi:** panduan deploy Vercel+Supabase, changelog, schema, handoff ini.
8. **Ganti password admin** dari panel (menu profil → Ganti Password). Endpoint `POST /auth/change-password`.
9. **Urutan produk drag-and-drop** di admin (`Products.order`, `PUT /products/reorder`).
10. **Hero badge editable** via CMS (`hero_badge_text`) + readable di retro.
11. **Branding:** upload **logo & favicon** (Supabase Storage), tampil di navbar/footer + tab browser. Logo + wordmark tampil bersamaan.
12. **Harga per-bulan & per-tahun** produk (`price_monthly`, `price_yearly`).
13. **Footer sepenuhnya editable** via CMS (tab Footer): deskripsi, kolom link, sosial media, powered-by.
14. **Navbar mobile** ikut tema + gaya neobrutalist untuk retro.

Detail changelog: [`../MASTER_CHANGELOG.md`](../MASTER_CHANGELOG.md) (s/d v3.3.0).

---

## 14. Known Issues / Backlog / Rekomendasi

| Prioritas | Item |
|---|---|
| 🔴 Tinggi | **Ganti password admin default** (`admin/admin123`). Sudah ada UI: Admin → menu profil → **Ganti Password**. Segera ganti. |
| 🟡 Sedang | `backend/.env-dev` masih ter-track di git (berisi JWT dev lemah) — sebaiknya `git rm --cached backend/.env-dev`. |
| 🟢 Rendah | **Footer** kini editable via CMS ✅. **Navbar** link menu (Home/Ecosystem/About/Contact) & teks brand "SaduX" masih hardcoded — belum editable. |
| 🟢 Rendah | Upload foto testimonial belum ada UI (produk & branding sudah bisa upload; teaser pakai `teaser_image` bila di-set). |
| 🟢 Rendah | Bundle frontend >500KB — pertimbangkan code-splitting bila perlu. |

---

## 15. Peta Dokumen (`master-docs/`)

| File | Isi |
|---|---|
| `handoff/HANDOFF.md` | **Dokumen ini** — serah terima & status live |
| `deployment/VERCEL_SUPABASE_DEPLOY.md` | Panduan deploy step-by-step (Vercel + Supabase) — **current** |
| `deployment/DEPLOYMENT_GUIDE.md` | Panduan lama (backend di VPS) — **usang/superseded** |
| `deployment/GITHUB_PUSH_GUIDE.md` | Panduan push GitHub |
| `database/DATABASE_SCHEMA.md` | Skema 9 tabel + daftar API route |
| `MASTER_SUMMARY.md` | Ringkasan implementasi fitur |
| `MASTER_CHANGELOG.md` | Riwayat perubahan lengkap |
