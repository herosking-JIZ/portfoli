import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { sendContactMail } from "../utils/mailer.js";

const r = Router();

// POST /api/contact (public) — enregistre le message puis tente l'envoi par email
r.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message)
    return res.status(400).json({ error: "Nom, email et message sont requis." });

  // 1) Toujours stocker en base (rien n'est perdu, même sans SMTP)
  await prisma.message.create({ data: { name, email, message } });

  // 2) Tenter l'envoi email (silencieux si SMTP non configuré)
  let emailed = false;
  try {
    const result = await sendContactMail({ name, email, message });
    emailed = result.sent;
  } catch (e) {
    console.error("Envoi email échoué :", e.message);
  }

  res.json({ ok: true, stored: true, emailed });
});

// GET /api/contact/messages (admin)
r.get("/messages", requireAuth, async (_req, res) =>
  res.json(await prisma.message.findMany({ orderBy: { createdAt: "desc" } })));

// PUT /api/contact/messages/:id (admin) — marquer lu/non lu
r.put("/messages/:id", requireAuth, async (req, res) =>
  res.json(await prisma.message.update({
    where: { id: Number(req.params.id) },
    data: { read: Boolean(req.body.read) },
  })));

// DELETE /api/contact/messages/:id (admin)
r.delete("/messages/:id", requireAuth, async (req, res) => {
  await prisma.message.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
