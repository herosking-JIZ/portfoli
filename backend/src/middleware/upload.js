import multer from "multer";
import path from "path";
import fs from "fs";

const dir = path.resolve("uploads");
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, base + ext);
  },
});

// Images + PDF (pour le CV), 8 Mo max
const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"];
export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Format de fichier non autorisé."));
  },
});
