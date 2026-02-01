/**
 * TAGIHAN PAGE - Lihat Tagihan
 */
import { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import api from '../utils/api';

function Tagihan() {
    const [tagihan, setTagihan] = useState([]);
    const [filter, setFilter] = useState({ bulan: '', tahun: '', status_bayar: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isPelanggan = user.id_level === 2;

    useEffect(() => {
        fetchTagihan();
    }, [filter]);

    const fetchTagihan = async () => {
        try {
            const params = isPelanggan ? { id_pelanggan: user.id_pelanggan, ...filter } : filter;
            const res = await api.get('/tagihan', { params });
            setTagihan(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBayar = async (id) => {
        if (window.confirm('Konfirmasi pembayaran tagihan ini?')) {
            try {
                await api.put(`/tagihan/${id}/bayar`);
                alert('Tagihan berhasil dibayar!');
                fetchTagihan();
            } catch (error) {
                alert('Error: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
            }
        }
    };

    return (
        <div className="container">
            <h1>Data Tagihan</h1>

            <div className="filter-section">
                <select value={filter.bulan} onChange={(e) => setFilter({ ...filter, bulan: e.target.value })}>
                    <option value="">Semua Bulan</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Bulan {i + 1}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Tahun"
                    value={filter.tahun}
                    onChange={(e) => setFilter({ ...filter, tahun: e.target.value })}
                />
                <select value={filter.status_bayar} onChange={(e) => setFilter({ ...filter, status_bayar: e.target.value })}>
                    <option value="">Semua Status</option>
                    <option value="Belum Bayar">Belum Bayar</option>
                    <option value="Sudah Bayar">Sudah Bayar</option>
                </select>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Periode</th>
                        <th>Pelanggan</th>
                        <th>Jumlah kWh</th>
                        <th>Tarif/kWh</th>
                        <th>Biaya Beban</th>
                        <th>Total Tagihan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {tagihan.map((item) => (
                        <tr key={item.id_tagihan}>
                            <td>{item.bulan}/{item.tahun}</td>
                            <td>{item.nama_pelanggan}</td>
                            <td>{item.jumlah_kwh} kWh</td>
                            <td>Rp {item.tarif_per_kwh ? parseInt(item.tarif_per_kwh).toLocaleString('id-ID') : '0'}</td>
                            <td>Rp {item.biaya_beban ? parseInt(item.biaya_beban).toLocaleString('id-ID') : '0'}</td>
                            <td><strong>Rp {item.total_tagihan ? parseInt(item.total_tagihan).toLocaleString('id-ID') : '0'}</strong></td>
                            <td>
                                <span className={`badge ${item.status_bayar === 'Sudah Bayar' ? 'badge-success' : 'badge-warning'}`}>
                                    {item.status_bayar}
                                </span>
                            </td>
                            <td>
                                {item.status_bayar === 'Belum Bayar' && (
                                    <button onClick={() => handleBayar(item.id_tagihan)} className="btn-primary">
                                        Bayar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Tagihan;
