/**
 * ============================================
 * DATABASE CONNECTION
 * Koneksi ke MySQL menggunakan Connection Pool
 * ============================================
 */

const mysql = require('mysql2');
require('dotenv').config();

/**
 * Membuat connection pool untuk performa yang lebih baik
 * Connection pool akan reuse koneksi yang sudah ada
 * daripada membuat koneksi baru setiap kali query
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'listrik_pascabayar',
    waitForConnections: true,
    connectionLimit: 10, // Maksimal 10 koneksi simultan
    queueLimit: 0, // Tidak ada limit antrian
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

/**
 * Menggunakan promise wrapper untuk async/await
 * Ini membuat kode lebih clean dan mudah dibaca
 */
const promisePool = pool.promise();

/**
 * Test koneksi database
 */
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully!');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        connection.release(); // Kembalikan koneksi ke pool
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); // Exit jika database tidak bisa connect
    }
};

module.exports = {
    pool,
    promisePool,
    testConnection
};
