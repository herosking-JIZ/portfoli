import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
const fields = (b = {}) => ({
  period: b.period ?? "",
  title: b.title ?? "",
  org: b.org ?? "",
  order: Number(b.order) || 0,
});

r.get("/", async (_req, res) =>
  res.json(await prisma.timelineEntry.findMany({ orderBy: { order: "asc" } })));

r.post("/", requireAuth, async (req, res) =>
  res.json(await prisma.timelineEntry.create({ data: fields(req.body) })));

r.put("/:id", requireAuth, async (req, res) =>
  res.json(await prisma.timelineEntry.update({ where: { id: Number(req.params.id) }, data: fields(req.body) })));

r.delete("/:id", requireAuth, async (req, res) => {
  await prisma.timelineEntry.delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default r;
