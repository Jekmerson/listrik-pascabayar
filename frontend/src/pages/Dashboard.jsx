/**
 * DASHBOARD PAGE
 */
import { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import api from '../utils/api';

function Dashboard() {
    const [stats, setStats] = useState({
        totalPelanggan: 0,
        totalPenggunaan: 0,
        totalTagihan: 0
    });
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.id_level === 1;

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Prepare params for customer filter
            const params = isAdmin ? {} : { id_pelanggan: user.id_pelanggan };

            // Fetch basic stats
            const pelangganRes = isAdmin ? await api.get('/pelanggan') : null;
            const penggunaanRes = await api.get('/penggunaan', { params });
            const tagihanRes = await api.get('/tagihan', { params });

            setStats({
                totalPelanggan: pelangganRes ? pelangganRes.data.data.length : 0,
                totalPenggunaan: penggunaanRes.data.data.length,
                totalTagihan: tagihanRes.data.data.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="container">
            <h1>Dashboard</h1>
            <p>Selamat datang, <strong>{user.nama_lengkap}</strong>!</p>

            <div className="stats-grid">
                {isAdmin && (
                    <div className="stat-card">
                        <h3>Total Pelanggan</h3>
                        <p className="stat-number">{stats.totalPelanggan}</p>
                    </div>
                )}
                <div className="stat-card">
                    <h3>Total Penggunaan</h3>
                    <p className="stat-number">{stats.totalPenggunaan}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Tagihan</h3>
                    <p className="stat-number">{stats.totalTagihan}</p>
                </div>
            </div>

            <div className="info-section">
                <h2>Informasi Akun</h2>
                <table className="info-table">
                    <tbody>
                        <tr>
                            <td><strong>Username:</strong></td>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <td><strong>Nama:</strong></td>
                            <td>{user.nama_lengkap}</td>
                        </tr>
                        <tr>
                            <td><strong>Email:</strong></td>
                            <td>{user.email || '-'}</td>
                        </tr>
                        <tr>
                            <td><strong>Role:</strong></td>
                            <td>{user.nama_level}</td>
                        </tr>
                        {user.nama_pelanggan && (
                            <tr>
                                <td><strong>Pelanggan:</strong></td>
                                <td>{user.nama_pelanggan}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
