import { useState, useEffect, useRef } from "react";
import {
  Github, ExternalLink, Mail, Phone, MapPin, Linkedin, Download, Moon, Sun,
  Award, ArrowRight, Menu, X, Trophy, Database, Code2, Send, Sparkles, ChevronRight,
} from "lucide-react";
import { api } from "../api.js";
import { DEFAULTS } from "../data/defaults.js";

const SKILL_ICONS = { spark: Sparkles, code: Code2, db: Database };
const THEME_KEY = "pf_theme";

export default function PublicSite() {
  const [profile, setProfile] = useState(DEFAULTS.profile);
  const [projects, setProjects] = useState(DEFAULTS.projects);
  const [skills, setSkills] = useState(DEFAULTS.skills);
  const [languages, setLanguages] = useState(DEFAULTS.languages);
  const [timeline, setTimeline] = useState(DEFAULTS.timeline);
  const [awards, setAwards] = useState(DEFAULTS.awards);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "dark");
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const [progress, setProgress] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    Promise.allSettled([
      api.getProfile(), api.getProjects(), api.getSkills(),
      api.getLanguages(), api.getTimeline(), api.getAwards(),
    ]).then(([p, pr, sk, lg, tl, aw]) => {
      if (p.status === "fulfilled" && p.value?.name) setProfile(p.value);
      if (pr.status === "fulfilled" && Array.isArray(pr.value)) setProjects(pr.value);
      if (sk.status === "fulfilled" && Array.isArray(sk.value) && sk.value.length) setSkills(sk.value);
      if (lg.status === "fulfilled" && Array.isArray(lg.value) && lg.value.length) setLanguages(lg.value);
      if (tl.status === "fulfilled" && Array.isArray(tl.value) && tl.value.length) setTimeline(tl.value);
      if (aw.status === "fulfilled" && Array.isArray(aw.value)) setAwards(aw.value);
    });
  }, []);

  useEffect(() => { localStorage.setItem(THEME_KEY, theme); }, [theme]);

  // reveal au scroll
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    root.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [projects, skills, timeline, awards]);

  // barre de progression + section active
  useEffect(() => {
    const ids = ["accueil", "apropos", "competences", "projets", "parcours", "contact"];
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      let cur = "accueil";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const downloadCV = () => {
    if (profile.cvUrl) window.open(profile.cvUrl, "_blank");
    else alert("Le CV n'est pas encore disponible. (À ajouter dans l'espace admin → Réglages.)");
  };

  const NAV = [
    ["accueil", "Accueil"], ["apropos", "À propos"], ["competences", "Compétences"],
    ["projets", "Projets"], ["parcours", "Parcours"], ["contact", "Contact"],
  ];
  const p = profile;
  const nameParts = (p.name || "").trim().split(" ");

  return (
    <div className="pf" data-theme={theme} ref={rootRef}>
      <div className="pf-amb" />
      <div className="prog" style={{ width: progress + "%" }} />

      <header className="nav">
        <div className="nav-in">
          <div className="brand">
            <span className="mono-badge">{p.monogram || "GZ"}</span>
            <span>{nameParts.slice(0, 2).join(" ")}<small>{p.role}</small></span>
          </div>
          <nav className="nav-links">
            {NAV.map(([id, label]) => (
              <a key={id} className={active === id ? "act" : ""} onClick={() => go(id)}>{label}</a>
            ))}
          </nav>
          <div className="nav-tools">
            <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Thème">
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="icon-btn burger" onClick={() => setNavOpen((v) => !v)}>
              {navOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button className="btn btn-gold" style={{ padding: "10px 16px" }} onClick={() => go("contact")}>Me contacter</button>
          </div>
        </div>
        <div className={"mobile-menu" + (navOpen ? " open" : "")}>
          {NAV.map(([id, label]) => <a key={id} onClick={() => go(id)}>{label}</a>)}
        </div>
      </header>

      {/* HERO */}
      <section id="accueil" className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="reveal">
              <span className="eyebrow">Portfolio · Ingénieur logiciel</span>
              <h1>{nameParts.slice(0, -1).join(" ")}<br /><span className="grad">{nameParts.slice(-1)}</span></h1>
              <div className="role">{p.role}</div>
              <p className="tag">{p.tagline}</p>
              <div className="badges">
                {awards.map((a) => (
                  <span className="badge" key={a.id}><Award size={14} /> {(a.title || "").split(" — ")[0]}</span>
                ))}
              </div>
              <div className="cta-row">
                <button className="btn btn-gold" onClick={() => go("projets")}>Voir mes projets <ArrowRight size={16} /></button>
                <button className="btn btn-ghost" onClick={downloadCV}><Download size={16} /> Télécharger le CV</button>
                <button className="btn btn-ghost" onClick={() => go("contact")}><Mail size={16} /> Me contacter</button>
              </div>
            </div>
            <div className="reveal">
              <div className="spec">
                <div className="spec-head">
                  <div className="avatar">{p.photoUrl ? <img src={p.photoUrl} alt={p.name} /> : (p.monogram || "GZ")}</div>
                  <div><h3>{p.name}</h3><p>{p.role}</p></div>
                </div>
                <div className="spec-row"><span className="k">Localisation</span><span className="v">{p.location}</span></div>
                <div className="spec-row"><span className="k">Statut</span><span className="v on"><span className="dot" />Disponible</span></div>
                <div className="spec-row"><span className="k">Focus</span><span className="v">Web · Bases de données</span></div>
                <div className="spec-row"><span className="k">Stack</span><span className="v">Node · Laravel · PostgreSQL</span></div>
                <div className="spec-row"><span className="k">Distinctions</span><span className="v">{awards.length} récompenses</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="apropos" className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow">À propos</span><h2>Le profil derrière le code</h2></div>
          <div className="about-grid">
            <div className="reveal">
              <p>{p.about}</p>
              <ul className="obj">
                {(p.objectives || []).map((o, i) => <li key={i}><ChevronRight size={17} /> {o}</li>)}
              </ul>
            </div>
            <div className="about-side reveal">
              <h4>Langues</h4>
              {languages.map((l) => <div className="lang-row" key={l.id}><span>{l.name}</span><span>{l.level}</span></div>)}
              <h4 style={{ marginTop: 22 }}>Centres d'intérêt</h4>
              <div className="tags-soft">{(p.interests || []).map((it, i) => <span className="tag-soft" key={i}>{it}</span>)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="competences" className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Compétences</span><h2>Ce que je sais faire</h2>
            <p>De la modélisation des systèmes d'information à la base de données, en passant par le développement web.</p>
          </div>
          <div className="skill-grid">
            {skills.map((cat) => {
              const Ic = SKILL_ICONS[cat.icon] || Code2;
              return (
                <div className="skill-card reveal" key={cat.id}>
                  <div className="sc-head"><span className="sc-ic"><Ic size={19} /></span><h3>{cat.name}</h3></div>
                  {(cat.skills || []).map((it) => (
                    <div className="bar-row" key={it.id}>
                      <div className="bl"><span>{it.name}</span><span>{it.level}%</span></div>
                      <div className="bar"><i style={{ "--lvl": it.level + "%" }} /></div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projets" className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow">Projets</span><h2>Des systèmes qui résolvent un vrai problème</h2></div>
          <div className="proj-grid">
            {projects.map((pr) => (
              <article className="proj reveal" key={pr.id}>
                <div className="proj-cover">
                  {pr.cover ? <img src={pr.cover} alt={pr.title} /> : <span className="pmono">{(pr.title || "").slice(0, 2).toUpperCase()}</span>}
                  {pr.award && <span className="proj-award"><Trophy size={12} /> {pr.award}</span>}
                </div>
                <div className="proj-body">
                  <span className="proj-cat">{pr.category}{pr.year ? " · " + pr.year : ""}</span>
                  <h3>{pr.title}</h3>
                  <p className="pd">{pr.description}</p>
                  <div className="tech-row">{(pr.tech || []).map((t, i) => <span className="chip" key={i}>{t}</span>)}</div>
                  <div className="proj-links">
                    {pr.github ? <a className="plink" href={pr.github} target="_blank" rel="noreferrer"><Github size={15} /> Code</a> : <span className="plink dim"><Github size={15} /> Code</span>}
                    {pr.demo ? <a className="plink" href={pr.demo} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Démo</a> : <span className="plink dim"><ExternalLink size={15} /> Démo</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="parcours" className="section">
        <div className="wrap">
          <div className="sec-head reveal"><span className="eyebrow">Parcours</span><h2>Formation & distinctions</h2></div>
          <div className="about-grid">
            <div className="tl reveal">
              {timeline.map((t) => (
                <div className="tl-item" key={t.id}>
                  <div className="tl-period">{t.period}</div><h3>{t.title}</h3><p>{t.org}</p>
                </div>
              ))}
            </div>
            <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {awards.map((a) => (
                <div className="about-side" key={a.id} style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                    <Trophy size={16} style={{ color: "var(--gold)" }} />
                    <span style={{ fontFamily: "var(--font-m)", fontSize: 11.5, color: "var(--gold)" }}>{a.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-d)", fontSize: 15.5, marginBottom: 7 }}>{a.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.6 }}>{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Contact</span><h2>Travaillons ensemble</h2>
            <p>Stage, mission freelance ou simple échange — écrivez-moi, je réponds vite.</p>
          </div>
          <div className="contact-grid">
            <div className="contact-info reveal">
              <a className="ci-card" href={"mailto:" + p.email}><span className="ci-ic"><Mail size={18} /></span><div><div className="k">Email</div><div className="v">{p.email}</div></div></a>
              <a className="ci-card" href={"tel:" + (p.phone || "").replace(/\s/g, "")}><span className="ci-ic"><Phone size={18} /></span><div><div className="k">Téléphone</div><div className="v">{p.phone}</div></div></a>
              <div className="ci-card"><span className="ci-ic"><MapPin size={18} /></span><div><div className="k">Localisation</div><div className="v">{p.location}</div></div></div>
              {p.linkedin && <a className="ci-card" href={p.linkedin} target="_blank" rel="noreferrer"><span className="ci-ic"><Linkedin size={18} /></span><div><div className="k">LinkedIn</div><div className="v">Voir le profil</div></div></a>}
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <p>© {new Date().getFullYear()} {p.name} · Conçu et développé avec soin.</p>
          <div className="socials">
            {p.github && <a className="icon-btn" href={p.github} target="_blank" rel="noreferrer"><Github size={16} /></a>}
            {p.linkedin && <a className="icon-btn" href={p.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /></a>}
            <a className="icon-btn" href={"mailto:" + p.email}><Mail size={16} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState({ loading: false, ok: false, err: "" });

  const submit = async () => {
    if (!f.name || !f.email || !f.message) { setState({ loading: false, ok: false, err: "Tous les champs sont requis." }); return; }
    setState({ loading: true, ok: false, err: "" });
    try {
      await api.contact(f);
      setState({ loading: false, ok: true, err: "" });
      setF({ name: "", email: "", message: "" });
    } catch (e) {
      setState({ loading: false, ok: false, err: e.message || "Envoi impossible." });
    }
  };

  return (
    <div className="form reveal">
      <div className="fld"><label>Votre nom</label><input className="inp" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ex. Recruteur ABC" /></div>
      <div className="fld"><label>Votre email</label><input className="inp" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="vous@exemple.com" /></div>
      <div className="fld"><label>Message</label><textarea className="inp" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Parlez-moi de votre projet…" /></div>
      <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} onClick={submit} disabled={state.loading}>
        <Send size={16} /> {state.loading ? "Envoi…" : "Envoyer le message"}
      </button>
      {state.ok && <div className="msg-ok">✓ Message envoyé ! Je vous répondrai rapidement.</div>}
      {state.err && <div className="msg-err">{state.err}</div>}
    </div>
  );
}
