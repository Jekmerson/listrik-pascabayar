/**
 * USER MANAGEMENT PAGE - CRUD Users (Admin Only)
 */
import { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import api from '../utils/api';

function Users() {
    const [users, setUsers] = useState([]);
    const [pelanggan, setPelanggan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id_user: '',
        username: '',
        password: '',
        nama_lengkap: '',
        email: '',
        id_level: '2',
        id_pelanggan: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchPelanggan();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPelanggan = async () => {
        try {
            const res = await api.get('/pelanggan');
            setPelanggan(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/users/${formData.id_user}`, formData);
                alert('User berhasil diupdate!');
            } else {
                // Buat objek tanpa id_pelanggan jika kosong
                const payload = { ...formData };
                if (!payload.id_pelanggan) delete payload.id_pelanggan;
                await api.post('/users', payload);
                alert('User berhasil ditambahkan!');
            }
            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    };

    const handleEdit = (user) => {
        setFormData({
            id_user: user.id_user,
            username: user.username,
            password: '',
            nama_lengkap: user.nama_lengkap,
            email: user.email || '',
            id_level: user.id_level,
            id_pelanggan: user.id_pelanggan || ''
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus user ini?')) {
            try {
                await api.delete(`/users/${id}`);
                alert('User berhasil dihapus!');
                fetchUsers();
            } catch (error) {
                alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id_user: '',
            username: '',
            password: '',
            nama_lengkap: '',
            email: '',
            id_level: '2',
            id_pelanggan: ''
        });
        setEditMode(false);
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Manajemen User</h1>
                <button onClick={openAddModal} className="btn-primary">
                    + Tambah User
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Nama Lengkap</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Pelanggan</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id_user}>
                            <td>{user.username}</td>
                            <td>{user.nama_lengkap}</td>
                            <td>{user.email || '-'}</td>
                            <td>
                                <span className={`badge ${user.id_level === 1 ? 'badge-success' : 'badge-warning'}`}>
                                    {user.nama_level}
                                </span>
                            </td>
                            <td>{user.nama_pelanggan || '-'}</td>
                            <td>
                                <button onClick={() => handleEdit(user)} className="btn-edit">Edit</button>
                                {user.id_level !== 1 && (
                                    <button onClick={() => handleDelete(user.id_user)} className="btn-delete">Hapus</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{editMode ? 'Edit User' : 'Tambah User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password {editMode && '(kosongkan jika tidak diubah)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editMode}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.nama_lengkap}
                                    onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    value={formData.id_level}
                                    onChange={(e) => setFormData({ ...formData, id_level: e.target.value })}
                                    required
                                >
                                    <option value="1">Admin</option>
                                    <option value="2">Pelanggan</option>
                                </select>
                            </div>
                            {/* Field Pelanggan dihilangkan, user admin tidak perlu memilih pelanggan saat membuat user baru */}
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Simpan</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
