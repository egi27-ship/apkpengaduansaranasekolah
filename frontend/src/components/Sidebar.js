import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🌟 Ambil data user secara aman dari localStorage
  const userSession = JSON.parse(localStorage.getItem("user")) || {};
  
  const nama = userSession.nama_lengkap || localStorage.getItem("nama_lengkap") || "User";
  const kelas = userSession.kelas || localStorage.getItem("kelas") || "-";
  const level = userSession.level || localStorage.getItem("level");

  // Fungsi logout menembak API backend dulu agar tercatat di log aktivitas
  const logout = async () => {
    try {
      // Ambil id_user asli dari session object atau fallback key string
      const idUserAktif = userSession.id_user || localStorage.getItem("id_user"); 

      if (idUserAktif) {
        // Tembak endpoint logout backend sambil membawa data id_user di body request
        await axios.post("http://localhost:5000/logout", {
          id_user: idUserAktif
        });
      }
    } catch (error) {
      console.error("Gagal mengirimkan log logout ke backend:", error);
    } finally {
      // Apapun hasilnya (sukses/gagal), data lokal tetap dibersihkan dan user dilempar ke login
      localStorage.clear();
      navigate("/");
    }
  };

  // Logika style menu untuk tema latar belakang biru
  const menuStyle = (path) => ({
    backgroundColor: location.pathname === path ? "rgba(255, 255, 255, 0.2)" : "transparent",
    color: "#ffffff",
    fontWeight: location.pathname === path ? "700" : "500",
    borderRadius: "6px",
    padding: "10px 15px",
    display: "block",
    transition: "all 0.2s ease",
    opacity: location.pathname === path ? "1" : "0.8"
  });

  return (
    <div style={{
      width: "250px", 
      height: "100vh", 
      background: "linear-gradient(180deg, #2b6cb0 0%, #1a365d 100%)", 
      color: "#ffffff", 
      position: "fixed", 
      padding: "30px 20px", 
      boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between",
      zIndex: 1000
    }}>
      <div>
        <h2 className="title is-4 mb-6 ml-2" style={{ letterSpacing: '1px', color: '#ffffff', fontWeight: 'bold' }}>
          🏫 Pengaduan
        </h2>
        
        <aside className="menu">
          <p className="menu-label ml-2" style={{ fontSize: '0.75rem', marginBottom: '1.2rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
            {level === 'admin' ? '💼 ADMIN PANEL' : '🗂️ MAIN MENU'}
          </p>
          <ul className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <li><Link to="/dashboard" style={menuStyle("/dashboard")}>📊 Dashboard</Link></li>
            
            {/* MENU KHUSUS SISWA */}
            {level === 'siswa' && (
              <>
                <li><Link to="/add" style={menuStyle("/add")}>✏️ Kirim Pengaduan</Link></li>
                <li><Link to="/history" style={menuStyle("/history")}>⏳ Riwayat Saya</Link></li>
                <li><Link to="/feedback" style={menuStyle("/feedback")}>✅ Progres & Feedback</Link></li>
              </>
            )}

            {/* MENU KHUSUS ADMIN */}
            {level === 'admin' && (
              <>
                <li><Link to="/kelola-pengaduan" style={menuStyle("/kelola-pengaduan")}>📌 Kelola Pengaduan</Link></li>
                <li><Link to="/data-siswa" style={menuStyle("/data-siswa")}>👤 Data Siswa</Link></li>
                <li><Link to="/logs" style={menuStyle("/logs")}>🕒 Log Aktivitas</Link></li>
              </>
            )}
          </ul>
        </aside>
      </div>

      <div style={{ paddingBottom: '10px' }}>
        <hr style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", height: '1px', margin: '15px 0' }} />
        <div className="ml-2">
          <p className="is-size-7" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Logged in as:</p>
          <p className="is-size-6 has-text-weight-bold mb-4" style={{ color: '#ffffff' }}>
            👤 {nama} {level === 'siswa' ? `(${kelas})` : '(Admin)'}
          </p>
          <button 
            onClick={logout} 
            className="button is-fullwidth is-small" 
            style={{ 
              fontWeight: 'bold', 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              color: '#ffffff', 
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;