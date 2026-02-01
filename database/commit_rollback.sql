-- ============================================
-- COMMIT dan ROLLBACK Demo
-- ============================================

USE listrik_pascabayar;

-- ============================================
-- DEMO 1: COMMIT setelah Insert Tarif
-- ============================================

-- Mulai transaction
START TRANSACTION;

-- Insert data tarif baru
INSERT INTO tarif (daya, tarif_per_kwh, biaya_beban, keterangan)
VALUES (6600, 1699.53, 50000, 'Tarif 6600 VA');

-- Cek data sebelum commit
SELECT * FROM tarif WHERE daya = 6600;

-- COMMIT: Simpan perubahan secara permanen
COMMIT;

-- Verifikasi data sudah tersimpan
SELECT * FROM tarif WHERE daya = 6600;

-- ============================================
-- DEMO 2: ROLLBACK setelah Delete Pelanggan
-- ============================================

-- Cek data pelanggan sebelum delete
SELECT * FROM pelanggan WHERE id_pelanggan = 1;

-- Mulai transaction
START TRANSACTION;

-- Delete 1 data pelanggan
DELETE FROM pelanggan WHERE id_pelanggan = 1;

-- Cek data setelah delete (dalam transaction)
SELECT * FROM pelanggan WHERE id_pelanggan = 1;
-- Hasilnya: Data tidak ada (sudah dihapus)

-- ROLLBACK: Batalkan perubahan
ROLLBACK;

-- Verifikasi data kembali lagi
SELECT * FROM pelanggan WHERE id_pelanggan = 1;
-- Hasilnya: Data kembali ada! ✅

-- ============================================
-- DEMO 3: Transaction dengan Multiple Operations
-- ============================================

START TRANSACTION;

-- Operasi 1: Insert penggunaan
INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir)
VALUES (3, 2, 2026, 1750, 2000);

-- Operasi 2: Update status tagihan
UPDATE tagihan 
SET status_bayar = 'Sudah Bayar', tanggal_bayar = NOW()
WHERE id_pelanggan = 3 AND bulan = 1 AND tahun = 2026;

-- Cek hasil
SELECT * FROM penggunaan WHERE id_pelanggan = 3 AND bulan = 2;
SELECT * FROM tagihan WHERE id_pelanggan = 3 AND bulan = 1;

-- Jika semua OK, COMMIT
COMMIT;

-- Jika ada error, ROLLBACK
-- ROLLBACK;

-- ============================================
-- DEMO 4: Savepoint
-- ============================================

START TRANSACTION;

-- Insert data 1
INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir)
VALUES (4, 2, 2026, 580, 650);

-- Buat savepoint
SAVEPOINT sp1;

-- Insert data 2
INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir)
VALUES (5, 2, 2026, 3300, 3600);

-- Rollback ke savepoint (hanya batalkan insert data 2)
ROLLBACK TO SAVEPOINT sp1;

-- Commit (hanya insert data 1 yang tersimpan)
COMMIT;

-- ============================================
-- PENJELASAN
-- ============================================

/*
COMMIT:
- Menyimpan semua perubahan dalam transaction secara permanen
- Setelah COMMIT, data tidak bisa di-rollback
- Digunakan setelah yakin semua operasi berhasil

ROLLBACK:
- Membatalkan semua perubahan dalam transaction
- Mengembalikan data ke kondisi sebelum START TRANSACTION
- Digunakan jika ada error atau ingin membatalkan operasi

SAVEPOINT:
- Membuat checkpoint dalam transaction
- Bisa rollback ke savepoint tertentu tanpa rollback semua
- Berguna untuk transaction yang kompleks

BEST PRACTICES:
1. Selalu gunakan transaction untuk operasi yang critical
2. Gunakan try-catch untuk handle error
3. Commit hanya jika semua operasi berhasil
4. Rollback jika ada error
5. Gunakan savepoint untuk transaction kompleks
*/

-- ============================================
-- SELESAI! Demo COMMIT dan ROLLBACK
-- ============================================
