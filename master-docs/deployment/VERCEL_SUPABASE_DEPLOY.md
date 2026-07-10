# Panduan Deployment — Vercel (Frontend + Backend) + Supabase (Database + Storage)

> Panduan lengkap men-deploy **SaduX Company Profile** dengan frontend & backend **sama-sama di Vercel** (dua project terpisah dari **satu repo GitHub**), database **Supabase PostgreSQL**, dan upload gambar **Supabase Storage**.
>
> Repo: `https://github.com/Elysian-ibay/CompanyProfileSadux`

---

## Arsitektur

```
                       ┌────────────────────────────┐
   Browser ─────────►  │ Vercel Project #1: FRONTEND │  (Root Directory: frontend/)
                       │   React SPA (Vite)          │
                       └──────────────┬─────────────┘
                                      │  fetch VITE_API_URL
                                      ▼
                       ┌────────────────────────────┐
                       │ Vercel Project #2: BACKEND  │  (Root Directory: backend/)
                       │   Express (serverless)      │
                       └───────┬───────────────┬─────┘
                               │               │
                        (SQL)  ▼               ▼  (file upload)
                  ┌─────────────────┐   ┌─────────────────┐
                  │ Supabase        │   │ Supabase        │
                  │ PostgreSQL      │   │ Storage         │
                  └─────────────────┘   └─────────────────┘
```

## Prasyarat

- Akun **GitHub** (repo sudah di-push).
- Akun **Vercel** (login pakai GitHub) — https://vercel.com
- Akun **Supabase** — https://supabase.com
- **Node.js 18+** terinstall di lokal (untuk migrate & seed sekali di awal).

---

## LANGKAH 1 — Setup Supabase

### 1.1 Buat Project
1. Login ke https://supabase.com → **New Project**.
2. Isi:
   - **Name:** `sadux-companyprofile`
   - **Database Password:** buat password kuat — **CATAT**, dipakai di connection string.
   - **Region:** `Southeast Asia (Singapore)` (terdekat ke Indonesia).
3. Klik **Create new project**, tunggu ±2 menit sampai provisioning selesai.

### 1.2 Ambil Connection String (untuk database)
1. Menu kiri: **Project Settings** (ikon gear) → **Database**.
2. Bagian **Connection string** → tab **URI**.
3. Pilih mode **Transaction pooler** (port **6543**) — WAJIB untuk serverless/Vercel.
4. Copy string, bentuknya:
   ```
   postgresql://postgres.abcdefghijklmno:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
   Ganti `PASSWORD` dengan database password dari langkah 1.1. Ini nanti jadi **`DATABASE_URL`**.

### 1.3 Ambil API Keys (untuk Storage upload)
1. **Project Settings** → **API**.
2. Catat:
   - **Project URL** → `SUPABASE_URL` (contoh `https://abcdefghijklmno.supabase.co`)
   - **Project API keys → `service_role`** (klik "Reveal") → `SUPABASE_SERVICE_KEY`
     > ⚠️ Key `service_role` bersifat RAHASIA. Hanya dipakai di backend. **Jangan pernah** taruh di frontend / commit ke git.

### 1.4 Storage Bucket
Tidak perlu dibuat manual — backend otomatis membuat bucket **public** bernama `uploads` saat upload pertama. (Opsional manual: **Storage** → **New bucket** → nama `uploads` → centang **Public**.)

---

## LANGKAH 2 — Migrate & Seed Database (sekali, dari lokal)

Tabel dibuat sekali dari komputer Anda (Vercel tidak auto-migrate).

1. Di folder project:
   ```bash
   cd backend
   cp .env.example .env        # Windows: copy .env.example .env
   ```
2. Edit `backend/.env`, isi minimal:
   ```env
   DB_DIALECT=postgres
   DATABASE_URL=postgresql://postgres.<REF>:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   JWT_SECRET=<isi string acak panjang>
   SUPABASE_URL=https://<REF>.supabase.co
   SUPABASE_SERVICE_KEY=<service_role key>
   SUPABASE_BUCKET=uploads
   ```
   Generate `JWT_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
3. Install dependency & jalankan migrate + seed:
   ```bash
   npm install
   npm run db:migrate     # buat 9 tabel di Supabase
   npm run db:seed        # isi admin (admin/admin123) + konten awal
   ```
   > `npm run db:create` otomatis di-skip untuk Postgres (database `postgres` sudah ada).
4. **Verifikasi:** Supabase Dashboard → **Table Editor** → harus muncul 9 tabel:
   `Users, Products, LandingPageContents, Features, Statistics, Testimonials, Faqs, GeneralSettings, Visitors`.

> 💡 Admin pertama HARUS dibuat lewat seed karena endpoint `/register` sekarang admin-only.

---

## LANGKAH 3 — Push ke GitHub

Kalau belum:
```bash
git add .
git commit -m "chore: ready for deploy"
git push
```
Pastikan `backend/.env` **tidak** ikut ter-push (sudah di `.gitignore`). ✅

---

## LANGKAH 4 — Deploy BACKEND ke Vercel

Sudah disiapkan: `backend/vercel.json` (route semua request ke `server.js`) + `server.js` export Express app tanpa `listen()` saat di Vercel.

1. https://vercel.com → **Add New…** → **Project** → **Import** repo `CompanyProfileSadux`.
2. **Configure Project:**
   - **Root Directory:** klik **Edit** → pilih **`backend`**
   - **Framework Preset:** `Other`
   - Build/Output: biarkan default (diatur `vercel.json`).
3. **Environment Variables** — tambahkan (Environment: **Production** + **Preview**):

   | Key | Value |
   |---|---|
   | `DB_DIALECT` | `postgres` |
   | `DATABASE_URL` | URI transaction pooler (port 6543) dari 1.2 |
   | `JWT_SECRET` | string acak kuat (SAMA dengan yang dipakai saat seed) |
   | `SUPABASE_URL` | `https://<REF>.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | service_role key dari 1.3 |
   | `SUPABASE_BUCKET` | `uploads` |
   | `NODE_ENV` | `production` |
   | `CLIENT_ORIGIN` | *(isi nanti di Langkah 6)* |

4. Klik **Deploy**. Setelah selesai, catat URL backend, misal:
   `https://sadux-api.vercel.app`
5. **Test cepat** (buka di browser):
   - `https://sadux-api.vercel.app/` → tampil `API SaduX Company Profile is running...`
   - `https://sadux-api.vercel.app/api/content` → keluar JSON konten (bukti DB tersambung).

> ⚠️ `JWT_SECRET` di Vercel harus **sama persis** dengan yang dipakai saat `db:seed`, kalau tidak login admin akan gagal (token ditandatangani dengan secret berbeda). *(Sebenarnya secret dipakai untuk sign & verify saat runtime — yang penting nilai di Vercel konsisten; admin di-seed hanya menyimpan password hash, bukan token. Tetap disarankan pakai satu secret yang sama di semua tempat.)*

---

## LANGKAH 5 — Deploy FRONTEND ke Vercel

Sudah disiapkan: `frontend/vercel.json` (SPA rewrite agar `/login/super-admin` & `/admin` tidak 404 saat direfresh).

1. Vercel → **Add New…** → **Project** → **Import** repo **yang sama** (`CompanyProfileSadux`) sekali lagi.
2. **Configure Project:**
   - **Root Directory:** **`frontend`**
   - **Framework Preset:** `Vite` (auto — Build `npm run build`, Output `dist`).
3. **Environment Variables:**

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://sadux-api.vercel.app/api` (URL backend dari Langkah 4 + `/api`) |

   > ⚠️ Variabel `VITE_*` dibaca saat **build**. Kalau diubah setelah deploy, harus **Redeploy**.
4. Klik **Deploy**. Catat URL frontend, misal:
   `https://sadux-companyprofile.vercel.app`

---

## LANGKAH 6 — Hubungkan Frontend ↔ Backend (CORS)

1. Buka **project BACKEND** di Vercel → **Settings** → **Environment Variables**.
2. Set/tambah:
   ```
   CLIENT_ORIGIN = https://sadux-companyprofile.vercel.app
   ```
   (Beberapa origin? Pisahkan koma, mis. tambah custom domain: `https://sadux.my.id,https://sadux-companyprofile.vercel.app`)
3. **Deployments** → deployment terbaru → menu **⋯** → **Redeploy** (agar env baru terpakai).

---

## LANGKAH 7 — Uji Coba (Checklist)

- [ ] `GET https://<backend>/api/content` mengembalikan JSON
- [ ] Landing page tampil, konten muncul dari API (bukan data fallback)
- [ ] Login admin di `https://<frontend>/login/super-admin` (admin / admin123)
- [ ] Setelah login masuk ke `/admin`, dashboard & menu muncul
- [ ] CRUD Product / Feature / FAQ berfungsi (create, edit, delete)
- [ ] Upload gambar product berhasil → cek bucket `uploads` di Supabase Storage, dan field `image` produk berupa URL `https://<REF>.supabase.co/storage/...`
- [ ] Tidak ada error **CORS** di Console browser (F12)
- [ ] Logout lalu akses `/admin` langsung → diarahkan ke halaman login

