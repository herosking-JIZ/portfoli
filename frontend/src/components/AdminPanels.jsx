import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Save, Upload, Mail, CheckCircle, Circle } from "lucide-react";
import { api, uploadFile } from "../api.js";

/* ── Champs réutilisables ── */
function Field({ label, value, onChange, area, placeholder, type = "text" }) {
  return (
    <label className="adm-field">
      <span>{label}</span>
      {area
        ? <textarea className="inp" rows={4} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input className="inp" type={type} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

function Uploader({ accept, label, onUploaded }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true);
    try { const { url } = await uploadFile(file); onUploaded(url); }
    catch (err) { alert(err.message || "Upload échoué."); }
    finally { setBusy(false); if (ref.current) ref.current.value = ""; }
  };
  return (
    <>
      <button className="mini-btn" onClick={() => ref.current?.click()} disabled={busy}>
        <Upload size={14} /> {busy ? "Envoi…" : label}
      </button>
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={pick} />
    </>
  );
}

function Flash({ show }) {
  return show ? <span className="saved-flash"><Save size={14} /> Enregistré</span> : null;
}

/* ───────────────────────── PROFIL ───────────────────────── */
export function ProfilePanel({ data, reload }) {
  const [p, setP] = useState(data.profile);
  const [flash, setFlash] = useState(false);
  useEffect(() => { setP(data.profile); }, [data.profile]);
  const set = (k, v) => setP({ ...p, [k]: v });

  const save = async () => {
    await api.saveProfile(p);
    setFlash(true); setTimeout(() => setFlash(false), 1600);
    reload();
  };

  return (
    <>
      <div className="adm-card">
        <div className="ac-head"><h4>Identité</h4><Flash show={flash} /></div>
        <div className="adm-grid2">
          <Field label="Nom complet" value={p.name} onChange={(v) => set("name", v)} />
          <Field label="Monogramme (2 lettres)" value={p.monogram} onChange={(v) => set("monogram", v)} />
          <Field label="Titre professionnel" value={p.role} onChange={(v) => set("role", v)} />
          <Field label="Statut (badge)" value={p.status} onChange={(v) => set("status", v)} />
        </div>
        <Field label="Phrase d'accroche (accueil)" value={p.tagline} onChange={(v) => set("tagline", v)} area />
        <Field label="Présentation détaillée (À propos)" value={p.about} onChange={(v) => set("about", v)} area />
      </div>

      <div className="adm-card">
        <div className="ac-head"><h4>Photo</h4></div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="avatar" style={{ width: 64, height: 64 }}>
            {p.photoUrl ? <img src={p.photoUrl} alt="" /> : (p.monogram || "GZ")}
          </div>
          <div style={{ flex: 1 }}>
            <Field label="URL photo" value={p.photoUrl} onChange={(v) => set("photoUrl", v)} placeholder="https://…/photo.jpg" />
          </div>
          <Uploader accept="image/*" label="Téléverser" onUploaded={(url) => set("photoUrl", url)} />
        </div>
      </div>

      <div className="adm-card">
        <div className="ac-head"><h4>Objectifs professionnels</h4></div>
        {(p.objectives || []).map((o, i) => (
          <div className="skill-item-row" key={i} style={{ gridTemplateColumns: "1fr 36px" }}>
            <input className="inp" value={o} onChange={(e) => { const a = [...p.objectives]; a[i] = e.target.value; set("objectives", a); }} />
            <button className="mini-btn danger" onClick={() => set("objectives", p.objectives.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
          </div>
        ))}
        <button className="mini-btn" onClick={() => set("objectives", [...(p.objectives || []), "Nouvel objectif"])}><Plus size={14} /> Ajouter</button>
      </div>

      <div className="adm-card">
        <div className="ac-head"><h4>Centres d'intérêt</h4></div>
        <Field label="Séparés par des virgules" value={(p.interests || []).join(", ")}
          onChange={(v) => set("interests", v.split(",").map((s) => s.trim()).filter(Boolean))} />
      </div>

      <div className="adm-card">
        <div className="ac-head"><h4>Coordonnées & liens</h4></div>
        <div className="adm-grid2">
          <Field label="Email" value={p.email} onChange={(v) => set("email", v)} />
          <Field label="Téléphone" value={p.phone} onChange={(v) => set("phone", v)} />
          <Field label="Localisation" value={p.location} onChange={(v) => set("location", v)} />
          <Field label="URL LinkedIn" value={p.linkedin} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/…" />
          <Field label="URL GitHub" value={p.github} onChange={(v) => set("github", v)} placeholder="https://github.com/…" />
        </div>
      </div>

      <div className="adm-card">
        <div className="ac-head"><h4>CV (PDF)</h4></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <Field label="URL du CV" value={p.cvUrl} onChange={(v) => set("cvUrl", v)} placeholder="https://…/cv.pdf" />
          </div>
          <Uploader accept="application/pdf" label="Téléverser le CV" onUploaded={(url) => set("cvUrl", url)} />
        </div>
      </div>

      <button className="mini-btn gold" onClick={save}><Save size={15} /> Enregistrer le profil</button>
    </>
  );
}

/* ───────────────────────── PROJETS ───────────────────────── */
export function ProjectsPanel({ data, reload }) {
  const [items, setItems] = useState(data.projects);
  useEffect(() => { setItems(data.projects); }, [data.projects]);
  const edit = (id, k, v) => setItems(items.map((x) => x.id === id ? { ...x, [k]: v } : x));

  const save = async (pr) => { await api.updateProject(pr.id, pr); reload(); };
  const del = async (id) => { if (confirm("Supprimer ce projet ?")) { await api.deleteProject(id); reload(); } };
  const add = async () => { await api.createProject({ title: "Nouveau projet", category: "Catégorie", tech: [], order: items.length }); reload(); };

  return (
    <>
      {items.map((pr) => (
        <div className="adm-card" key={pr.id}>
          <div className="ac-head"><h4>{pr.title}</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="mini-btn gold" onClick={() => save(pr)}><Save size={14} /> Enregistrer</button>
              <button className="mini-btn danger" onClick={() => del(pr.id)}><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="adm-grid2">
            <Field label="Titre" value={pr.title} onChange={(v) => edit(pr.id, "title", v)} />
            <Field label="Catégorie" value={pr.category} onChange={(v) => edit(pr.id, "category", v)} />
            <Field label="Année" value={pr.year} onChange={(v) => edit(pr.id, "year", v)} />
            <Field label="Distinction (badge)" value={pr.award} onChange={(v) => edit(pr.id, "award", v)} />
          </div>
          <Field label="Description" value={pr.description} onChange={(v) => edit(pr.id, "description", v)} area />
          <Field label="Technologies (séparées par des virgules)" value={(pr.tech || []).join(", ")}
            onChange={(v) => edit(pr.id, "tech", v.split(",").map((s) => s.trim()).filter(Boolean))} />
          <div className="adm-grid2">
            <Field label="Lien GitHub" value={pr.github} onChange={(v) => edit(pr.id, "github", v)} placeholder="https://github.com/…" />
            <Field label="Lien démo" value={pr.demo} onChange={(v) => edit(pr.id, "demo", v)} placeholder="https://…" />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <Field label="Image de couverture (URL)" value={pr.cover} onChange={(v) => edit(pr.id, "cover", v)} placeholder="https://…/image.jpg" />
            </div>
            <Uploader accept="image/*" label="Téléverser" onUploaded={(url) => edit(pr.id, "cover", url)} />
          </div>
        </div>
      ))}
      <button className="mini-btn gold" onClick={add}><Plus size={15} /> Ajouter un projet</button>
    </>
  );
}

/* ───────────────────────── COMPÉTENCES ───────────────────────── */
export function SkillsPanel({ data, reload }) {
  const [cats, setCats] = useState(data.skills);
  const [langs, setLangs] = useState(data.languages);
  useEffect(() => { setCats(data.skills); }, [data.skills]);
  useEffect(() => { setLangs(data.languages); }, [data.languages]);

  const editCat = (id, k, v) => setCats(cats.map((c) => c.id === id ? { ...c, [k]: v } : c));
  const editSkill = (cid, sid, k, v) => setCats(cats.map((c) => c.id === cid
    ? { ...c, skills: c.skills.map((s) => s.id === sid ? { ...s, [k]: v } : s) } : c));

  const saveCat = async (c) => {
    await api.updateCategory(c.id, { name: c.name, icon: c.icon, order: c.order });
    await Promise.all((c.skills || []).map((s) => api.updateSkill(s.id, { name: s.name, level: Number(s.level) })));
    reload();
  };
  const delCat = async (id) => { if (confirm("Supprimer cette catégorie et ses compétences ?")) { await api.deleteCategory(id); reload(); } };
  const addCat = async () => { await api.createCategory({ name: "Nouvelle catégorie", icon: "code", order: cats.length }); reload(); };
  const addSkill = async (cid) => { await api.createSkill(cid, { name: "Nouvelle compétence", level: 60 }); reload(); };
  const delSkill = async (sid) => { await api.deleteSkill(sid); reload(); };

  const editLang = (id, k, v) => setLangs(langs.map((l) => l.id === id ? { ...l, [k]: v } : l));
  const saveLangs = async () => { await Promise.all(langs.map((l) => api.updateLanguage(l.id, { name: l.name, level: l.level }))); reload(); };
  const addLang = async () => { await api.createLanguage({ name: "Langue", level: "Niveau" }); reload(); };
  const delLang = async (id) => { await api.deleteLanguage(id); reload(); };

  return (
    <>
      {cats.map((c) => (
        <div className="adm-card" key={c.id}>
          <div className="ac-head"><h4>{c.name}</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="mini-btn gold" onClick={() => saveCat(c)}><Save size={14} /> Enregistrer</button>
              <button className="mini-btn danger" onClick={() => delCat(c.id)}><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="adm-grid2">
            <Field label="Nom de la catégorie" value={c.name} onChange={(v) => editCat(c.id, "name", v)} />
            <label className="adm-field"><span>Icône</span>
              <select className="inp" value={c.icon} onChange={(e) => editCat(c.id, "icon", e.target.value)}>
                <option value="spark">Étincelle (Analyse)</option>
                <option value="code">Code (Développement)</option>
                <option value="db">Base de données</option>
              </select>
            </label>
          </div>
          {(c.skills || []).map((s) => (
            <div className="skill-item-row" key={s.id}>
              <input className="inp" value={s.name} onChange={(e) => editSkill(c.id, s.id, "name", e.target.value)} />
              <input className="inp" type="number" min="0" max="100" value={s.level} onChange={(e) => editSkill(c.id, s.id, "level", e.target.value)} />
              <button className="mini-btn danger" onClick={() => delSkill(s.id)}><Trash2 size={14} /></button>
            </div>
          ))}
          <button className="mini-btn" onClick={() => addSkill(c.id)}><Plus size={14} /> Compétence</button>
        </div>
      ))}
      <button className="mini-btn gold" onClick={addCat}><Plus size={15} /> Ajouter une catégorie</button>

      <div className="adm-card" style={{ marginTop: 18 }}>
        <div className="ac-head"><h4>Langues</h4>
          <button className="mini-btn gold" onClick={saveLangs}><Save size={14} /> Enregistrer</button>
        </div>
        {langs.map((l) => (
          <div className="skill-item-row" key={l.id}>
            <input className="inp" value={l.name} onChange={(e) => editLang(l.id, "name", e.target.value)} />
            <input className="inp" style={{ width: "auto" }} value={l.level} onChange={(e) => editLang(l.id, "level", e.target.value)} />
            <button className="mini-btn danger" onClick={() => delLang(l.id)}><Trash2 size={14} /></button>
          </div>
        ))}
        <button className="mini-btn" onClick={addLang}><Plus size={14} /> Langue</button>
      </div>
    </>
  );
}

/* ───────────────────────── PARCOURS ───────────────────────── */
export function TimelinePanel({ data, reload }) {
  const [items, setItems] = useState(data.timeline);
  useEffect(() => { setItems(data.timeline); }, [data.timeline]);
  const edit = (id, k, v) => setItems(items.map((x) => x.id === id ? { ...x, [k]: v } : x));
  const save = async (t) => { await api.updateTimeline(t.id, t); reload(); };
  const del = async (id) => { if (confirm("Supprimer cette étape ?")) { await api.deleteTimeline(id); reload(); } };
  const add = async () => { await api.createTimeline({ period: "Année", title: "Intitulé", org: "Établissement", order: items.length }); reload(); };

  return (
    <>
      {items.map((t) => (
        <div className="adm-card" key={t.id}>
          <div className="ac-head"><h4>{t.title}</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="mini-btn gold" onClick={() => save(t)}><Save size={14} /> Enregistrer</button>
              <button className="mini-btn danger" onClick={() => del(t.id)}><Trash2 size={14} /></button>
            </div>
          </div>
          <Field label="Période" value={t.period} onChange={(v) => edit(t.id, "period", v)} />
          <Field label="Intitulé" value={t.title} onChange={(v) => edit(t.id, "title", v)} />
          <Field label="Établissement / organisation" value={t.org} onChange={(v) => edit(t.id, "org", v)} />
        </div>
      ))}
      <button className="mini-btn gold" onClick={add}><Plus size={15} /> Ajouter une étape</button>
    </>
  );
}

/* ───────────────────────── DISTINCTIONS ───────────────────────── */
export function AwardsPanel({ data, reload }) {
  const [items, setItems] = useState(data.awards);
  useEffect(() => { setItems(data.awards); }, [data.awards]);
  const edit = (id, k, v) => setItems(items.map((x) => x.id === id ? { ...x, [k]: v } : x));
  const save = async (a) => { await api.updateAward(a.id, a); reload(); };
  const del = async (id) => { if (confirm("Supprimer cette distinction ?")) { await api.deleteAward(id); reload(); } };
  const add = async () => { await api.createAward({ date: "Date", title: "Distinction", description: "Description", order: items.length }); reload(); };

  return (
    <>
      {items.map((a) => (
        <div className="adm-card" key={a.id}>
          <div className="ac-head"><h4>{a.title}</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="mini-btn gold" onClick={() => save(a)}><Save size={14} /> Enregistrer</button>
              <button className="mini-btn danger" onClick={() => del(a.id)}><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="adm-grid2">
            <Field label="Date" value={a.date} onChange={(v) => edit(a.id, "date", v)} />
            <Field label="Titre" value={a.title} onChange={(v) => edit(a.id, "title", v)} />
          </div>
          <Field label="Description" value={a.description} onChange={(v) => edit(a.id, "description", v)} area />
        </div>
      ))}
      <button className="mini-btn gold" onClick={add}><Plus size={15} /> Ajouter une distinction</button>
    </>
  );
}

/* ───────────────────────── MESSAGES ───────────────────────── */
export function MessagesPanel({ data, reload }) {
  const messages = data.messages || [];
  const toggle = async (m) => { await api.markMessage(m.id, !m.read); reload(); };
  const del = async (id) => { if (confirm("Supprimer ce message ?")) { await api.deleteMessage(id); reload(); } };

  if (!messages.length) {
    return <div className="adm-card"><p style={{ color: "var(--muted)", fontSize: 14 }}>Aucun message pour l'instant. Les messages envoyés via le formulaire de contact apparaîtront ici.</p></div>;
  }
  return (
    <>
      {messages.map((m) => (
        <div className={"msg-card" + (m.read ? "" : " unread")} key={m.id}>
          <div className="mh">
            <b>{m.name} &lt;{m.email}&gt;</b>
            <small>{new Date(m.createdAt).toLocaleString("fr-FR")}</small>
          </div>
          <p>{m.message}</p>
          <div className="ma">
            <a className="mini-btn" href={`mailto:${m.email}?subject=Re: votre message`}><Mail size={14} /> Répondre</a>
            <button className="mini-btn" onClick={() => toggle(m)}>
              {m.read ? <><Circle size={14} /> Marquer non lu</> : <><CheckCircle size={14} /> Marquer lu</>}
            </button>
            <button className="mini-btn danger" onClick={() => del(m.id)}><Trash2 size={14} /> Supprimer</button>
          </div>
        </div>
      ))}
    </>
  );
}

/* ───────────────────────── RÉGLAGES ───────────────────────── */
export function SettingsPanel() {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const change = async () => {
    setMsg("");
    try { await api.setPassword(pw); setPw(""); setMsg("✓ Mot de passe mis à jour."); }
    catch (e) { setMsg(e.message || "Échec."); }
  };
  return (
    <>
      <div className="adm-card">
        <div className="ac-head"><h4>Changer le mot de passe</h4></div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <Field label="Nouveau mot de passe (6 caractères min.)" value={pw} onChange={setPw} type="password" />
          </div>
          <button className="mini-btn gold" onClick={change}><Save size={14} /> Mettre à jour</button>
        </div>
        {msg && <div className="note">{msg}</div>}
      </div>

      <div className="adm-card">
        <div className="ac-head"><h4>À propos de cet espace</h4></div>
        <div className="note">
          Authentification sécurisée par JWT (mot de passe haché côté serveur). L'espace admin est accessible uniquement
          via l'URL <b>/admin</b> — aucun lien n'y mène depuis le site public. Pour le rendre encore plus discret,
          renomme la route dans <b>src/App.jsx</b>.
        </div>
      </div>
    </>
  );
}
