# Deploy Guide — Frontend + Backend di Vercel, Database & Storage di Supabase

> Panduan ini menggantikan arsitektur lama (backend di VPS). Sekarang **frontend dan backend sama-sama di Vercel**, database **Supabase PostgreSQL**, upload gambar **Supabase Storage**. Satu repo GitHub, dua project Vercel.

## Arsitektur

```
[Browser]
   |
   v
[Vercel Project #1: Frontend]  --API-->  [Vercel Project #2: Backend (serverless)]
   React SPA (root: frontend/)              Express (root: backend/)
                                                 |
                                                 +--> [Supabase PostgreSQL]  (data)
                                                 +--> [Supabase Storage]     (gambar/upload)
```

Keduanya di-import dari **repo GitHub yang sama**, dibedakan oleh **Root Directory**.

---

## Bagian 1 — Supabase (Database + Storage)

1. Buat project di https://supabase.com (region **Southeast Asia / Singapore**). Catat **Database Password**.
2. **Connection string:** Project Settings → Database → Connection string → tab **URI**. Pakai **Transaction pooler (port 6543)** untuk serverless:
   ```
   postgresql://postgres.<REF>:<PASSWORD>@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
3. **API keys:** Project Settings → API. Catat:
   - `SUPABASE_URL` = `https://<REF>.supabase.co`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (⚠️ rahasia, server-side only)
4. **Storage bucket:** tidak perlu dibuat manual — backend otomatis membuat bucket public `uploads` saat upload pertama (via service key). Kalau mau manual: Storage → New bucket → nama `uploads` → **Public**.

### Migrasi & seed tabel (jalankan sekali dari lokal)

Isi `backend/.env` (copy dari `backend/.env.example`) dengan kredensial Supabase, lalu:

```bash
cd backend
npm install
npm run db:migrate   # buat semua tabel di Supabase (sequelize sync)
npm run db:seed      # isi admin (admin/admin123) + konten awal
```

> `npm run db:create` otomatis di-skip untuk Postgres (database `postgres` sudah ada).

Verifikasi di Supabase → **Table Editor**: harus muncul 9 tabel (Users, Products, LandingPageContents, Features, Statistics, Testimonials, Faqs, GeneralSettings, Visitors).

---

## Bagian 2 — Backend ke Vercel (serverless)

Sudah disiapkan: `backend/vercel.json` (route semua request ke `server.js`), dan `server.js` meng-export Express `app` tanpa `app.listen()` saat di Vercel.

1. Vercel → **Add New Project** → import repo GitHub.
2. **Root Directory:** `backend`
3. Framework Preset: **Other** (biarkan default; `vercel.json` yang mengatur).
4. **Environment Variables** (Settings → Environment Variables):

   | Variable | Contoh nilai |
   |---|---|
   | `DB_DIALECT` | `postgres` |
   | `DATABASE_URL` | URI transaction pooler dari Supabase (port 6543) |
   | `JWT_SECRET` | string acak panjang (lihat di bawah) |
   | `CLIENT_ORIGIN` | `https://<frontend>.vercel.app` (isi setelah frontend dideploy) |
   | `SUPABASE_URL` | `https://<REF>.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | service_role key |
   | `SUPABASE_BUCKET` | `uploads` |
   | `NODE_ENV` | `production` |

   Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

5. Deploy. Catat URL backend, mis. `https://sadux-api.vercel.app`.
6. Test: buka `https://sadux-api.vercel.app/` → harus tampil "API SaduX Company Profile is running..."; dan `https://sadux-api.vercel.app/api/content` → JSON konten.

> **Catatan:** Vercel tidak menjalankan `sequelize.sync()` otomatis (schema di-migrate manual di Bagian 1). Kalau ubah model, jalankan lagi `npm run db:migrate` dari lokal.

---

## Bagian 3 — Frontend ke Vercel

Sudah disiapkan: `frontend/vercel.json` (SPA rewrite agar route seperti `/login/super-admin` & `/admin` tidak 404).

1. Vercel → **Add New Project** → import repo GitHub yang sama.
2. **Root Directory:** `frontend`
3. Framework Preset: **Vite** (Build: `npm run build`, Output: `dist`).
4. **Environment Variable:**

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://sadux-api.vercel.app/api` |

   ⚠️ `VITE_*` dibaca saat **build** — kalau diubah, harus **Redeploy**.
5. Deploy. Catat URL frontend, mis. `https://sadux-companyprofile.vercel.app`.

---

## Bagian 4 — Hubungkan (CORS)

1. Kembali ke **project backend** di Vercel → Environment Variables → set:
   ```
   CLIENT_ORIGIN=https://sadux-companyprofile.vercel.app
   ```
   (boleh beberapa origin dipisah koma, mis. + custom domain)
2. **Redeploy** backend agar env baru terpakai.

---

## Checklist Test

- [ ] `GET /api/content` di URL backend mengembalikan JSON
- [ ] Landing page tampil dan konten muncul dari API (bukan fallback)
- [ ] Login admin di `https://<frontend>/login/super-admin` (admin / admin123)
- [ ] CRUD product/feature/faq berfungsi
- [ ] Upload gambar product tersimpan (cek bucket `uploads` di Supabase Storage, `image` produk berupa URL `https://...supabase.co/...`)
- [ ] Tidak ada error CORS di console browser

---

## Catatan Penting

- **Uploads:** kini via Supabase Storage (`backend/utils/storage.js`). Field `image` menyimpan **URL absolut**; frontend memakai helper `imageUrl()` di `frontend/src/lib/api.js` (URL absolut dipakai apa adanya, path lama `/uploads/..` diprefix `SERVER_URL`).
- **Keamanan (auth):** semua route mutasi (POST/PUT/DELETE products/content/features/stats/cms, GET analytics dashboard, dan register) kini **diproteksi JWT admin** via `backend/middleware/auth.js`. GET publik & tracking (`/products/:id/click`, `/analytics/visit`, `/auth/login`) tetap terbuka. Admin pertama dibuat oleh `npm run db:seed` (register sekarang admin-only). Pastikan `JWT_SECRET` production kuat.
- **`backend/.env-dev`** ter-commit di git dan berisi `JWT_SECRET` dev lemah — sebaiknya untrack: `git rm --cached backend/.env-dev`. Untuk production gunakan `JWT_SECRET` baru yang kuat (di Vercel env, bukan di file).
- **Supabase pooler:** pakai port **6543** (transaction pooler) untuk serverless. Pool di Sequelize sudah dibatasi kecil (`DB_POOL_MAX`, default 3).
- **Lokal MySQL masih bisa:** set `DB_DIALECT=mysql` + `DATABASE_URL` kosong di `backend/.env` untuk XAMPP; kode mendukung kedua dialect.
```
