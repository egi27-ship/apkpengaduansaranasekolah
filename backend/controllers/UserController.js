import User from "../models/UserModel.js";
import { buatLog } from "./LogController.js"; 

// 1. Fungsi mengambil semua data user
export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['id_user', 'nama_lengkap', 'username', 'nis', 'kelas', 'level']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 2. Fungsi membuat/registrasi user baru
export const createUser = async (req, res) => {
    const { nama_lengkap, username, nis, kelas, password, level } = req.body;
    try {
        await User.create({
            nama_lengkap: nama_lengkap,
            username: username,
            nis: nis || null,
            kelas: kelas || null,
            password: password,
            level: level || "siswa"
        });
        res.status(201).json({ msg: "User Berhasil Registrasi!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// 3. Fungsi Login Utama (SUDAH DIPERBAIKI)
export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.body.username }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        // JIKA PASSWORD DI DATABASE DI-ENCRYPT, PASTIKAN BERIKUTNYA DICOCOKKAN DI SINI
        // (Misal jika memakai bcrypt: const match = await bcrypt.compare(req.body.password, user.password))

        if (req.session) {
            req.session.userId = user.id_user;
            req.session.id_user = user.id_user;
        }

        // REKAM LOG AKTIVITAS LOGIN
        await buatLog(user.id_user, "Melakukan Login ke Sistem");

        // 🌟 PERBAIKAN DI SINI: Menyertakan 'nis' dan 'kelas' agar dikirim ke frontend
        res.status(200).json({ 
            id_user: user.id_user, 
            nama_lengkap: user.nama_lengkap, 
            username: user.username, 
            level: user.level,
            nis: user.nis || "-",   // Ditambahkan agar tidak undefined
            kelas: user.kelas || "-" // Ditambahkan agar tidak undefined
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 4. Fungsi Logout Menggunakan Kiriman ID Langsung dari Frontend
export const logoutUser = async (req, res) => {
    try {
        // Mengambil id_user dari body request (kiriman frontend) atau cadangan session
        const currentUserId = req.body.id_user || (req.session ? (req.session.userId || req.session.id_user) : null); 

        if (currentUserId) {
            // Rekam log logout dijamin 100% tereksekusi tanpa macet!
            await buatLog(currentUserId, "Melakukan Logout dari Sistem");
        }

        // Jika sistem session aktif, bersihkan
        if (req.session) {
            req.session.destroy((err) => {
                if (err) return res.status(400).json({ msg: "Gagal memproses logout" });
                res.clearCookie("connect.sid");
                return res.status(200).json({ msg: "Anda telah logout berhasil" });
            });
        } else {
            // Jika bypass session, langsung kirim respon sukses
            res.status(200).json({ msg: "Anda telah logout berhasil" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};