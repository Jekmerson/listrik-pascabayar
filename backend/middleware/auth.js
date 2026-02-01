/**
 * ============================================
 * AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * Middleware untuk protect routes dan cek role user
 * ============================================
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware untuk verifikasi JWT token
 * Digunakan untuk protect routes yang butuh authentication
 */
const verifyToken = (req, res, next) => {
    // Ambil token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    // Jika tidak ada token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Simpan user info ke request object
        req.user = decoded;

        // Lanjut ke next middleware/route handler
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

/**
 * Middleware untuk cek apakah user adalah Admin
 * Harus digunakan setelah verifyToken
 */
const isAdmin = (req, res, next) => {
    // Cek apakah user sudah terverifikasi
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    // Cek apakah role adalah Admin (id_level = 1)
    if (req.user.id_level !== 1) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }

    next();
};

/**
 * Middleware untuk cek apakah user adalah Pelanggan
 * Harus digunakan setelah verifyToken
 */
const isPelanggan = (req, res, next) => {
    // Cek apakah user sudah terverifikasi
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    // Cek apakah role adalah Pelanggan (id_level = 2)
    if (req.user.id_level !== 2) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Pelanggan only.'
        });
    }

    next();
};

/**
 * Middleware untuk cek apakah user adalah Admin atau Pelanggan yang bersangkutan
 * Berguna untuk endpoint yang bisa diakses admin atau pelanggan sendiri
 */
const isAdminOrOwner = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    // Admin bisa akses semua
    if (req.user.id_level === 1) {
        return next();
    }

    // Pelanggan hanya bisa akses data sendiri
    const requestedPelangganId = parseInt(req.params.id_pelanggan || req.query.id_pelanggan);

    if (req.user.id_pelanggan === requestedPelangganId) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own data.'
    });
};

module.exports = {
    verifyToken,
    isAdmin,
    isPelanggan,
    isAdminOrOwner
};
