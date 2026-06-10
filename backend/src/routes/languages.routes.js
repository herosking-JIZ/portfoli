import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
const fields = (b = {}) => ({ name: b.name ?? "", level: b.level ?? "", order: Number(b.order) || 0 });

r.get("/", async (_req, res) =>
  res.json(await prisma.language.findMany({ orderBy: { order: "asc" } })));

r.post("/", requireAuth, async (req, res) =>
  res.json(await prisma.language.create({ data: fields(req.body) })));

r.put("/:id", requireAuth, async (req, res) =>
  res.json(await prisma.language.update({ where: { id: Number(req.params.id) }, data: fields(req.body) })));

r.delete("/:id", requireAuth, async (req, res) => {
  await prisma.language.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
