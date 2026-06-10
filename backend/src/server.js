import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import languagesRoutes from "./routes/languages.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import awardsRoutes from "./routes/awards.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { smtpConfigured } from "./utils/mailer.js";

const app = express();

const origins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((s) => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: "2mb" }));

// Fichiers uploadés servis en statique
app.use("/uploads", express.static(path.resolve("uploads")));

// Santé
app.get("/api/health", (_req, res) => res.json({ ok: true, smtp: smtpConfigured() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/languages", languagesRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/awards", awardsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

// Gestion d'erreurs
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Erreur serveur." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 API démarrée : http://localhost:${PORT}`);
  console.log(`   SMTP ${smtpConfigured() ? "configuré ✅" : "non configuré ⚠️  (messages stockés en base uniquement)"}\n`);
});
