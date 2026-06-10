import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
const fields = (b = {}) => ({
  date: b.date ?? "",
  title: b.title ?? "",
  description: b.description ?? "",
  order: Number(b.order) || 0,
});

r.get("/", async (_req, res) =>
  res.json(await prisma.award.findMany({ orderBy: { order: "asc" } })));

r.post("/", requireAuth, async (req, res) =>
  res.json(await prisma.award.create({ data: fields(req.body) })));

r.put("/:id", requireAuth, async (req, res) =>
  res.json(await prisma.award.update({ where: { id: Number(req.params.id) }, data: fields(req.body) })));

r.delete("/:id", requireAuth, async (req, res) => {
  await prisma.award.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
