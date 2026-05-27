import express from "express";
import { getKategori } from "../controllers/KategoriController.js";

const router = express.Router();

router.get('/kategori', getKategori);

export default router;