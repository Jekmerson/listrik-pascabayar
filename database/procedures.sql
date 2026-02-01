-- ============================================
-- STORED PROCEDURES
-- ============================================

USE listrik_pascabayar;

-- ============================================
-- PROCEDURE 1: Menampilkan Pelanggan dengan Daya Tertentu
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_pelanggan_by_daya(
    IN p_daya INT
)
BEGIN
    SELECT 
        pel.id_pelanggan,
        pel.nomor_meter,
        pel.nama_pelanggan,
        pel.alamat,
        t.daya,
        t.tarif_per_kwh,
        t.biaya_beban,
        u.username,
        u.email,
        pel.created_at
    FROM 
        pelanggan pel
        INNER JOIN tarif t ON pel.id_tarif = t.id_tarif
        LEFT JOIN user u ON pel.id_user = u.id_user
    WHERE 
        t.daya = p_daya
    ORDER BY 
        pel.nama_pelanggan;
END$$

DELIMITER ;

-- ============================================
-- PROCEDURE 2: Tambah Data Penggunaan
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_tambah_penggunaan(
    IN p_id_pelanggan INT,
    IN p_bulan INT,
    IN p_tahun INT,
    IN p_meter_awal INT,
    IN p_meter_akhir INT,
    OUT p_status VARCHAR(100),
    OUT p_id_penggunaan INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_status = 'ERROR: Gagal menambah data penggunaan';
        SET p_id_penggunaan = 0;
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    -- Validasi: meter_akhir harus lebih besar dari meter_awal
    IF p_meter_akhir <= p_meter_awal THEN
        SET p_status = 'ERROR: Meter akhir harus lebih besar dari meter awal';
        SET p_id_penggunaan = 0;
        ROLLBACK;
    ELSE
        -- Insert data penggunaan
        INSERT INTO penggunaan (id_pelanggan, bulan, tahun, meter_awal, meter_akhir)
        VALUES (p_id_pelanggan, p_bulan, p_tahun, p_meter_awal, p_meter_akhir);
        
        SET p_id_penggunaan = LAST_INSERT_ID();
        SET p_status = 'SUCCESS: Data penggunaan berhasil ditambahkan';
        
        COMMIT;
    END IF;
END$$

DELIMITER ;

-- ============================================
-- PROCEDURE 3: Lihat Tagihan Pelanggan
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_lihat_tagihan_pelanggan(
    IN p_id_pelanggan INT,
    IN p_bulan INT,
    IN p_tahun INT
)
BEGIN
    SELECT 
        t.id_tagihan,
        pel.nomor_meter,
        pel.nama_pelanggan,
        t.bulan,
        t.tahun,
        CONCAT(
            CASE t.bulan
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
            t.tahun
        ) AS periode,
        t.jumlah_kwh,
        t.tarif_per_kwh,
        t.biaya_beban,
        t.total_tagihan,
        t.status_bayar,
        t.tanggal_bayar,
        t.created_at
    FROM 
        tagihan t
        INNER JOIN pelanggan pel ON t.id_pelanggan = pel.id_pelanggan
    WHERE 
        t.id_pelanggan = p_id_pelanggan
        AND (p_bulan IS NULL OR t.bulan = p_bulan)
        AND (p_tahun IS NULL OR t.tahun = p_tahun)
    ORDER BY 
        t.tahun DESC, t.bulan DESC;
END$$

DELIMITER ;

-- ============================================
-- PROCEDURE 4: Update Status Pembayaran
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_bayar_tagihan(
    IN p_id_tagihan INT,
    OUT p_status VARCHAR(100)
)
BEGIN
    DECLARE v_count INT;
    
    -- Cek apakah tagihan ada
    SELECT COUNT(*) INTO v_count FROM tagihan WHERE id_tagihan = p_id_tagihan;
    
    IF v_count = 0 THEN
        SET p_status = 'ERROR: Tagihan tidak ditemukan';
    ELSE
        UPDATE tagihan 
        SET 
            status_bayar = 'Sudah Bayar',
            tanggal_bayar = NOW()
        WHERE 
            id_tagihan = p_id_tagihan;
        
        SET p_status = 'SUCCESS: Tagihan berhasil dibayar';
    END IF;
END$$

DELIMITER ;

-- ============================================
-- TESTING STORED PROCEDURES
-- ============================================

-- Test 1: Cari pelanggan dengan daya 900 watt
CALL sp_pelanggan_by_daya(900);

-- Test 2: Tambah data penggunaan
SET @status = '';
SET @id_penggunaan = 0;
CALL sp_tambah_penggunaan(1, 2, 2026, 1150, 1300, @status, @id_penggunaan);
SELECT @status AS Status, @id_penggunaan AS ID_Penggunaan;

-- Test 3: Lihat tagihan pelanggan
CALL sp_lihat_tagihan_pelanggan(1, NULL, 2026);

-- Test 4: Bayar tagihan
SET @status_bayar = '';
CALL sp_bayar_tagihan(1, @status_bayar);
SELECT @status_bayar AS Status;

-- ============================================
-- SELESAI! Stored Procedures berhasil dibuat
-- ============================================
