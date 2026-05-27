import Aspirasi from "../models/AspirasiModel.js";
import Kategori from "../models/KategoriModel.js";
import User from "../models/UserModel.js";
import UmpanBalik from "../models/UmpanBalikModel.js"; 
import path from "path";
import { buatLog } from "./LogController.js"; 

// 1. Ambil Semua Data Aspirasi (Untuk Tampilan Admin + Riwayat Balasan Admin)
export const getAllAspirasi = async (req, res) => {
    try {
        const response = await Aspirasi.findAll({
            include: [
                {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['ket_kategori']
                },
                {
                    model: User, 
                    as: 'user', 
                    attributes: ['nama_lengkap', 'kelas', 'nis']
                },
                {
                    model: UmpanBalik,
                    attributes: ['id_umpan_balik', 'isi_balasan', 'progres', 'tanggal_balasan']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 2. Ambil Data Berdasarkan User ID (Untuk History & Progress Siswa)
// 🌟 FIX: Menyelaraskan pembacaan req.params agar sinkron dengan Axios frontend
export const getAspirasiByUserId = async (req, res) => {
    try {
        // Mengamankan penamaan parameter routing (bisa lewat :id atau :id_user)
        const parameterId = req.params.id || req.params.id_user; 

        const response = await Aspirasi.findAll({
            where: { id_siswa: parameterId },
            include: [
                {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['ket_kategori']
                },
                {
                    model: UmpanBalik,
                    attributes: ['id_umpan_balik', 'isi_balasan', 'progres', 'tanggal_balasan']
                }
            ],
            order: [['updatedAt', 'DESC']] 
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 3. Tambah Aspirasi Baru (Siswa)
export const createAspirasi = async (req, res) => {
    let fileName = "";
    if (req.files && req.files.gambar) { 
        const file = req.files.gambar;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;

        const allowedType = ['.png', '.jpg', '.jpeg'];
        if (!allowedType.includes(ext.toLowerCase())) 
            return res.status(422).json({ msg: "Format gambar tidak valid! Gunakan png, jpg, atau jpeg." });

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    const { judul, id_kategori, lokasi, deskripsi, id_siswa, kode_aspirasi } = req.body;

    try {
        await Aspirasi.create({
            kode_aspirasi,
            id_siswa,
            id_kategori,
            judul,
            lokasi,
            deskripsi,
            gambar: fileName,
            status: "menunggu",
            tanggal_pengajuan: new Date()
        });

        await buatLog(
            id_siswa, 
            "Kirim Pengaduan", 
            `Membuat pengaduan baru [${kode_aspirasi}] dengan judul: "${judul}"`
        );

        res.status(201).json({ msg: "Aspirasi Berhasil Dibuat" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 4. Update Status & Feedback 
export const updateAspirasi = async (req, res) => {
    try {
        const { status, feedback } = req.body;
        const userIdAktif = req.userId || req.session?.userId || req.body.id_user; 

        await Aspirasi.update({
            status: status,
            feedback: feedback
        }, {
            where: {
                id_aspirasi: req.params.id
            }
        });

        if (userIdAktif) {
            await buatLog(
                userIdAktif, 
                "Update Aspirasi", 
                `Mengubah status Aspirasi ID ${req.params.id} menjadi [${status}]`
            );
        }

        res.status(200).json({ msg: "Aspirasi Berhasil Diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}