-- ============================================
-- DATA SEEDING (DML)
-- Insert data awal untuk testing
-- ============================================

USE listrik_pascabayar;

-- ============================================
-- 1. INSERT DATA LEVEL
-- ============================================
INSERT INTO level (nama_level, keterangan) VALUES
('Admin', 'Administrator sistem dengan akses penuh'),
('Pelanggan', 'Pelanggan listrik yang dapat melihat tagihan');

-- ============================================
-- 2. INSERT DATA TARIF
-- ============================================
-- Tarif berdasarkan PLN 2024 (contoh)
INSERT INTO tarif (daya, tarif_per_kwh, biaya_beban, keterangan) VALUES
(450, 415.00, 0, 'Tarif subsidi 450 VA'),
(900, 1352.00, 0, 'Tarif 900 VA'),
(1300, 1444.70, 10000, 'Tarif 1300 VA'),
(2200, 1444.70, 15000, 'Tarif 2200 VA'),
(3500, 1699.53, 25000, 'Tarif 3500 VA'),
(5500, 1699.53, 40000, 'Tarif 5500 VA');

-- ============================================
-- 3. INSERT DATA USER
-- ============================================
-- Password: "admin123" dan "pelanggan123" (akan di-hash di aplikasi)
-- Untuk testing, kita pakai plain text dulu (JANGAN di production!)
INSERT INTO user (username, password, nama_lengkap, email, id_level) VALUES
('admin', 'admin123', 'Administrator', 'admin@listrik.com', 1),
('budi', 'pelanggan123', 'Budi Santoso', 'budi@email.com', 2),
('ani', 'pelanggan123', 'Ani Wijaya', 'ani@email.com', 2),
('citra', 'pelanggan123', 'Citra Dewi', 'citra@email.com', 2);

-- ============================================
-- 4. INSERT DATA PELANGGAN
-- ============================================
INSERT INTO pelanggan (nomor_meter, nama_pelanggan, alamat, id_tarif, id_user) VALUES
('MTR001', 'Budi Santoso', 'Jl. Merdeka No. 10, Jakarta', 2, 2),
('MTR002', 'Ani Wijaya', 'Jl. Sudirman No. 25, Bandung', 2, 3),
('MTR003', 'Citra Dewi', 'Jl. Gatot Subroto No. 5, Surabaya', 3, 4),
('MTR004', 'Dedi Kurniawan', 'Jl. Ahmad Yani No. 15, Semarang', 1, NULL),
('MTR005', 'Eka Putri', 'Jl. Diponegoro No. 30, Yogyakarta', 4, NULL);

-- ============================================
-- 5. INSERT DATA PENGGUNAAN
-- ============================================
-- Data penggunaan untuk bulan Januari 2026
INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir) VALUES
(1, 1, 2026, 1000, 1150), -- Budi: 150 kWh
(2, 1, 2026, 2000, 2200), -- Ani: 200 kWh
(3, 1, 2026, 1500, 1750), -- Citra: 250 kWh
(4, 1, 2026, 500, 580),   -- Dedi: 80 kWh
(5, 1, 2026, 3000, 3300); -- Eka: 300 kWh

-- Data penggunaan untuk bulan Desember 2025
INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir) VALUES
(1, 12, 2025, 850, 1000),  -- Budi: 150 kWh
(2, 12, 2025, 1800, 2000), -- Ani: 200 kWh
(3, 12, 2025, 1300, 1500); -- Citra: 200 kWh

-- ============================================
-- VERIFIKASI DATA
-- ============================================

-- Tampilkan semua data
SELECT 'LEVEL' as Tabel, COUNT(*) as Jumlah FROM level
UNION ALL
SELECT 'USER', COUNT(*) FROM user
UNION ALL
SELECT 'TARIF', COUNT(*) FROM tarif
UNION ALL
SELECT 'PELANGGAN', COUNT(*) FROM pelanggan
UNION ALL
SELECT 'PENGGUNAAN', COUNT(*) FROM penggunaan
UNION ALL
SELECT 'TAGIHAN', COUNT(*) FROM tagihan;

-- ============================================
-- SELESAI! Data berhasil di-insert
-- ============================================