---

## Referensi Environment Variables

### Backend (Vercel — project backend)
| Key | Wajib | Keterangan |
|---|---|---|
| `DB_DIALECT` | ya | `postgres` |
| `DATABASE_URL` | ya | URI pooler Supabase (port 6543) |
| `JWT_SECRET` | ya | Secret penandatangan JWT (kuat & rahasia) |
| `SUPABASE_URL` | ya (upload) | `https://<REF>.supabase.co` |
| `SUPABASE_SERVICE_KEY` | ya (upload) | service_role key (rahasia) |
| `SUPABASE_BUCKET` | opsional | default `uploads` |
| `CLIENT_ORIGIN` | ya | Origin frontend (untuk CORS), pisah koma |
| `NODE_ENV` | opsional | `production` |
| `DB_POOL_MAX` | opsional | default `3` |

### Frontend (Vercel — project frontend)
| Key | Wajib | Keterangan |
|---|---|---|
| `VITE_API_URL` | ya | `https://<backend>/api` (dibaca saat build) |

---

## Update Setelah Deploy

- **Ubah kode** → cukup `git push`. Vercel auto-redeploy kedua project.
- **Ubah/ tambah kolom model** (mis. tambah field di suatu model) → jalankan lagi dari lokal:
  ```bash
  cd backend && npm run db:migrate
  ```
  (Vercel tidak menjalankan `sequelize.sync()`.)
- **Ubah `VITE_API_URL`** → Redeploy frontend (karena dibaca saat build).

---

## Troubleshooting

| Gejala | Penyebab & Solusi |
|---|---|
| **CORS blocked** di console | `CLIENT_ORIGIN` di backend belum berisi domain frontend (persis, tanpa trailing slash). Set lalu **Redeploy** backend. |
| **Backend 500 `FUNCTION_INVOCATION_FAILED` di semua route (termasuk `/`)** | Fungsi crash saat cold start. Dua sebab utama: (1) driver `pg` tak ter-bundle — sudah difix dengan `require('pg')` eksplisit di `config/database.js`; (2) **Environment Variables belum diset** di project backend Vercel (terutama `DATABASE_URL`). Cek Settings → Environment Variables (scope Production), lalu **Redeploy**. |
| **`relation "..." does not exist`** | Tabel belum dibuat. Jalankan `npm run db:migrate` dari lokal (Langkah 2). |
| **`connection refused` / timeout ke DB** | Pakai port **6543** (transaction pooler), bukan 5432. SSL sudah otomatis untuk postgres. Cek `DATABASE_URL` benar. |
| **Login admin gagal / "Invalid Password"** | Belum di-seed. Jalankan `npm run db:seed`. User: `admin`, pass: `admin123`. |
| **Semua request admin balas 401** | Token hilang/expired (24 jam) atau `JWT_SECRET` beda antara saat sign & verify. Login ulang; pastikan `JWT_SECRET` konsisten di Vercel. |
| **Upload gambar error / "Supabase Storage not configured"** | `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` belum diset di env backend. |
| **Gambar tidak tampil** | Pastikan bucket `uploads` **Public**. Field `image` harus URL absolut Supabase. |
| **Frontend blank / route 404 saat refresh** | `frontend/vercel.json` (SPA rewrite) harus ada. Pastikan Framework Preset = Vite, Output = `dist`. |
| **Frontend tak konek API** | `VITE_API_URL` salah atau di-set setelah build. Perbaiki lalu **Redeploy**. |
| **`/register` balas 403** | Ini disengaja — register kini admin-only. Buat admin via `db:seed`, atau login sebagai admin dulu. |

---

## Catatan Keamanan

- **Auth:** semua route mutasi (POST/PUT/DELETE products/content/features/stats/cms, GET analytics dashboard, dan `/auth/register`) **diproteksi JWT admin** via `backend/middleware/auth.js`. GET publik & tracking (`/products/:id/click`, `/analytics/visit`, `/auth/login`) tetap terbuka. Admin pertama dari `npm run db:seed`.
- **`JWT_SECRET`:** gunakan nilai kuat & unik di production (Vercel env). Jangan pakai secret dev lemah.
- **`backend/.env-dev`** masih ter-track di git (berisi secret dev lemah). Disarankan untrack: `git rm --cached backend/.env-dev` lalu commit.
- **`SUPABASE_SERVICE_KEY`** hanya di backend. Jangan pernah dipakai/expose di frontend.
- **Lokal MySQL** masih didukung: set `DB_DIALECT=mysql` + kosongkan `DATABASE_URL` di `backend/.env` untuk XAMPP.
```
