const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const TOKEN_KEY = "pf_token";

export const session = {
  get token() { return localStorage.getItem(TOKEN_KEY); },
  set token(v) { v ? localStorage.setItem(TOKEN_KEY, v) : localStorage.removeItem(TOKEN_KEY); },
  get isAuthed() { return Boolean(localStorage.getItem(TOKEN_KEY)); },
  logout() { localStorage.removeItem(TOKEN_KEY); },
};

async function req(path, { method = "GET", body, authed = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (authed && session.token) headers.Authorization = `Bearer ${session.token}`;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && authed) session.logout();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data;
}

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(BASE + "/upload", {
    method: "POST",
    headers: session.token ? { Authorization: `Bearer ${session.token}` } : {},
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload échoué.");
  return data; // { url }
}

export const api = {
  // ── Public ──
  getProfile: () => req("/profile"),
  getProjects: () => req("/projects"),
  getSkills: () => req("/skills"),
  getLanguages: () => req("/languages"),
  getTimeline: () => req("/timeline"),
  getAwards: () => req("/awards"),
  contact: (b) => req("/contact", { method: "POST", body: b }),

  // ── Auth ──
  login: (b) => req("/auth/login", { method: "POST", body: b }),
  me: () => req("/auth/me", { authed: true }),
  setPassword: (password) => req("/auth/password", { method: "PUT", authed: true, body: { password } }),

  // ── Profil ──
  saveProfile: (b) => req("/profile", { method: "PUT", authed: true, body: b }),

  // ── Projets ──
  createProject: (b) => req("/projects", { method: "POST", authed: true, body: b }),
  updateProject: (id, b) => req(`/projects/${id}`, { method: "PUT", authed: true, body: b }),
  deleteProject: (id) => req(`/projects/${id}`, { method: "DELETE", authed: true }),

  // ── Compétences ──
  createCategory: (b) => req("/skills/category", { method: "POST", authed: true, body: b }),
  updateCategory: (id, b) => req(`/skills/category/${id}`, { method: "PUT", authed: true, body: b }),
  deleteCategory: (id) => req(`/skills/category/${id}`, { method: "DELETE", authed: true }),
  createSkill: (cid, b) => req(`/skills/category/${cid}/skill`, { method: "POST", authed: true, body: b }),
  updateSkill: (id, b) => req(`/skills/skill/${id}`, { method: "PUT", authed: true, body: b }),
  deleteSkill: (id) => req(`/skills/skill/${id}`, { method: "DELETE", authed: true }),

  // ── Langues ──
  createLanguage: (b) => req("/languages", { method: "POST", authed: true, body: b }),
  updateLanguage: (id, b) => req(`/languages/${id}`, { method: "PUT", authed: true, body: b }),
  deleteLanguage: (id) => req(`/languages/${id}`, { method: "DELETE", authed: true }),

  // ── Parcours ──
  createTimeline: (b) => req("/timeline", { method: "POST", authed: true, body: b }),
  updateTimeline: (id, b) => req(`/timeline/${id}`, { method: "PUT", authed: true, body: b }),
  deleteTimeline: (id) => req(`/timeline/${id}`, { method: "DELETE", authed: true }),

  // ── Distinctions ──
  createAward: (b) => req("/awards", { method: "POST", authed: true, body: b }),
  updateAward: (id, b) => req(`/awards/${id}`, { method: "PUT", authed: true, body: b }),
  deleteAward: (id) => req(`/awards/${id}`, { method: "DELETE", authed: true }),

  // ── Messages ──
  getMessages: () => req("/contact/messages", { authed: true }),
  markMessage: (id, read) => req(`/contact/messages/${id}`, { method: "PUT", authed: true, body: { read } }),
  deleteMessage: (id) => req(`/contact/messages/${id}`, { method: "DELETE", authed: true }),
};
