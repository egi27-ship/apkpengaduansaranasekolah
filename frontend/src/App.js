import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar"; 
import KelolaPengaduan from "./components/KelolaPengaduan";
import DataSiswa from "./components/DataSiswa";
import LoginUser from "./pages/Users/LoginUser";
import RegisterSiswa from "./components/RegisterSiswa"; // 🌟 TAMBAH IMPORT BARU DI SINI
import Dashboard from "./pages/Users/Dashboard";
import HistoryAspirasi from "./pages/Users/HistoryAspirasi";
import AddAspirasi from "./pages/Users/AddAspirasi";
import ProgresFeedback from "./components/ProgresFeedback";
import LogAktivitas from "./components/LogAktivitas"; 

import AddSiswa from "./pages/Users/AddSiswa"; 

const Layout = ({ children }) => {
  const location = useLocation();
  
  // 🌟 PERBAIKAN: Jika sedang di halaman login ("/") ATAU di halaman daftar ("/register"), sembunyikan Sidebar
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div style={{ display: "flex", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%" }}>
      {!isAuthPage && <Sidebar />}
      <div style={{ 
        flex: 1, 
        marginLeft: isAuthPage ? "0" : "250px", 
        padding: "20px",
        backgroundColor: "#f8fafc", 
        minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginUser />} />
          {/* 🌟 TAMBAH ROUTE REGISTER MANDIRI UNTUK SISWA DI SINI */}
          <Route path="/register" element={<RegisterSiswa />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
          <Route path="/history" element={<HistoryAspirasi />} />
          <Route path="/add" element={<AddAspirasi />} />
          <Route path="/feedback" element={<ProgresFeedback />} />
          
          <Route path="/kelola-pengaduan" element={<KelolaPengaduan />} />
          <Route path="/data-siswa" element={<DataSiswa />} />
          
          <Route path="/logs" element={<LogAktivitas />} />
          
          <Route path="/users/add" element={<AddSiswa />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;