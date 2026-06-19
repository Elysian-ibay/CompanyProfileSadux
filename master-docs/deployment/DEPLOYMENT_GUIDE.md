# Deployment Guide - Vercel (Frontend) + Supabase (Database)

> Deploy SaduX Company Profile dengan frontend di Vercel dan database di Supabase (PostgreSQL).

---

## Architecture Overview

```
[User Browser]
      |
      v
[Vercel - Frontend]  <---->  [Backend Server (VPS/Railway/Render)]
   React SPA                        Express.js API
                                         |
                                         v
                                  [Supabase - PostgreSQL]
                                     Database
```

> **Catatan Penting:** Vercel hanya hosting static/frontend. Backend (Express.js) perlu host terpisah (VPS yang sudah ada, Railway, atau Render). Supabase menggantikan MySQL sebagai database.

---

## Part 1: Setup Supabase (Database)

### Step 1: Buat Akun & Project

1. Buka https://supabase.com dan sign up / login
2. Klik **"New Project"**
3. Isi:
   - **Name:** `sadux-companyprofile`
   - **Database Password:** *(catat password ini!)*
   - **Region:** Southeast Asia (Singapore) - terdekat ke Indonesia
4. Klik **"Create new project"** dan tunggu selesai

### Step 2: Dapatkan Connection String

1. Di dashboard Supabase, buka **Settings > Database**
2. Scroll ke **"Connection string"** section
3. Pilih tab **"URI"** dan copy connection string:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. Catat juga individual values:
   - **Host:** `aws-0-ap-southeast-1.pooler.supabase.com`
   - **Port:** `6543` (untuk pooler/transaction mode) atau `5432` (direct)
   - **Database:** `postgres`
   - **User:** `postgres.[PROJECT_REF]`
   - **Password:** *(password yang kamu buat)*

### Step 3: Ubah Backend dari MySQL ke PostgreSQL

Backend saat ini pakai `mysql2` + Sequelize. Perlu migrasi ke `pg` (PostgreSQL driver).

#### 3a. Install PostgreSQL driver

```bash
cd backend
npm uninstall mysql2
npm install pg pg-hstore
```

#### 3b. Update `backend/config/database.js`

```javascript
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',       // <-- Ubah dari 'mysql' ke 'postgres'
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

module.exports = sequelize;
```

#### 3c. Update `backend/.env` untuk Supabase

```env
PORT=5202
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.YOUR_PROJECT_REF
DB_PASS=YOUR_SUPABASE_PASSWORD
JWT_SECRET=your_strong_jwt_secret
CLIENT_ORIGIN=https://your-app.vercel.app
UPLOAD_DIR=./uploads
API_URL=https://your-backend-domain.com
```

#### 3d. Migrasi / Sync Tables

```bash
# Buat tables di Supabase
cd backend
node scripts/migrate.js
```

Sequelize akan auto-create semua tables (Users, Products, Features, dll) di PostgreSQL Supabase.

### Step 4: Verifikasi di Supabase Dashboard

1. Buka Supabase Dashboard > **Table Editor**
2. Pastikan semua 9 tables sudah muncul:
   - Users, Products, LandingPageContents, Features, Statistics
   - Testimonials, Faqs, GeneralSettings, Visitors

### Step 5: Seed Data Awal (Optional)

```bash
# Jika ada seed script
cd backend
node seed.js

# Atau manual via API setelah backend running:
# 1. Register admin: POST /api/auth/register
# 2. Login: POST /api/auth/login
# 3. Isi content via admin panel
```

---

## Part 2: Deploy Backend

> Backend Express.js perlu server yang bisa run Node.js. Pilih salah satu:

### Option A: Tetap di VPS yang Sudah Ada (103.150.117.84)

Jika VPS sudah running, cukup update `.env` dengan Supabase credentials dan restart:

```bash
# SSH ke server
ssh user@103.150.117.84

# Masuk ke folder project
cd /home/Stegyr/zaiba/SaduX/development/SaduX-CompanyProfile/backend

# Update .env dengan Supabase credentials
nano .env

# Install pg driver
npm install pg pg-hstore
npm uninstall mysql2

# Restart
pm2 restart sadux-api
```

### Option B: Deploy ke Railway (Recommended - Free tier)

1. Buka https://railway.app dan login via GitHub
2. Klik **"New Project"** > **"Deploy from GitHub repo"**
3. Pilih repository `Elysian-ibay/Sadux-CompanyProfileSadux`
4. Set **Root Directory:** `backend`
5. Tambahkan environment variables:
   ```
   PORT=5202
   DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
   DB_PORT=6543
   DB_NAME=postgres
   DB_USER=postgres.YOUR_PROJECT_REF
   DB_PASS=YOUR_SUPABASE_PASSWORD
   JWT_SECRET=your_strong_jwt_secret
   CLIENT_ORIGIN=https://your-app.vercel.app
   ```
6. Railway auto-detect Node.js dan run `npm start`
7. Catat URL yang diberikan Railway (e.g. `https://sadux-api-production.up.railway.app`)

