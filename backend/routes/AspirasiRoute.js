import express from "express";
import {
    getAllAspirasi,
    getAspirasiByUserId,
    createAspirasi,
    updateAspirasi // Import fungsi baru
} from "../controllers/AspirasiController.js";

const router = express.Router();

// Route untuk Admin & General
router.get('/aspirasi', getAllAspirasi);
router.patch('/aspirasi/:id', updateAspirasi); // Ini endpoint untuk tombol SIMPAN

// Route untuk Siswa
router.get('/aspirasi/user/:id_user', getAspirasiByUserId); 
router.post('/aspirasi', createAspirasi);

export default router;