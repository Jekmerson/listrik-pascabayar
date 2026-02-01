-- ============================================
-- VIEW TABEL
-- Menampilkan informasi penggunaan listrik
-- ============================================

USE listrik_pascabayar;

-- ============================================
-- VIEW 1: Informasi Penggunaan Listrik Lengkap
-- ============================================
CREATE OR REPLACE VIEW view_penggunaan_listrik AS
SELECT 
    p.id_penggunaan,
    p.bulan,
    p.tahun,
    CONCAT(
        CASE p.bulan
            WHEN 1 THEN 'Januari'
            WHEN 2 THEN 'Februari'
            WHEN 3 THEN 'Maret'
            WHEN 4 THEN 'April'
            WHEN 5 THEN 'Mei'
            WHEN 6 THEN 'Juni'
            WHEN 7 THEN 'Juli'
            WHEN 8 THEN 'Agustus'
            WHEN 9 THEN 'September'
            WHEN 10 THEN 'Oktober'
            WHEN 11 THEN 'November'
            WHEN 12 THEN 'Desember'
        END,
        ' ',
        p.tahun
    ) AS periode,
    pel.id_pelanggan,
    pel.nomor_meter,
    pel.nama_pelanggan,
    pel.alamat,
    t.daya,
    t.tarif_per_kwh,
    t.biaya_beban,
    p.meter_awal,
    p.meter_akhir,
    p.jumlah_kwh,
    -- Hitung total tagihan
    (p.jumlah_kwh * t.tarif_per_kwh) + t.biaya_beban AS total_tagihan,
    p.created_at
FROM 
    penggunaan p
    INNER JOIN pelanggan pel ON p.id_pelanggan = pel.id_pelanggan
    INNER JOIN tarif t ON pel.id_tarif = t.id_tarif
ORDER BY 
    p.tahun DESC, p.bulan DESC, pel.nama_pelanggan;

-- ============================================
-- VIEW 2: Ringkasan Tagihan per Pelanggan
-- ============================================
CREATE OR REPLACE VIEW view_ringkasan_tagihan AS
SELECT 
    pel.id_pelanggan,
    pel.nomor_meter,
    pel.nama_pelanggan,
    t.daya,
    COUNT(p.id_penggunaan) AS total_bulan,
    SUM(p.jumlah_kwh) AS total_kwh,
    AVG(p.jumlah_kwh) AS rata_rata_kwh,
    MIN(p.jumlah_kwh) AS min_kwh,
    MAX(p.jumlah_kwh) AS max_kwh,
    SUM((p.jumlah_kwh * t.tarif_per_kwh) + t.biaya_beban) AS total_tagihan
FROM 
    pelanggan pel
    INNER JOIN tarif t ON pel.id_tarif = t.id_tarif
    LEFT JOIN penggunaan p ON pel.id_pelanggan = p.id_pelanggan
GROUP BY 
    pel.id_pelanggan, pel.nomor_meter, pel.nama_pelanggan, t.daya;

-- ============================================
-- VIEW 3: Pelanggan dengan Daya 900 Watt
-- ============================================
CREATE OR REPLACE VIEW view_pelanggan_900w AS
SELECT 
    pel.id_pelanggan,
    pel.nomor_meter,
    pel.nama_pelanggan,
    pel.alamat,
    t.daya,
    t.tarif_per_kwh,
    u.username,
    u.email
FROM 
    pelanggan pel
    INNER JOIN tarif t ON pel.id_tarif = t.id_tarif
    LEFT JOIN user u ON pel.id_user = u.id_user
WHERE 
    t.daya = 900;

-- ============================================
-- TESTING VIEW
-- ============================================

-- Test view_penggunaan_listrik
SELECT * FROM view_penggunaan_listrik LIMIT 5;

-- Test view_ringkasan_tagihan
SELECT * FROM view_ringkasan_tagihan;

-- Test view_pelanggan_900w
SELECT * FROM view_pelanggan_900w;

-- ============================================
-- SELESAI! View berhasil dibuat
-- ============================================