### Option C: Deploy ke Render (Free tier)

1. Buka https://render.com dan login
2. **New** > **Web Service** > Connect GitHub repo
3. Settings:
   - **Name:** `sadux-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Tambahkan environment variables (sama seperti Railway)
5. Catat URL yang diberikan Render

---

## Part 3: Deploy Frontend ke Vercel

### Step 1: Persiapan Frontend

#### 1a. Update API Base URL

Edit `frontend/src/lib/api.js` untuk gunakan environment variable:

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5202/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

#### 1b. Buat `.env.production` di `frontend/`

```env
VITE_API_URL=https://your-backend-url.com/api
```

### Step 2: Deploy ke Vercel

#### Opsi A: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy dari folder frontend
cd frontend
vercel

# Jawab pertanyaan:
# - Set up and deploy? Y
# - Which scope? (pilih akun)
# - Link to existing project? N
# - Project name: sadux-companyprofile
# - Directory: ./
# - Override settings? N
```

#### Opsi B: Via Vercel Dashboard (Recommended)

1. Buka https://vercel.com dan login via GitHub
2. Klik **"Add New Project"**
3. **Import** repository `Elysian-ibay/Sadux-CompanyProfileSadux`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables** - tambahkan:
   ```
   VITE_API_URL = https://your-backend-url.com/api
   ```
6. Klik **"Deploy"**

### Step 3: Setup Custom Domain (Optional)

1. Di Vercel Dashboard > Project > **Settings** > **Domains**
2. Add domain: `sadux.my.id`
3. Vercel akan memberikan DNS records yang perlu ditambahkan:
   - **Type:** CNAME
   - **Name:** `@` atau subdomain
   - **Value:** `cname.vercel-dns.com`
4. Atau jika pakai A record:
   - **Type:** A
   - **Value:** `76.76.21.21`

---

## Part 4: Update CORS di Backend

Setelah semua ter-deploy, update `CLIENT_ORIGIN` di backend `.env`:

```env
CLIENT_ORIGIN=https://sadux.my.id,https://sadux-companyprofile.vercel.app
```

Dan pastikan `server.js` CORS config sudah benar:

```javascript
app.use(cors({
    origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*',
    credentials: true
}));
```

---

## Environment Variables Checklist

### Backend (.env)

| Variable | Value | Description |
|---|---|---|
| `PORT` | `5202` | Port backend server |
| `DB_HOST` | `aws-0-ap-southeast-1.pooler.supabase.com` | Supabase host |
| `DB_PORT` | `6543` | Supabase pooler port |
| `DB_NAME` | `postgres` | Supabase database name |
| `DB_USER` | `postgres.YOUR_REF` | Supabase user |
| `DB_PASS` | `***` | Supabase password |
| `JWT_SECRET` | `***` | JWT signing secret |
| `CLIENT_ORIGIN` | `https://sadux.my.id` | CORS allowed origins |
| `UPLOAD_DIR` | `./uploads` | Path untuk file uploads |
| `API_URL` | `https://api.sadux.my.id` | Public API URL |

### Frontend (Vercel Environment Variables)

| Variable | Value | Description |
|---|---|---|
| `VITE_API_URL` | `https://api.sadux.my.id/api` | Backend API endpoint |

---

## Post-Deployment Checklist

- [ ] Supabase project dibuat, tables ter-sync
- [ ] Backend running dan bisa connect ke Supabase
- [ ] Frontend ter-deploy di Vercel
- [ ] `VITE_API_URL` mengarah ke backend yang benar
- [ ] CORS `CLIENT_ORIGIN` sudah include Vercel domain
- [ ] Test: Buka landing page, konten muncul dari API
- [ ] Test: Login admin panel, CRUD berfungsi
- [ ] Test: Upload gambar product berfungsi
- [ ] Custom domain ter-setup (jika ada)
- [ ] SSL/HTTPS aktif (Vercel & backend)

---

## Troubleshooting

### Error: "CORS blocked"
- Pastikan `CLIENT_ORIGIN` di backend `.env` include domain Vercel
- Restart backend setelah ubah `.env`

### Error: "connection refused" di Supabase
- Cek apakah pakai port `6543` (pooler) bukan `5432`
- Pastikan SSL enabled di `dialectOptions`
- Cek IP whitelist di Supabase: Settings > Database > Network restrictions

### Error: "relation does not exist"
- Jalankan `node scripts/migrate.js` untuk create tables
- Atau set `alter: true` di Sequelize sync

### Frontend blank setelah deploy
- Cek Vercel build logs untuk error
- Pastikan `VITE_API_URL` di-set SEBELUM build (harus rebuild setelah tambah env var)
- Vercel > Deployments > klik "..." > Redeploy

### Gambar product tidak muncul
- File uploads disimpan di backend server, bukan Vercel
- Pastikan `API_URL` dan `UPLOAD_DIR` benar
- Untuk production, pertimbangkan Supabase Storage atau Cloudinary untuk file hosting
