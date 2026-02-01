-- ============================================
-- TUGAS 3: DATABASE SQL
-- Aplikasi Pembayaran Listrik Pascabayar
-- ============================================

-- Hapus database jika sudah ada (untuk testing)
DROP DATABASE IF EXISTS listrik_pascabayar;

-- Buat database baru
CREATE DATABASE listrik_pascabayar;

-- Gunakan database
USE listrik_pascabayar;

-- ============================================
-- 1. TABEL LEVEL (Privilege User)
-- ============================================
CREATE TABLE level (
    id_level INT PRIMARY KEY AUTO_INCREMENT,
    nama_level VARCHAR(50) NOT NULL UNIQUE,
    keterangan VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. TABEL USER (Admin & Pelanggan)
-- ============================================
CREATE TABLE user (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Akan di-hash dengan bcrypt
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    id_level INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (id_level) REFERENCES level(id_level) ON DELETE RESTRICT,
    
    -- Index untuk performa
    INDEX idx_username (username),
    INDEX idx_level (id_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. TABEL TARIF (Tarif Listrik per Daya)
-- ============================================
CREATE TABLE tarif (
    id_tarif INT PRIMARY KEY AUTO_INCREMENT,
    daya INT NOT NULL UNIQUE, -- 450, 900, 1300, 2200 watt
    tarif_per_kwh DECIMAL(10,2) NOT NULL, -- Harga per kWh
    biaya_beban DECIMAL(10,2) DEFAULT 0, -- Biaya beban/bulan
    keterangan VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_daya (daya)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. TABEL PELANGGAN
-- ============================================
CREATE TABLE pelanggan (
    id_pelanggan INT PRIMARY KEY AUTO_INCREMENT,
    nomor_meter VARCHAR(20) NOT NULL UNIQUE,
    nama_pelanggan VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    id_tarif INT NOT NULL,
    id_user INT, -- Link ke tabel user (untuk login pelanggan)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (id_tarif) REFERENCES tarif(id_tarif) ON DELETE RESTRICT,
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_nomor_meter (nomor_meter),
    INDEX idx_nama (nama_pelanggan),
    INDEX idx_tarif (id_tarif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. TABEL PENGGUNAAN (Penggunaan Listrik per Bulan)
-- ============================================
CREATE TABLE penggunaan (
    id_penggunaan INT PRIMARY KEY AUTO_INCREMENT,
    id_pelanggan INT NOT NULL,
    bulan INT NOT NULL, -- 1-12
    tahun INT NOT NULL,
    meter_awal INT NOT NULL,
    meter_akhir INT NOT NULL,
    jumlah_kwh INT GENERATED ALWAYS AS (meter_akhir - meter_awal) STORED, -- Computed column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE CASCADE,
    
    -- Unique constraint: 1 pelanggan hanya bisa punya 1 record per bulan/tahun
    UNIQUE KEY unique_pelanggan_bulan (id_pelanggan, bulan, tahun),
    
    -- Index
    INDEX idx_pelanggan (id_pelanggan),
    INDEX idx_bulan_tahun (bulan, tahun)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. TABEL TAGIHAN (Auto-generated via Trigger)
-- ============================================
CREATE TABLE tagihan (
    id_tagihan INT PRIMARY KEY AUTO_INCREMENT,
    id_penggunaan INT NOT NULL,
    id_pelanggan INT NOT NULL,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    jumlah_kwh INT NOT NULL,
    tarif_per_kwh DECIMAL(10,2) NOT NULL,
    biaya_beban DECIMAL(10,2) DEFAULT 0,
    total_tagihan DECIMAL(12,2) NOT NULL,
    status_bayar ENUM('Belum Bayar', 'Sudah Bayar') DEFAULT 'Belum Bayar',
    tanggal_bayar DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (id_penggunaan) REFERENCES penggunaan(id_penggunaan) ON DELETE CASCADE,
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE CASCADE,
    
    -- Index
    INDEX idx_pelanggan (id_pelanggan),
    INDEX idx_status (status_bayar),
    INDEX idx_bulan_tahun (bulan, tahun)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SELESAI! Database schema berhasil dibuat
-- ============================================

-- Tampilkan semua tabel
SHOW TABLES;
