"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "minimal";

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return <p>Nothing to preview</p>;

  const shareLink =
    window.location.origin +
    "/preview/?data=" +
    encodeURIComponent(JSON.stringify(data));

  return (
    <div className={`portfolio ${theme}`}>
      <div className="theme-switch">
        {(["light", "dark", "minimal"] as Theme[]).map(t => (
          <button key={t} onClick={() => setTheme(t)}>
            {t}
          </button>
        ))}
      </div>

      <header className="hero">
        <h1>{data.name}</h1>
        <h3>{data.title}</h3>
        <p>{data.location}</p>
        <p>{data.email}</p>
      </header>

      <section>
        <h2>Summary</h2>
        <p>{data.summary}</p>
      </section>

      {data.experience?.length > 0 && (
        <section>
          <h2>Experience</h2>
          {data.experience.map((e: any, i: number) => (
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
        <section>
          <h2>Projects</h2>
          {data.projects.map((p: any, i: number) => (
            <div key={i} className="card">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              {p.link && (
                <a href={p.link} target="_blank">
                  View project →
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education?.length > 0 && (
        <section>
          <h2>Education</h2>
          {data.education.map((e: any, i: number) => (
            <div key={i} className="card">
              <strong>{e.degree}</strong>
              <p>{e.institution}</p>
              <p className="muted">{e.dates}</p>
            </div>
          ))}
        </section>
      )}

      {data.skills?.length > 0 && (
        <section>
          <h2>Skills</h2>
          <div className="chips">
            {data.skills.map((s: string, i: number) => (
              <span key={i} className="skill-chip">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      <footer>
        <input value={shareLink} readOnly />
        <small>Share this portfolio link (read-only)</small>
      </footer>
    </div>
  );
}
