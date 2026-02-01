-- ============================================
-- TRIGGERS
-- ============================================

USE listrik_pascabayar;

-- ============================================
-- TRIGGER 1: Auto-generate Tagihan setelah Insert Penggunaan
-- ============================================
DELIMITER $$

CREATE TRIGGER trg_after_insert_penggunaan
AFTER INSERT ON penggunaan
FOR EACH ROW
BEGIN
    DECLARE v_tarif_per_kwh DECIMAL(10,2);
    DECLARE v_biaya_beban DECIMAL(10,2);
    DECLARE v_total_tagihan DECIMAL(12,2);
    
    -- Ambil tarif dari tabel pelanggan dan tarif
    SELECT t.tarif_per_kwh, t.biaya_beban
    INTO v_tarif_per_kwh, v_biaya_beban
    FROM pelanggan p
    INNER JOIN tarif t ON p.id_tarif = t.id_tarif
    WHERE p.id_pelanggan = NEW.id_pelanggan;
    
    -- Hitung total tagihan
    SET v_total_tagihan = (NEW.jumlah_kwh * v_tarif_per_kwh) + v_biaya_beban;
    
    -- Insert ke tabel tagihan
    INSERT INTO tagihan (
        id_penggunaan,
        id_pelanggan,
        bulan,
        tahun,
        jumlah_kwh,
        tarif_per_kwh,
        biaya_beban,
        total_tagihan,
        status_bayar
    ) VALUES (
        NEW.id_penggunaan,
        NEW.id_pelanggan,
        NEW.bulan,
        NEW.tahun,
        NEW.jumlah_kwh,
        v_tarif_per_kwh,
        v_biaya_beban,
        v_total_tagihan,
        'Belum Bayar'
    );
END$$

DELIMITER ;

-- ============================================
-- TRIGGER 2: Update Tagihan setelah Update Penggunaan
-- ============================================
DELIMITER $$

CREATE TRIGGER trg_after_update_penggunaan
AFTER UPDATE ON penggunaan
FOR EACH ROW
BEGIN
    DECLARE v_tarif_per_kwh DECIMAL(10,2);
    DECLARE v_biaya_beban DECIMAL(10,2);
    DECLARE v_total_tagihan DECIMAL(12,2);
    
    -- Ambil tarif dari tabel pelanggan dan tarif
    SELECT t.tarif_per_kwh, t.biaya_beban
    INTO v_tarif_per_kwh, v_biaya_beban
    FROM pelanggan p
    INNER JOIN tarif t ON p.id_tarif = t.id_tarif
    WHERE p.id_pelanggan = NEW.id_pelanggan;
    
    -- Hitung total tagihan baru
    SET v_total_tagihan = (NEW.jumlah_kwh * v_tarif_per_kwh) + v_biaya_beban;
    
    -- Update tagihan yang terkait
    UPDATE tagihan
    SET 
        jumlah_kwh = NEW.jumlah_kwh,
        tarif_per_kwh = v_tarif_per_kwh,
        biaya_beban = v_biaya_beban,
        total_tagihan = v_total_tagihan
    WHERE 
        id_penggunaan = NEW.id_penggunaan;
END$$

DELIMITER ;

-- ============================================
-- TRIGGER 3: Log sebelum Delete Pelanggan
-- ============================================

-- Buat tabel log terlebih dahulu
CREATE TABLE IF NOT EXISTS log_delete_pelanggan (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    id_pelanggan INT,
    nomor_meter VARCHAR(20),
    nama_pelanggan VARCHAR(100),
    alamat TEXT,
    deleted_by VARCHAR(50),
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER $$

CREATE TRIGGER trg_before_delete_pelanggan
BEFORE DELETE ON pelanggan
FOR EACH ROW
BEGIN
    -- Simpan data pelanggan yang akan dihapus ke tabel log
    INSERT INTO log_delete_pelanggan (
        id_pelanggan,
        nomor_meter,
        nama_pelanggan,
        alamat,
        deleted_by
    ) VALUES (
        OLD.id_pelanggan,
        OLD.nomor_meter,
        OLD.nama_pelanggan,
        OLD.alamat,
        USER() -- MySQL user yang menjalankan query
    );
END$$

DELIMITER ;

-- ============================================
-- TESTING TRIGGERS
-- ============================================

-- Test 1: Insert penggunaan baru (akan auto-generate tagihan)
INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir)
VALUES (2, 2, 2026, 2200, 2400); -- Ani: 200 kWh

-- Cek apakah tagihan otomatis terbuat
SELECT * FROM tagihan WHERE id_pelanggan = 2 AND bulan = 2 AND tahun = 2026;

-- Test 2: Update penggunaan (akan update tagihan)
UPDATE penggunaan 
SET meter_akhir = 2450 
WHERE id_pelanggan = 2 AND bulan = 2 AND tahun = 2026;

-- Cek apakah tagihan terupdate
SELECT * FROM tagihan WHERE id_pelanggan = 2 AND bulan = 2 AND tahun = 2026;

-- Test 3: Delete pelanggan (akan log ke tabel)
-- JANGAN JALANKAN INI kecuali untuk testing!
-- DELETE FROM pelanggan WHERE id_pelanggan = 5;
-- SELECT * FROM log_delete_pelanggan;

-- ============================================
-- SELESAI! Triggers berhasil dibuat
-- ============================================
