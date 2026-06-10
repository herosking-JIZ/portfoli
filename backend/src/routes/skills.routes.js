import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

// GET /api/skills (public) — catégories avec leurs compétences
r.get("/", async (_req, res) => {
  const cats = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
  res.json(cats);
});

// ── Catégories ──
r.post("/category", requireAuth, async (req, res) => {
  const { name, icon, order } = req.body || {};
  res.json(await prisma.skillCategory.create({
    data: { name: name || "Nouvelle catégorie", icon: icon || "code", order: Number(order) || 0 },
  }));
});

r.put("/category/:id", requireAuth, async (req, res) => {
  const { name, icon, order } = req.body || {};
  res.json(await prisma.skillCategory.update({
    where: { id: Number(req.params.id) },
    data: { name, icon, order: order !== undefined ? Number(order) : undefined },
  }));
});

r.delete("/category/:id", requireAuth, async (req, res) => {
  await prisma.skillCategory.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

// ── Compétences ──
r.post("/category/:id/skill", requireAuth, async (req, res) => {
  const { name, level, order } = req.body || {};
  res.json(await prisma.skill.create({
    data: {
      name: name || "Nouvelle compétence",
      level: Number(level) || 60,
      order: Number(order) || 0,
      categoryId: Number(req.params.id),
    },
  }));
});

r.put("/skill/:id", requireAuth, async (req, res) => {
  const { name, level, order } = req.body || {};
  res.json(await prisma.skill.update({
    where: { id: Number(req.params.id) },
    data: {
      name,
      level: level !== undefined ? Number(level) : undefined,
      order: order !== undefined ? Number(order) : undefined,
    },
  }));
});

r.delete("/skill/:id", requireAuth, async (req, res) => {
  await prisma.skill.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
