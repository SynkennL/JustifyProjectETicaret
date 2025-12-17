import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

// Upload klasörünü oluştur
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `product-${uniqueSuffix}${ext}`);
    },
});

// Dosya filtresi - sadece resimler
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Sadece resim dosyaları yüklenebilir (jpeg, png, gif, webp)"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Tek resim yükleme endpoint'i
router.post("/", authenticateToken, upload.single("image"), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "Resim dosyası gerekli" });
    }

    // Dosya URL'ini oluştur
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ url: imageUrl, filename: req.file.filename });
});

// Hata yakalama middleware'i (multer hataları için)
router.use((err: any, req: Request, res: Response, next: any) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "Dosya boyutu 5MB'dan büyük olamaz" });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err.message) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

export default router;
