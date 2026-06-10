import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const r = Router();

// POST /api/upload (admin) — champ "file"
r.post("/", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu." });
  const base = process.env.PUBLIC_URL || "";
  res.json({ url: `${base}/uploads/${req.file.filename}` });
});

export default r;
