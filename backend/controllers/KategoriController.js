import Kategori from "../models/KategoriModel.js";

export const getKategori = async (req, res) => {
    try {
        const response = await Kategori.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}