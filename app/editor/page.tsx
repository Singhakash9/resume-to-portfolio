"use client";

import { useEffect, useState } from "react";

/* ---------- TYPES ---------- */
type Experience = {
  role: string;
  company: string;
  dates: string;
  description: string;
};

type Education = {
  degree: string;
  institution: string;
  dates: string;
  notes: string;
};

type Project = {
  name: string;
  description: string;
  link: string;
};

type Theme = "dark" | "light" | "minimal";

/* ---------- PREVIEW COMPONENT ---------- */
function LivePreview({ data, theme }: { data: any; theme: Theme }) {
  if (!data) return null;

  return (
    <div className={`portfolio ${theme}`}>
      <header className="hero card">
        <h1>{data.name || "Your Name"}</h1>
        <h3>{data.title}</h3>
        <p className="muted">{data.location}</p>
        <p className="muted">{data.email}</p>
      </header>

      {data.summary && (
        <section className="fade-in">
          <h2>Summary</h2>
          <p>{data.summary}</p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="fade-in">
          <h2>Experience</h2>
          {data.experience.map((e: Experience, i: number) => (
            <div key={i} className="card">
              <h3>{e.role}</h3>
              <strong>{e.company}</strong>
              <p className="muted">{e.dates}</p>
              <p>{e.description}</p>
            </div>
          ))}
        </section>
      )}

      {data.projects?.length > 0 && (
        <section className="fade-in">
          <h2>Projects</h2>
          {data.projects.map((p: Project, i: number) => (
            <div key={i} className="card">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              {p.link && (
                <a href={p.link} target="_blank">
                  View →
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="fade-in">
          <h2>Education</h2>
          {data.education.map((e: Education, i: number) => (
            <div key={i} className="card">
              <strong>{e.degree}</strong>
              <p>{e.institution}</p>
              <p className="muted">{e.dates}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills?.length > 0 && (
        <section className="fade-in">
          <h2>Skills</h2>
          <div className="chips">
            {data.skills.map((s: string, i: number) => (
              <span key={i} className="skill-chip">{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- EDITOR ---------- */
export default function EditorPage() {
  const [data, setData] = useState<any>({
    name: "",
    title: "",
    email: "",
    location: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [theme, setTheme] = useState<Theme>("dark");

  /* LOAD */
  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (saved) setData(JSON.parse(saved));
  }, []);

  /* SAVE (DEBOUNCED) */
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem("portfolioData", JSON.stringify(data));
    }, 300);
    return () => clearTimeout(t);
  }, [data]);

  /* HELPERS */
  const update = (key: string, value: any) =>
    setData((d: any) => ({ ...d, [key]: value }));

  return (
    <div className="split-layout">
      {/* ---------- EDITOR ---------- */}
      <div className="editor-pane">
        <div className="editor-header">
          <h1>Portfolio Builder</h1>
          <p className="muted">Live preview • Auto-saved</p>
        </div>

        <section className="card fade-in">
          <h2>Basic Info</h2>
          <input placeholder="Name" value={data.name} onChange={e => update("name", e.target.value)} />
          <input placeholder="Title" value={data.title} onChange={e => update("title", e.target.value)} />
          <input placeholder="Email" value={data.email} onChange={e => update("email", e.target.value)} />
          <input placeholder="Location" value={data.location} onChange={e => update("location", e.target.value)} />
        </section>

        <section className="card fade-in">
          <h2>Summary</h2>
          <textarea value={data.summary} onChange={e => update("summary", e.target.value)} />
        </section>

        <section className="card fade-in">
          <h2>Skills</h2>
          <input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add skill" />
          <button
            className="secondary"
            onClick={() => {
              if (!skillInput.trim()) return;
              update("skills", [...data.skills, skillInput]);
              setSkillInput("");
            }}
          >
            Add
          </button>

          <div className="chips">
            {data.skills.map((s: string, i: number) => (
              <span key={i} className="skill-chip">{s}</span>
            ))}
          </div>
        </section>
      </div>

      {/* ---------- LIVE PREVIEW ---------- */}
      <div className="preview-pane">
        <div className="preview-toolbar">
          {(["dark", "light", "minimal"] as Theme[]).map(t => (
            <button
              key={t}
              className={theme === t ? "primary" : ""}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <LivePreview data={data} theme={theme} />
      </div>
    </div>
  );
}
