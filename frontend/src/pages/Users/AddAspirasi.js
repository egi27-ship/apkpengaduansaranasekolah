import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAspirasi = () => {
  const [judul, setJudul] = useState("");
  const [idKategori, setIdKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState(""); 
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState("");
  const [kategori, setKategori] = useState([]);
  const navigate = useNavigate();

  const listLokasi = {
    "Kebersihan": ["Kantin", "Toilet", "Halaman Depan", "Koridor Kelas"],
    "Keamanan": ["Gerbang Utama", "Parkir Siswa", "Parkir Guru", "Pos Satpam"],
    "Aula": ["Panggung Aula", "Gudang Aula", "Area Tengah"],
    "Fasilitas": ["Lab PPLG", "Perpustakaan", "Ruang OSIS", "UKS"]
  };

  useEffect(() => {
    getKategori();
  }, []);

  const getKategori = async () => {
    const response = await axios.get("http://localhost:5000/kategori");
    setKategori(response.data);
  };

  const handleKategoriChange = (e) => {
    const selectedId = e.target.value;
    const selectedCat = kategori.find((kat) => kat.id_kategori === parseInt(selectedId));
    
    setIdKategori(selectedId);
    setNamaKategori(selectedCat ? selectedCat.ket_kategori : "");
    setLokasi(""); 
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

  const saveAspirasi = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("id_kategori", idKategori);
    formData.append("lokasi", lokasi);
    formData.append("deskripsi", deskripsi);
    formData.append("gambar", file);
    formData.append("id_siswa", localStorage.getItem("id_user"));
    formData.append("kode_aspirasi", `ASP-${Date.now()}`);

    try {
      await axios.post("http://localhost:5000/aspirasi", formData, {
        headers: { "Content-type": "multipart/form-data" },
      });
      navigate("/history");
    } catch (error) {
      console.log(error);
    }
  };

  // Template Style seragam untuk elemen form agar tetap putih dan teks gelap
  const formInputStyle = {
    backgroundColor: "#ffffff",
    color: "#333333",
    borderColor: "#dbdbdb",
    borderRadius: "5px"
  };

  return (
    <div className="container mt-5">
      <div className="columns is-centered">
        <div className="column is-11"> 
          <div className="box" style={{ backgroundColor: 'white', color: '#333', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h1 className="title is-4 has-text-link has-text-centered mb-5">Kirim Aspirasi Baru</h1>
            <hr style={{ backgroundColor: '#dbdbdb' }} />
            
            <form onSubmit={saveAspirasi}>
              <div className="columns is-multiline">
                {/* Judul Laporan */}
                <div className="column is-6">
                  <div className="field">
                    <label className="label has-text-dark">Judul Laporan</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        style={formInputStyle}
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        placeholder="Contoh: Fasilitas Kelas"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Kategori */}
                <div className="column is-6">
                  <div className="field">
                    <label className="label has-text-dark">Kategori</label>
                    <div className="control is-expanded">
                      <div className="select is-fullwidth">
                        <select 
                          style={formInputStyle}
                          value={idKategori} 
                          onChange={handleKategoriChange}
                          required
                        >
                          <option value="" style={{ backgroundColor: '#fff', color: '#333' }}>Pilih Kategori</option>
                          {kategori.map((kat) => (
                            <option key={kat.id_kategori} value={kat.id_kategori} style={{ backgroundColor: '#fff', color: '#333' }}>
                              {kat.ket_kategori}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="column is-12">
                  <div className="field">
                    <label className="label has-text-dark">Lokasi Kejadian</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          style={{
                            ...formInputStyle, 
                            backgroundColor: !namaKategori ? "#f5f5f5" : "#ffffff"
                          }}
                          value={lokasi}
                          onChange={(e) => setLokasi(e.target.value)}
                          required
                          disabled={!namaKategori}
                        >
                          <option value="" style={{ backgroundColor: '#fff', color: '#333' }}>
                            {namaKategori ? `-- Pilih Lokasi ${namaKategori} --` : "Pilih Kategori Terlebih Dahulu"}
                          </option>
                          {namaKategori && listLokasi[namaKategori]?.map((item, index) => (
                            <option key={index} value={item} style={{ backgroundColor: '#fff', color: '#333' }}>{item}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="column is-12">
                  <div className="field">
                    <label className="label has-text-dark">Isi Aspirasi (Deskripsi)</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        style={formInputStyle}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        placeholder="Ceritakan detail aspirasimu..."
                        rows="5"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Bukti Foto */}
                <div className="column is-12">
                  <div className="field">
                    <label className="label has-text-dark">Bukti Foto</label>
                    <div className="file has-name is-fullwidth">
                      <label className="file-label">
                        <input className="file-input" type="file" onChange={loadImage} />
                        <span className="file-cta" style={{ backgroundColor: '#f5f5f5', border: '1px solid #dbdbdb' }}>
                          <span className="file-label has-text-dark">Pilih Gambar...</span>
                        </span>
                        <span className="file-name" style={{ backgroundColor: '#ffffff', color: '#333333', border: '1px solid #dbdbdb' }}>
                          {file ? file.name : "Belum ada file dipilih"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Kirim Biru Utama */}
              <div className="field mt-5">
                <button 
                  type="submit" 
                  className="button is-link is-fullwidth has-text-weight-bold" 
                  style={{ backgroundColor: '#3273dc', color: '#ffffff', borderRadius: '5px' }}
                >
                  🚀 KIRIM SEKARANG
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAspirasi;