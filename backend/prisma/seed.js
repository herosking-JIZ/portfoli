import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ─── Données extraites du CV (modifiables ensuite via l'admin) ─── */
const profileData = {
  name: "Compaoré Guetawendé Zacharie",
  monogram: "GZ",
  role: "Ingénieur des Systèmes d'Information",
  tagline:
    "Je conçois et développe des applications web de bout en bout — de l'analyse des besoins à la base de données — pour transformer un problème concret en système qui marche.",
  location: "Bobo-Dioulasso, Burkina Faso",
  email: "compaoreguetawendezacharie@gmail.com",
  phone: "+226 57190894",
  linkedin: "",
  github: "",
  cvUrl: "",
  photoUrl: "",
  status: "Disponible — stage · freelance · collaboration",
  about:
    "Étudiant en Licence 3 d'Ingénierie des Systèmes d'Information à l'Université Nazi-Boni (École Supérieure d'Informatique), je modélise et développe des applications web complètes — de l'analyse des besoins (MERISE, UML) à la conception de bases de données et à la mise en production. Mon terrain de jeu : transformer un besoin réel en logiciel utile et fiable. C'est cette approche qui m'a valu le 1er prix du hackathon « Numérisons le savoir » et une place de finaliste au MIABE Hackathon.",
  objectives: [
    "Décrocher un stage ou une mission où livrer du concret et apprendre vite",
    "Maîtriser l'architecture logicielle et les systèmes distribués",
    "Construire des produits qui répondent à des besoins locaux africains",
  ],
  interests: ["Football", "Chant & musique"],
};

const skillsData = [
  { name: "Analyse & Conception", icon: "spark", order: 0, items: [
    { name: "MERISE", level: 88, order: 0 },
    { name: "UML", level: 85, order: 1 },
  ]},
  { name: "Langages & Frameworks", icon: "code", order: 1, items: [
    { name: "Node.js / JavaScript", level: 82, order: 0 },
    { name: "Java", level: 75, order: 1 },
    { name: "Python", level: 70, order: 2 },
    { name: "Laravel (PHP)", level: 72, order: 3 },
    { name: "HTML / CSS", level: 88, order: 4 },
  ]},
  { name: "Bases de données", icon: "db", order: 2, items: [
    { name: "PostgreSQL", level: 86, order: 0 },
    { name: "PL/pgSQL", level: 76, order: 1 },
    { name: "SQL avancé", level: 80, order: 2 },
  ]},
];

const languagesData = [
  { name: "Français", level: "Courant", order: 0 },
  { name: "Mooré", level: "Langue maternelle", order: 1 },
  { name: "Anglais", level: "Technique", order: 2 },
];

const projectsData = [
  {
    title: "Numérisons le savoir",
    category: "Plateforme web · EdTech",
    year: "2025",
    award: "1er Prix Hackathon",
    description:
      "Plateforme de centralisation et de gestion des ressources pédagogiques. Les apprenants partagent leurs supports, collaborent et retrouvent les contenus de cours dans un espace unique.",
    tech: ["Node.js", "PostgreSQL", "JavaScript", "HTML/CSS"],
    github: "", demo: "", cover: "", order: 0,
  },
  {
    title: "PharmaGarde",
    category: "Web · HealthTech · Géolocalisation",
    year: "2024–2025",
    award: "Finaliste MIABE",
    description:
      "Application de recherche et de disponibilité des médicaments. Géolocalise les pharmacies de garde, vérifie la disponibilité et compare les prix pour orienter le patient vers la solution la plus proche et abordable.",
    tech: ["Laravel (PHP)", "PostgreSQL", "Géolocalisation", "API REST"],
    github: "", demo: "", cover: "", order: 1,
  },
];

const timelineData = [
  { period: "2025 – 2026", title: "Licence 3 — Ingénierie des Systèmes d'Information", org: "Université Nazi-Boni · École Supérieure d'Informatique", order: 0 },
  { period: "2023 – 2025", title: "Licence 1 & 2 — Tronc commun Informatique", org: "Université Nazi-Boni · École Supérieure d'Informatique", order: 1 },
  { period: "2022 – 2023", title: "Baccalauréat série D", org: "Lycée Communal de Yako", order: 2 },
];

const awardsData = [
  { date: "Décembre 2025", title: "1er Prix — Hackathon « Numérisons le savoir »", description: "Application web de centralisation et de gestion des ressources pédagogiques, avec collaboration et partage entre apprenants.", order: 0 },
  { date: "2024 – 2025", title: "Finaliste — MIABE Hackathon", description: "Application web de recherche et de disponibilité des médicaments : géolocalisation des pharmacies de garde et comparaison des prix.", order: 1 },
];

async function main() {
  // 1) Compte admin
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "change-moi-vite";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });
  console.log(`✔ Admin : ${email}`);

  // 2) Contenu (uniquement si la base est vide)
  const existing = await prisma.profile.findFirst();
  if (existing) {
    console.log("ℹ Contenu déjà présent — seed du contenu ignoré.");
    return;
  }

  await prisma.profile.create({ data: profileData });
  for (const cat of skillsData) {
    await prisma.skillCategory.create({
      data: { name: cat.name, icon: cat.icon, order: cat.order, skills: { create: cat.items } },
    });
  }
  await prisma.language.createMany({ data: languagesData });
  await prisma.project.createMany({ data: projectsData });
  await prisma.timelineEntry.createMany({ data: timelineData });
  await prisma.award.createMany({ data: awardsData });
  console.log("✔ Contenu du CV injecté.");
}

main()
  .then(() => console.log("Seed terminé ✅"))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
