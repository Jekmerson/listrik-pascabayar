

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const algoritmaRoutes = require('./routes/algoritma');
const pelangganRoutes = require('./routes/pelanggan');
const penggunaanRoutes = require('./routes/penggunaan');
const tagihanRoutes = require('./routes/tagihan');
const userRoutes = require('./routes/userRoutes');

// Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow frontend to access API
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (like curl/Postman)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));

// Body parser - Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (simple)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Pembayaran Listrik Pascabayar',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            pelanggan: '/api/pelanggan',
            penggunaan: '/api/penggunaan',
            tagihan: '/api/tagihan'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/algoritma', algoritmaRoutes);
app.use('/api/pelanggan', pelangganRoutes);
app.use('/api/penggunaan', penggunaanRoutes);
app.use('/api/tagihan', tagihanRoutes);
app.use('/api/users', userRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
    try {
        // Test database connection
        await testConnection();

        // Start listening
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('🚀 Server is running!');
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

module.exports = app;

/**
 * @file server.js
 * @module server
 * @description Entry point aplikasi Express.js untuk API Pembayaran Listrik Pascabayar.
 *
 * Modul ini menginisialisasi server Express, mengatur middleware, routing, error handling,
 * dan menjalankan server pada port yang ditentukan. Semua endpoint utama API didaftarkan di sini.
 *
 * @author Izza Rahmat Sanjaya
 * @date 2026-02-01
 */

// ...existing code...
