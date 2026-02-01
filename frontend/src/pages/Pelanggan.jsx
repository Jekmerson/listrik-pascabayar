/**
 * PELANGGAN PAGE - CRUD Pelanggan (Admin Only)
 */
import { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import api from '../utils/api';

function Pelanggan() {
    const [pelanggan, setPelanggan] = useState([]);
    const [tarif, setTarif] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        nomor_meter: '',
        nama_pelanggan: '',
        alamat: '',
        id_tarif: ''
    });

    useEffect(() => {
        fetchPelanggan();
        fetchTarif();
    }, []);

    const fetchPelanggan = async () => {
        try {
            const res = await api.get('/pelanggan');
            setPelanggan(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTarif = async () => {
        try {
            // Hardcode tarif untuk simplicity
            setTarif([
                { id_tarif: 1, daya: 450 },
                { id_tarif: 2, daya: 900 },
                { id_tarif: 3, daya: 1300 },
                { id_tarif: 4, daya: 2200 }
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.put(`/pelanggan/${currentId}`, formData);
                alert('Pelanggan berhasil diupdate!');
            } else {
                await api.post('/pelanggan', formData);
                alert('Pelanggan berhasil ditambahkan!');
            }
            setShowModal(false);
            resetForm();
            fetchPelanggan();
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    };

    const handleEdit = (item) => {
        setEditMode(true);
        setCurrentId(item.id_pelanggan);
        setFormData({
            nomor_meter: item.nomor_meter,
            nama_pelanggan: item.nama_pelanggan,
            alamat: item.alamat,
            id_tarif: item.id_tarif
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus pelanggan ini?')) {
            try {
                await api.delete(`/pelanggan/${id}`);
                alert('Pelanggan berhasil dihapus!');
                fetchPelanggan();
            } catch (error) {
                alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
            }
        }
    };

    const resetForm = () => {
        setFormData({ nomor_meter: '', nama_pelanggan: '', alamat: '', id_tarif: '' });
        setEditMode(false);
        setCurrentId(null);
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1>Data Pelanggan</h1>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary">
                    + Tambah Pelanggan
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>No. Meter</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Daya</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pelanggan.map((item) => (
                        <tr key={item.id_pelanggan}>
                            <td>{item.nomor_meter}</td>
                            <td>{item.nama_pelanggan}</td>
                            <td>{item.alamat}</td>
                            <td>{item.daya} W</td>
                            <td>
                                <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                                <button onClick={() => handleDelete(item.id_pelanggan)} className="btn-delete">Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{editMode ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nomor Meter</label>
                                <input
                                    type="text"
                                    value={formData.nomor_meter}
                                    onChange={(e) => setFormData({ ...formData, nomor_meter: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nama Pelanggan</label>
                                <input
                                    type="text"
                                    value={formData.nama_pelanggan}
                                    onChange={(e) => setFormData({ ...formData, nama_pelanggan: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Alamat</label>
                                <textarea
                                    value={formData.alamat}
                                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Daya Listrik</label>
                                <select
                                    value={formData.id_tarif}
                                    onChange={(e) => setFormData({ ...formData, id_tarif: e.target.value })}
                                    required
                                >
                                    <option value="">Pilih Daya</option>
                                    {tarif.map((t) => (
                                        <option key={t.id_tarif} value={t.id_tarif}>{t.daya} W</option>
                                    ))}
                                </select>
                            </div>
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

export default Pelanggan;
