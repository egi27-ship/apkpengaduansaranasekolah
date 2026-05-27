import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryAspirasi = () => {
    const [aspirasi, setAspirasi] = useState([]);
    const idUser = localStorage.getItem("id_user");

    useEffect(() => {
        const getHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/aspirasi/user/${idUser}`);
                setAspirasi(response.data);
            } catch (error) {
                console.error("Gagal mengambil data history:", error);
            }
        };
        if (idUser) getHistory();
    }, [idUser]);

    return (
        <div className="container mt-5">
            {/* Box Utama Putih Bersih */}
            <div className="box" style={{ backgroundColor: '#ffffff', color: '#333333', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h1 className="title is-4 has-text-link has-text-centered">Riwayat Aspirasi Saya</h1>
                <hr style={{ backgroundColor: '#dbdbdb' }} />
                
                <div className="table-container">
                    {/* Hapus is-striped agar tidak ada baris otomatis hitam/abu gelap */}
                    <table className="table is-fullwidth is-hoverable" style={{ backgroundColor: '#ffffff', color: '#333333' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #dbdbdb' }}>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>No</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Judul</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Kategori</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Lokasi</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Deskripsi</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Bukti Foto</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aspirasi.length > 0 ? (
                                aspirasi.map((item, index) => (
                                    /* Memaksa setiap baris (tr) memiliki background putih dan teks gelap */
                                    <tr key={item.id_aspirasi || index} style={{ backgroundColor: '#ffffff', color: '#333333', borderBottom: '1px solid #edf2f7' }}>
                                        <td className="has-text-centered is-vcentered" style={{ color: '#333333' }}>{index + 1}</td>
                                        <td className="has-text-centered is-vcentered has-text-weight-bold" style={{ color: '#1a202c' }}>{item.judul}</td>
                                        <td className="has-text-centered is-vcentered" style={{ color: '#4a5568' }}>{item.kategori?.ket_kategori || "-"}</td>
                                        <td className="has-text-centered is-vcentered" style={{ color: '#4a5568' }}>{item.lokasi}</td>
                                        <td className="is-vcentered" style={{ maxWidth: '250px', wordWrap: 'break-word', color: '#4a5568' }}>
                                            {item.deskripsi}
                                        </td>
                                        <td className="has-text-centered is-vcentered">
                                            {item.gambar ? (
                                                <figure className="image is-64x64 is-inline-block">
                                                    <img 
                                                        src={`http://localhost:5000/images/${item.gambar}`} 
                                                        alt="bukti" 
                                                        style={{ borderRadius: '5px', objectFit: 'cover', border: '1px solid #dbdbdb' }}
                                                    />
                                                </figure>
                                            ) : (
                                                <span className="has-text-grey-light is-size-7">Tidak ada foto</span>
                                            )}
                                        </td>
                                        <td className="has-text-centered is-vcentered">
                                            <span className={`tag is-medium is-bold ${
                                                item.status === 'menunggu' || item.status === 'baru' ? 'is-warning has-text-dark' : 
                                                item.status === 'diproses' ? 'is-info has-text-white' : 
                                                item.status === 'selesai' ? 'is-success has-text-white' : 
                                                'is-light has-text-dark'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="has-text-centered has-text-grey py-5" style={{ backgroundColor: '#ffffff' }}>
                                        Belum ada aspirasi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryAspirasi;