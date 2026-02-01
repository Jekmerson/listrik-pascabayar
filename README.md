# Listrik Pascabayar – Ready to Use

Aplikasi pembayaran listrik pascabayar dengan backend Express + MySQL dan frontend React + Vite.

## Prasyarat
- Node.js 20.19+ (disarankan Node 22)
- MySQL 8+

## Quick Start

### 1) Setup Database
Jalankan skrip berikut untuk membuat schema + seed data:

```
./scripts/db-init.sh
```

> Skrip ini memakai konfigurasi dari backend/.env. Pastikan kredensial DB sudah benar.

### 2) Jalankan Backend
```
cd backend
npm install
npm run dev
```

Backend akan berjalan di http://localhost:5000

### 3) Jalankan Frontend
```
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di http://localhost:5173

## Akun Demo
- Admin: `admin / admin123`
- Pelanggan: `budi / pelanggan123`

## Struktur Penting
- Database scripts: database/
- Backend: backend/
- Frontend: frontend/

## Konfigurasi Environment

### Backend
File: backend/.env (contoh di backend/.env.example)

### Frontend
File: frontend/.env (opsional). Default API: http://localhost:5000/api
Contoh: frontend/.env.example

## Catatan Keamanan
- Password di seed masih plain text untuk demo.
- Untuk production, aktifkan hashing bcrypt pada create/login.
