import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Lock, LayoutDashboard, User, FolderKanban, Cpu, GraduationCap, Trophy,
  Settings, Mail, Globe, LogOut, Menu, ArrowLeft,
} from "lucide-react";
import { api, session } from "../api.js";
import {
  ProfilePanel, ProjectsPanel, SkillsPanel, TimelinePanel,
  AwardsPanel, MessagesPanel, SettingsPanel,
} from "../components/AdminPanels.jsx";

const THEME_KEY = "pf_theme";

export default function Admin() {
  const [authed, setAuthed] = useState(session.isAuthed);
  const theme = localStorage.getItem(THEME_KEY) || "dark";

  if (!authed) return <Login onSuccess={() => setAuthed(true)} theme={theme} />;
  return <Dashboard theme={theme} onLogout={() => { session.logout(); setAuthed(false); }} />;
}

/* ───────────────────────── LOGIN ───────────────────────── */
function Login({ onSuccess, theme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr("");
    try {
      const { token } = await api.login({ email, password });
      session.token = token;
      onSuccess();
    } catch (e) {
      setErr(e.message || "Connexion impossible.");
    } finally { setLoading(false); }
  };

  return (
    <div className="pf" data-theme={theme}>
      <div className="pf-amb" />
      <div className="center-screen">
        <div className="login">
          <h3><Lock size={20} style={{ color: "var(--gold)" }} /> Espace administrateur</h3>
          <p>Connectez-vous pour gérer le contenu du portfolio.</p>
          <div className="fld"><label>Email</label>
            <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" autoFocus /></div>
          <div className="fld"><label>Mot de passe</label>
            <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="••••••••" /></div>
          {err && <div className="err">{err}</div>}
          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={submit} disabled={loading}>
            <LayoutDashboard size={16} /> {loading ? "Connexion…" : "Se connecter"}
          </button>
          <Link to="/" className="back"><ArrowLeft size={14} /> Retour au site</Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── DASHBOARD ───────────────────────── */
const TABS = [
  ["profil", "Profil", User],
  ["projets", "Projets", FolderKanban],
  ["competences", "Compétences", Cpu],
  ["parcours", "Parcours", GraduationCap],
  ["distinctions", "Distinctions", Trophy],
  ["messages", "Messages", Mail],
  ["reglages", "Réglages", Settings],
];

function Dashboard({ theme, onLogout }) {
  const [tab, setTab] = useState("profil");
  const [railOpen, setRailOpen] = useState(false);
  const [data, setData] = useState(null);
  const [unread, setUnread] = useState(0);

  const reload = useCallback(async () => {
    const [profile, projects, skills, languages, timeline, awards, messages] = await Promise.all([
      api.getProfile(), api.getProjects(), api.getSkills(), api.getLanguages(),
      api.getTimeline(), api.getAwards(), api.getMessages().catch(() => []),
    ]);
    setData({ profile, projects, skills, languages, timeline, awards, messages });
    setUnread((messages || []).filter((m) => !m.read).length);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  if (!data) {
    return (
      <div className="pf" data-theme={theme}><div className="center-screen">
        <div style={{ fontFamily: "var(--font-m)", color: "var(--gold)", fontSize: 13 }}>chargement du tableau de bord…</div>
      </div></div>
    );
  }

  const title = TABS.find((t) => t[0] === tab)?.[1] || "";

  return (
    <div className="pf" data-theme={theme}>
      <div className="admin">
        <aside className={"adm-rail" + (railOpen ? " open" : "")}>
          <div className="ar-brand">
            <span className="mono-badge" style={{ width: 34, height: 34, fontSize: 13 }}>{data.profile.monogram || "GZ"}</span> Admin
          </div>
          {TABS.map(([k, label, Ic]) => (
            <button key={k} className={"adm-tab" + (tab === k ? " act" : "")} onClick={() => { setTab(k); setRailOpen(false); }}>
              <Ic size={17} /> {label}
              {k === "messages" && unread > 0 && <span className="pill">{unread}</span>}
            </button>
          ))}
          <div className="spacer" />
          <Link to="/" className="adm-tab"><Globe size={17} /> Voir le site</Link>
          <button className="adm-tab" onClick={onLogout}><LogOut size={17} /> Déconnexion</button>
        </aside>

        <main className="adm-main">
          <div className="adm-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="icon-btn burger" onClick={() => setRailOpen((v) => !v)}><Menu size={18} /></button>
              <div><h2>{title}</h2><p>Les modifications sont enregistrées dans la base de données.</p></div>
            </div>
          </div>

          {tab === "profil" && <ProfilePanel data={data} reload={reload} />}
          {tab === "projets" && <ProjectsPanel data={data} reload={reload} />}
          {tab === "competences" && <SkillsPanel data={data} reload={reload} />}
          {tab === "parcours" && <TimelinePanel data={data} reload={reload} />}
          {tab === "distinctions" && <AwardsPanel data={data} reload={reload} />}
          {tab === "messages" && <MessagesPanel data={data} reload={reload} />}
          {tab === "reglages" && <SettingsPanel data={data} reload={reload} />}
        </main>
      </div>
    </div>
  );
}
