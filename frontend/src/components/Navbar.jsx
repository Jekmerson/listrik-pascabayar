/**
 * NAVBAR COMPONENT
 */
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.id_level === 1;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>⚡ PowerPay</h2>
            </div>
            <div className="navbar-menu">
                <Link to="/dashboard">Dashboard</Link>
                {isAdmin && <Link to="/pelanggan">Pelanggan</Link>}
                <Link to="/penggunaan">Penggunaan</Link>
                <Link to="/tagihan">Tagihan</Link>
            </div>
            <div className="navbar-user">
                <span>👤 {user.nama_lengkap} ({user.nama_level})</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
