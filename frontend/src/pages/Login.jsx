/**
 * LOGIN PAGE
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });

            if (response.data.success) {
                // Simpan token dan user info
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                // Redirect ke dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Branding */}
            <div className="login-left">
                <div className="login-branding">
                    <div className="brand-icon">⚡</div>
                    <h1 className="brand-title">PowerPay</h1>
                    <p className="brand-subtitle">Electricity Payment System</p>
                    <div className="brand-features">
                        <div className="feature-item">
                            <span className="feature-icon">🔒</span>
                            <span>Secure & Encrypted</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⚡</span>
                            <span>Fast Payment</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <span>Real-time Tracking</span>
                        </div>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-right">
                <div className="login-box">
                    <div className="login-header">
                        <h2>Welcome Back!</h2>
                        <p>Login to manage your electricity payments</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                <span className="label-icon">👤</span>
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <span className="label-icon">🔑</span>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary btn-login" disabled={loading}>
                            {loading ? (
                                <span>
                                    <span className="spinner"></span>
                                    Loading...
                                </span>
                            ) : (
                                <span>
                                    Login
                                    <span className="btn-arrow">→</span>
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="login-info">
                        <div className="info-header">
                            <span className="info-icon">ℹ️</span>
                            <strong>Demo Credentials</strong>
                        </div>
                        <div className="credentials-grid">
                            <div className="credential-card">
                                <div className="credential-role">Admin</div>
                                <div className="credential-detail">admin / admin123</div>
                            </div>
                            <div className="credential-card">
                                <div className="credential-role">Customer</div>
                                <div className="credential-detail">budi / pelanggan123</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
