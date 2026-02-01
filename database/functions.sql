-- ============================================
-- FUNCTIONS
-- ============================================

USE listrik_pascabayar;

-- ============================================
-- FUNCTION 1: Hitung Total Penggunaan Listrik per Bulan
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_total_penggunaan_bulan(
    p_bulan INT,
    p_tahun INT
) 
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total INT;
    
    SELECT COALESCE(SUM(jumlah_kwh), 0) INTO v_total
    FROM penggunaan
    WHERE bulan = p_bulan AND tahun = p_tahun;
    
    RETURN v_total;
END$$

DELIMITER ;

-- ============================================
-- FUNCTION 2: Hitung Total Penggunaan per Pelanggan
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_total_penggunaan_pelanggan(
    p_id_pelanggan INT,
    p_tahun INT
) 
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total INT;
    
    SELECT COALESCE(SUM(jumlah_kwh), 0) INTO v_total
    FROM penggunaan
    WHERE id_pelanggan = p_id_pelanggan 
    AND (p_tahun IS NULL OR tahun = p_tahun);
    
    RETURN v_total;
END$$

DELIMITER ;

-- ============================================
-- FUNCTION 3: Hitung Total Tagihan per Pelanggan
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_total_tagihan_pelanggan(
    p_id_pelanggan INT,
    p_tahun INT
) 
RETURNS DECIMAL(12,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(12,2);
    
    SELECT COALESCE(SUM(total_tagihan), 0) INTO v_total
    FROM tagihan
    WHERE id_pelanggan = p_id_pelanggan 
    AND (p_tahun IS NULL OR tahun = p_tahun);
    
    RETURN v_total;
END$$

DELIMITER ;

-- ============================================
-- FUNCTION 4: Hitung Rata-rata Penggunaan per Pelanggan
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_rata_rata_penggunaan(
    p_id_pelanggan INT
) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_rata DECIMAL(10,2);
    
    SELECT COALESCE(AVG(jumlah_kwh), 0) INTO v_rata
    FROM penggunaan
    WHERE id_pelanggan = p_id_pelanggan;
    
    RETURN v_rata;
END$$

DELIMITER ;

-- ============================================
-- FUNCTION 5: Format Rupiah
-- ============================================
DELIMITER $$

CREATE FUNCTION fn_format_rupiah(
    p_nominal DECIMAL(12,2)
) 
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    RETURN CONCAT('Rp ', FORMAT(p_nominal, 0, 'id_ID'));
END$$

DELIMITER ;

-- ============================================
-- TESTING FUNCTIONS
-- ============================================

-- Test 1: Total penggunaan bulan Januari 2026
SELECT fn_total_penggunaan_bulan(1, 2026) AS 'Total kWh Januari 2026';

-- Test 2: Total penggunaan pelanggan ID 1 tahun 2026
SELECT fn_total_penggunaan_pelanggan(1, 2026) AS 'Total kWh Pelanggan 1';

-- Test 3: Total tagihan pelanggan ID 1
SELECT fn_total_tagihan_pelanggan(1, 2026) AS 'Total Tagihan';

-- Test 4: Rata-rata penggunaan pelanggan ID 1
SELECT fn_rata_rata_penggunaan(1) AS 'Rata-rata kWh';

-- Test 5: Format rupiah
SELECT fn_format_rupiah(1500000) AS 'Formatted';

-- ============================================
-- CONTOH PENGGUNAAN DALAM QUERY
-- ============================================

-- Tampilkan pelanggan dengan total penggunaan dan tagihan
SELECT 
    p.id_pelanggan,
    p.nama_pelanggan,
    fn_total_penggunaan_pelanggan(p.id_pelanggan, 2026) AS total_kwh_2026,
    fn_rata_rata_penggunaan(p.id_pelanggan) AS rata_rata_kwh,
    fn_format_rupiah(fn_total_tagihan_pelanggan(p.id_pelanggan, 2026)) AS total_tagihan_2026
FROM 
    pelanggan p
ORDER BY 
    p.nama_pelanggan;

-- ============================================
-- SELESAI! Functions berhasil dibuat
-- ============================================
