import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

async function getOrCreateProfile() {
  let p = await prisma.profile.findFirst();
  if (!p) p = await prisma.profile.create({ data: { name: "Mon nom", objectives: [], interests: [] } });
  return p;
}

// GET /api/profile (public)
r.get("/", async (_req, res) => res.json(await getOrCreateProfile()));

// PUT /api/profile (admin)
r.put("/", requireAuth, async (req, res) => {
  const p = await getOrCreateProfile();
  const b = req.body || {};
  const data = {};
  ["name", "monogram", "role", "tagline", "location", "email", "phone",
   "linkedin", "github", "cvUrl", "photoUrl", "status", "about"].forEach((k) => {
    if (b[k] !== undefined) data[k] = b[k];
  });
  if (Array.isArray(b.objectives)) data.objectives = b.objectives;
  if (Array.isArray(b.interests)) data.interests = b.interests;
  const updated = await prisma.profile.update({ where: { id: p.id }, data });
  res.json(updated);
});

export default r;
