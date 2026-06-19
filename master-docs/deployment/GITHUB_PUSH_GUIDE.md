# GitHub Push Guide - SaduX Company Profile

> Repository: `https://github.com/Elysian-ibay/Sadux-CompanyProfileSadux.git`

---

## Prerequisites

- Git terinstall (`git --version`)
- Punya akses ke repository GitHub di atas
- GitHub CLI (`gh`) atau akses Personal Access Token

---

## Step 1: Setup .gitignore (PENTING!)

Sebelum push, pastikan file `.gitignore` sudah ada di root project agar file sensitif tidak ikut ter-push.

Buat file `.gitignore` di root `SaduX-CompanyProfileSaduX/`:

```gitignore
# Dependencies
node_modules/

# Environment variables (JANGAN PERNAH PUSH!)
.env
.env.local
.env.production

# Build output
dist/
dist-ssr/
build/

# Logs
logs/
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Uploads (jangan push file uploads user)
backend/uploads/*
!backend/uploads/.gitkeep
```

---

## Step 2: Buat .env.example (Template untuk developer lain)

Buat file `backend/.env.example`:

```env
PORT=5202
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sadux_companyprofile_db
DB_USER=root
DB_PASS=
JWT_SECRET=your_jwt_secret_here
CLIENT_ORIGIN=http://localhost:5203
UPLOAD_DIR=./uploads
API_URL=http://localhost:5202
```

---

## Step 3: Initialize Git & Push

### Opsi A: Fresh Push (Belum ada git di folder ini)

```bash
# Masuk ke folder project
cd D:/Kojay/Developer/SaduX/development/SaduX-CompanyProfileSaduX

# Initialize git baru
git init

# Set remote ke repository baru
git remote add origin https://github.com/Elysian-ibay/Sadux-CompanyProfileSadux.git

# Add semua file (gitignore akan exclude yang tidak perlu)
git add .

# Commit pertama
git commit -m "Initial commit - SaduX Company Profile CMS

- Full dynamic landing page with admin panel
- Backend: Express + Sequelize + MySQL
- Frontend: React 19 + Vite 7 + TailwindCSS 4
- Features: Dynamic content, themes, backgrounds, analytics
- Models: User, Product, Feature, Statistic, Testimonial, FAQ, GeneralSetting"

# Push ke GitHub
git branch -M main
git push -u origin main
```

### Opsi B: Ganti Remote (Sudah ada git tapi remote lain)

```bash
cd D:/Kojay/Developer/SaduX/development/SaduX-CompanyProfileSaduX

# Cek remote saat ini
git remote -v

# Hapus remote lama jika perlu
git remote remove origin

# Tambah remote baru
git remote add origin https://github.com/Elysian-ibay/Sadux-CompanyProfileSadux.git

# Pastikan .gitignore sudah benar
# Lalu add + commit + push
git add .
git commit -m "Initial commit - SaduX Company Profile CMS"
git branch -M main
git push -u origin main
```

### Opsi C: Menggunakan GitHub CLI

```bash
cd D:/Kojay/Developer/SaduX/development/SaduX-CompanyProfileSaduX

# Login (jika belum)
gh auth login

# Initialize dan push
git init
git add .
git commit -m "Initial commit - SaduX Company Profile CMS"
git branch -M main
git remote add origin https://github.com/Elysian-ibay/Sadux-CompanyProfileSadux.git
git push -u origin main
```

---

## Step 4: Verifikasi

```bash
# Cek status
git status

# Cek remote
git remote -v
# Harus tampil: origin  https://github.com/Elysian-ibay/Sadux-CompanyProfileSadux.git

# Cek log
git log --oneline -5
```

Buka browser dan buka:
`https://github.com/Elysian-ibay/Sadux-CompanyProfileSadux`

---

## Folder Structure yang Akan Ter-push

```
SaduX-CompanyProfileSaduX/
├── .gitignore
├── implementation_plan.md
├── implementation_plan_v2.md
├── master-docs/
│   ├── MASTER_SUMMARY.md
│   ├── MASTER_CHANGELOG.md
│   ├── database/
│   │   └── DATABASE_SCHEMA.md
│   └── deployment/
│       ├── GITHUB_PUSH_GUIDE.md
│       └── DEPLOYMENT_GUIDE.md
├── backend/
│   ├── .env.example          (template, BUKAN .env asli)
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   └── uploads/
│       └── .gitkeep
└── frontend/
    ├── .gitignore
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── components/
        ├── layouts/
        ├── lib/
        ├── pages/
        └── main.jsx
```

---

## File yang TIDAK Boleh Ter-push

| File | Alasan |
|---|---|
| `backend/.env` | Berisi password DB, JWT secret, email credentials |
| `node_modules/` | Dependencies, install ulang via `npm install` |
| `dist/` / `build/` | Build output, generate ulang via `npm run build` |
| `backend/uploads/*` | File upload user, tidak perlu di repo |

---

## Tips: Push Update Selanjutnya

```bash
# Setelah ada perubahan
git add .
git commit -m "feat: deskripsi perubahan"
git push
```

### Commit Message Convention

```
feat:     fitur baru
fix:      bug fix
docs:     perubahan dokumentasi
style:    formatting, tidak ada perubahan logic
refactor: refactoring code
chore:    maintenance (dependencies, config)
```
