// Données de secours : si l'API ne répond pas, le site public reste affiché.
export const DEFAULTS = {
  profile: {
    name: "Compaoré Guetawendé Zacharie",
    monogram: "GZ",
    role: "Ingénieur des Systèmes d'Information",
    tagline:
      "Je conçois et développe des applications web de bout en bout — de l'analyse des besoins à la base de données — pour transformer un problème concret en système qui marche.",
    location: "Bobo-Dioulasso, Burkina Faso",
    email: "compaoreguetawendezacharie@gmail.com",
    phone: "+226 57190894",
    linkedin: "", github: "", cvUrl: "", photoUrl: "",
    status: "Disponible — stage · freelance · collaboration",
    about:
      "Étudiant en Licence 3 d'Ingénierie des Systèmes d'Information à l'Université Nazi-Boni, je modélise et développe des applications web complètes — de l'analyse des besoins (MERISE, UML) à la conception de bases de données et à la mise en production.",
    objectives: [
      "Décrocher un stage ou une mission où livrer du concret et apprendre vite",
      "Maîtriser l'architecture logicielle et les systèmes distribués",
      "Construire des produits qui répondent à des besoins locaux africains",
    ],
    interests: ["Football", "Chant & musique"],
  },
  awards: [
    { id: 1, date: "Décembre 2025", title: "1er Prix — Hackathon « Numérisons le savoir »", description: "Plateforme de centralisation des ressources pédagogiques." },
    { id: 2, date: "2024 – 2025", title: "Finaliste — MIABE Hackathon", description: "Recherche et disponibilité des médicaments avec géolocalisation." },
  ],
  skills: [
    { id: 1, name: "Analyse & Conception", icon: "spark", skills: [{ id: 1, name: "MERISE", level: 88 }, { id: 2, name: "UML", level: 85 }] },
    { id: 2, name: "Langages & Frameworks", icon: "code", skills: [{ id: 3, name: "Node.js / JavaScript", level: 82 }, { id: 4, name: "Java", level: 75 }, { id: 5, name: "Python", level: 70 }, { id: 6, name: "Laravel (PHP)", level: 72 }, { id: 7, name: "HTML / CSS", level: 88 }] },
    { id: 3, name: "Bases de données", icon: "db", skills: [{ id: 8, name: "PostgreSQL", level: 86 }, { id: 9, name: "PL/pgSQL", level: 76 }, { id: 10, name: "SQL avancé", level: 80 }] },
  ],
  languages: [
    { id: 1, name: "Français", level: "Courant" },
    { id: 2, name: "Mooré", level: "Langue maternelle" },
    { id: 3, name: "Anglais", level: "Technique" },
  ],
  projects: [
    { id: 1, title: "Numérisons le savoir", category: "Plateforme web · EdTech", year: "2025", award: "1er Prix Hackathon", description: "Plateforme de centralisation et de gestion des ressources pédagogiques.", tech: ["Node.js", "PostgreSQL", "JavaScript", "HTML/CSS"], github: "", demo: "", cover: "" },
    { id: 2, title: "PharmaGarde", category: "Web · HealthTech", year: "2024–2025", award: "Finaliste MIABE", description: "Recherche et disponibilité des médicaments, géolocalisation des pharmacies de garde.", tech: ["Laravel (PHP)", "PostgreSQL", "API REST"], github: "", demo: "", cover: "" },
  ],
  timeline: [
    { id: 1, period: "2025 – 2026", title: "Licence 3 — Ingénierie des Systèmes d'Information", org: "Université Nazi-Boni · ESI" },
    { id: 2, period: "2023 – 2025", title: "Licence 1 & 2 — Tronc commun Informatique", org: "Université Nazi-Boni · ESI" },
    { id: 3, period: "2022 – 2023", title: "Baccalauréat série D", org: "Lycée Communal de Yako" },
  ],
};
