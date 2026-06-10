import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

// POST /api/auth/login
r.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const admin = await prisma.admin.findUnique({ where: { email: (email || "").toLowerCase() } });
  if (!admin) return res.status(401).json({ error: "Identifiants invalides." });
  const ok = await bcrypt.compare(password || "", admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Identifiants invalides." });
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
  res.json({ token, email: admin.email });
});

// GET /api/auth/me
r.get("/me", requireAuth, (req, res) => res.json({ email: req.admin.email }));

// PUT /api/auth/password
r.put("/password", requireAuth, async (req, res) => {
  const { password } = req.body || {};
  if (!password || password.length < 6)
    return res.status(400).json({ error: "Mot de passe : 6 caractères minimum." });
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.update({ where: { id: req.admin.id }, data: { passwordHash } });
  res.json({ ok: true });
});

export default r;
