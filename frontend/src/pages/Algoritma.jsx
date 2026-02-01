/**
 * ALGORITMA PAGE - Demo Sorting & Searching
 */
import { useState } from 'react';
import api from '../utils/api';

function Algoritma() {
    const [menu, setMenu] = useState('');
    const [angkaArray, setAngkaArray] = useState([]);
    const [inputAngka, setInputAngka] = useState('');
    const [jumlahInput, setJumlahInput] = useState('');
    const [angkaDicari, setAngkaDicari] = useState('');
    const [hasil, setHasil] = useState(null);

    const handleInputAngka = () => {
        const n = parseInt(jumlahInput);
        if (n > 0) {
            setMenu('input');
        }
    };

    const handleTambahAngka = () => {
        if (inputAngka) {
            setAngkaArray([...angkaArray, parseInt(inputAngka)]);
            setInputAngka('');
        }
    };

    const handleSorting = async () => {
        try {
            const res = await api.post('/algoritma/sort', {
                data: angkaArray,
                order: 'asc'
            });
            setHasil(res.data.data);
            setMenu('hasil-sort');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleSearching = async () => {
        try {
            const res = await api.post('/algoritma/search', {
                data: angkaArray,
                target: parseInt(angkaDicari),
                method: 'linear'
            });
            setHasil(res.data.data);
            setMenu('hasil-search');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const resetData = () => {
        setAngkaArray([]);
        setInputAngka('');
        setJumlahInput('');
        setAngkaDicari('');
        setHasil(null);
        setMenu('');
    };

    return (
        <div className="container">
                <h1>Demo Algoritma Sorting & Searching</h1>

                {menu === '' && (
                    <div className="menu-section">
                        <h2>MENU PILIHAN</h2>
                        <div className="menu-buttons">
                            <button onClick={() => setMenu('setup')} className="menu-btn">1. Input Angka</button>
                            <button onClick={handleSorting} className="menu-btn" disabled={angkaArray.length === 0}>
                                2. Sorting
                            </button>
                            <button onClick={() => setMenu('search')} className="menu-btn" disabled={angkaArray.length === 0}>
                                3. Searching
                            </button>
                            <button onClick={resetData} className="menu-btn">4. Reset</button>
                        </div>
                        {angkaArray.length > 0 && (
                            <div className="current-data">
                                <h3>Data Saat Ini:</h3>
                                <p className="data-display">[{angkaArray.join(', ')}]</p>
                            </div>
                        )}
                    </div>
                )}

                {menu === 'setup' && (
                    <div className="input-section">
                        <h2>INPUT ANGKA</h2>
                        <div className="form-group">
                            <label>Masukkan jumlah nilai:</label>
                            <input
                                type="number"
                                value={jumlahInput}
                                onChange={(e) => setJumlahInput(e.target.value)}
                                placeholder="Contoh: 3"
                            />
                            <button onClick={handleInputAngka} className="btn-primary">OK</button>
                        </div>
                    </div>
                )}

                {menu === 'input' && (
                    <div className="input-section">
                        <h2>INPUT ANGKA SECARA ACAK</h2>
                        <p>Angka ke-{angkaArray.length + 1} dari {jumlahInput}</p>
                        <div className="form-group">
                            <input
                                type="number"
                                value={inputAngka}
                                onChange={(e) => setInputAngka(e.target.value)}
                                placeholder="Masukkan angka"
                                onKeyPress={(e) => e.key === 'Enter' && handleTambahAngka()}
                            />
                            <button onClick={handleTambahAngka} className="btn-primary">Tambah</button>
                        </div>
                        <div className="current-data">
                            <p>Data: [{angkaArray.join(', ')}]</p>
                        </div>
                        {angkaArray.length >= parseInt(jumlahInput) && (
                            <button onClick={() => setMenu('')} className="btn-success">Selesai Input</button>
                        )}
                    </div>
                )}

                {menu === 'hasil-sort' && hasil && (
                    <div className="result-section">
                        <h2>TAMPIL HASIL SORTING</h2>
                        <div className="result-box">
                            <p><strong>Data Asli:</strong> [{hasil.original?.join(', ')}]</p>
                            <p><strong>Hasil Sorting:</strong> [{hasil.sorted?.join(', ')}]</p>
                            <p><strong>Algoritma:</strong> {hasil.algorithm}</p>
                            <p><strong>Kompleksitas:</strong> {hasil.complexity}</p>
                            <p><strong>Waktu Eksekusi:</strong> {hasil.executionTime}</p>
                        </div>
                        <button onClick={() => setMenu('')} className="btn-primary">Kembali ke Menu</button>
                    </div>
                )}

                {menu === 'search' && (
                    <div className="input-section">
                        <h2>TAMPIL HASIL SEARCHING</h2>
                        <div className="form-group">
                            <label>Masukkan angka yang dicari:</label>
                            <input
                                type="number"
                                value={angkaDicari}
                                onChange={(e) => setAngkaDicari(e.target.value)}
                                placeholder="Contoh: 70"
                            />
                            <button onClick={handleSearching} className="btn-primary">Cari</button>
                        </div>
                    </div>
                )}

                {menu === 'hasil-search' && hasil && (
                    <div className="result-section">
                        <h2>HASIL PENCARIAN</h2>
                        <div className="result-box">
                            <p className={hasil.found ? 'text-success' : 'text-error'}>
                                <strong>{hasil.message}</strong>
                            </p>
                            {hasil.found && (
                                <>
                                    <p><strong>Posisi:</strong> Index {hasil.index} (Posisi ke-{hasil.index + 1})</p>
                                    <p><strong>Nilai:</strong> {hasil.value}</p>
                                </>
                            )}
                            <p><strong>Algoritma:</strong> {hasil.algorithm}</p>
                            <p><strong>Kompleksitas:</strong> {hasil.complexity}</p>
                            <p><strong>Waktu Eksekusi:</strong> {hasil.executionTime}</p>
                        </div>
                        <button onClick={() => setMenu('')} className="btn-primary">Kembali ke Menu</button>
                    </div>
                )}
        </div>
    );
}

export default Algoritma;
