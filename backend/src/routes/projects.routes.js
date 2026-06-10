import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

const fields = (b = {}) => ({
  title: b.title ?? "",
  category: b.category ?? "",
  year: b.year ?? "",
  award: b.award ?? "",
  description: b.description ?? "",
  tech: Array.isArray(b.tech) ? b.tech : [],
  github: b.github ?? "",
  demo: b.demo ?? "",
  cover: b.cover ?? "",
  order: Number(b.order) || 0,
});

r.get("/", async (_req, res) =>
  res.json(await prisma.project.findMany({ orderBy: { order: "asc" } })));

r.post("/", requireAuth, async (req, res) =>
  res.json(await prisma.project.create({ data: fields(req.body) })));

r.put("/:id", requireAuth, async (req, res) =>
  res.json(await prisma.project.update({ where: { id: Number(req.params.id) }, data: fields(req.body) })));

r.delete("/:id", requireAuth, async (req, res) => {
  await prisma.project.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
