import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import db from "./config/Database.js";

// Import Model
import User from "./models/UserModel.js";
import Aspirasi from "./models/AspirasiModel.js";
import Kategori from "./models/KategoriModel.js";
import UmpanBalik from "./models/UmpanBalikModel.js"; 
import LogAktivitas from "./models/LogModel.js"; // 🌟 Tambahan Model Log

// Import Route
import UserRoute from "./routes/UserRoute.js";
import AspirasiRoute from "./routes/AspirasiRoute.js";
import KategoriRoute from "./routes/KategoriRoute.js";
import UmpanBalikRoute from "./routes/UmpanBalikRoute.js"; 
import LogRoute from "./routes/LogRoute.js"; // 🌟 Tambahan Route Log

const app = express();

(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        
        // 🌟 REVISI DI SINI: Hilangkan tanda '//' agar tabel 'log_aktivitas' otomatis dibuat di MySQL
        await db.sync(); 
        
        console.log('Database Loaded Successfully and Tables Synced!');
    } catch (error) {
        console.error('Connection error:', error);
    }
})();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

// Routes
app.use(UserRoute);
app.use(KategoriRoute);
app.use(AspirasiRoute);
app.use(UmpanBalikRoute); 
app.use(LogRoute); // 🌟 Daftarkan Route Log di sini agar API /logs aktif!

app.listen(5000, () => console.log('Server up and running...'));