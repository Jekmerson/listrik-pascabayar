/**
 * PENGGUNAAN PAGE - CRUD Penggunaan Listrik
 */
import { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import api from '../utils/api';

function Penggunaan() {
    const [penggunaan, setPenggunaan] = useState([]);
    const [pelanggan, setPelanggan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id_pelanggan: '',
        bulan: '',
        tahun: new Date().getFullYear(),
        meter_awal: '',
        meter_akhir: ''
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPelanggan = user.id_level === 2;
    const canEdit = !isPelanggan;

    useEffect(() => {
        fetchPenggunaan();
        if (!isPelanggan) {
            fetchPelanggan();
        }
    }, []);

    const fetchPenggunaan = async () => {
        try {
            const params = isPelanggan ? { id_pelanggan: user.id_pelanggan } : {};
            const res = await api.get('/penggunaan', { params });
            setPenggunaan(res.data.data);
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
            await api.post('/penggunaan', formData);
            alert('Data penggunaan berhasil ditambahkan! Tagihan otomatis dibuat.');
            setShowModal(false);
            resetForm();
            fetchPenggunaan();
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus data ini?')) {
            try {
                await api.delete(`/penggunaan/${id}`);
                alert('Data berhasil dihapus!');
                fetchPenggunaan();
            } catch (error) {
                alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
            }
        }
    };

    const resetForm = () => {
        setFormData({
            id_pelanggan: '',
            bulan: '',
            tahun: new Date().getFullYear(),
            meter_awal: '',
            meter_akhir: ''
        });
    };

    const bulanOptions = [
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' }
    ];

    return (
        <div className="container">
            <div className="page-header">
                <h1>Data Penggunaan Listrik</h1>
                {canEdit && (
                    <button onClick={() => setShowModal(true)} className="btn-primary">
                        + Tambah Penggunaan
                    </button>
                )}
            </div>

            {isPelanggan && (
                <div className="alert">
                    Data penggunaan bersifat read-only untuk pelanggan.
                </div>
            )}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Periode</th>
                        <th>Pelanggan</th>
                        <th>Meter Awal</th>
                        <th>Meter Akhir</th>
                        <th>Jumlah kWh</th>
                        <th>Total Tagihan</th>
                        {canEdit && <th>Aksi</th>}
                    </tr>
                </thead>
                <tbody>
                    {penggunaan.map((item) => (
                        <tr key={item.id_penggunaan}>
                            <td>{item.periode}</td>
                            <td>{item.nama_pelanggan}</td>
                            <td>{item.meter_awal}</td>
                            <td>{item.meter_akhir}</td>
                            <td>{item.jumlah_kwh} kWh</td>
                            <td>Rp {item.total_tagihan ? parseInt(item.total_tagihan).toLocaleString('id-ID') : '0'}</td>
                            {canEdit && (
                                <td>
                                    <button onClick={() => handleDelete(item.id_penggunaan)} className="btn-delete">Hapus</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && canEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Tambah Penggunaan Listrik</h2>
                        <form onSubmit={handleSubmit}>
                            {!isPelanggan && (
                                <div className="form-group">
                                    <label>Pelanggan</label>
                                    <select
                                        value={formData.id_pelanggan}
                                        onChange={(e) => setFormData({ ...formData, id_pelanggan: e.target.value })}
                                        required
                                    >
                                        <option value="">Pilih Pelanggan</option>
                                        {pelanggan.map((p) => (
                                            <option key={p.id_pelanggan} value={p.id_pelanggan}>
                                                {p.nama_pelanggan} - {p.nomor_meter}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Bulan</label>
                                <select
                                    value={formData.bulan}
                                    onChange={(e) => setFormData({ ...formData, bulan: e.target.value })}
                                    required
                                >
                                    <option value="">Pilih Bulan</option>
                                    {bulanOptions.map((b) => (
                                        <option key={b.value} value={b.value}>{b.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tahun</label>
                                <input
                                    type="number"
                                    value={formData.tahun}
                                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Meter Awal</label>
                                <input
                                    type="number"
                                    value={formData.meter_awal}
                                    onChange={(e) => setFormData({ ...formData, meter_awal: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Meter Akhir</label>
                                <input
                                    type="number"
                                    value={formData.meter_akhir}
                                    onChange={(e) => setFormData({ ...formData, meter_akhir: e.target.value })}
                                    required
                                />
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

export default Penggunaan;
