import { Link, useNavigate } from 'react-router-dom';
import "../App.css";

function Sidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.id_level === 1;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>⚡ PowerPay</h2>
            </div>
            <nav className="sidebar-menu">
                <Link to="/dashboard">Dashboard</Link>
                {isAdmin && <Link to="/pelanggan">Data Pelanggan</Link>}
                <Link to="/penggunaan">Penggunaan</Link>
                <Link to="/tagihan">Tagihan</Link>
                {isAdmin && <Link to="/users">Manajemen User</Link>}
                {isAdmin && <Link to="/algoritma">Algoritma (Demo)</Link>}
            </nav>
            <div className="sidebar-user">
                <span>👤 {user.nama_lengkap} ({user.nama_level})</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </aside>
    );
}

export default Sidebar;
