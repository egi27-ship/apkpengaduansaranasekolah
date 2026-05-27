import express from "express";
import { 
    getUsers, 
    createUser, 
    loginUser,
    logoutUser // 🌟 TAMBAHKAN IMPORT INI
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // 🌟 DAFTARKAN RUTE LOGOUT DI SINI

export default router;