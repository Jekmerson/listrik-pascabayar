-- Tambahkan field id_pelanggan ke tabel user
ALTER TABLE user ADD COLUMN id_pelanggan INT NULL AFTER id_level;

-- Tambahkan foreign key jika ingin relasi ke tabel pelanggan
ALTER TABLE user ADD CONSTRAINT fk_user_pelanggan FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE SET NULL;
