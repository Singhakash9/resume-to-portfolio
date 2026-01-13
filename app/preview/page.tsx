"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "minimal";

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("data");

    if (shared) {
      const decoded = JSON.parse(atob(shared));
      setData(decoded);
      setTheme(decoded.theme || "light");
      return;
    }

    const saved = localStorage.getItem("portfolioData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      setTheme(parsed.theme || "light");
    }
  }, []);

  if (!data) return <p>Nothing to preview</p>;

  const shareLink = `${window.location.origin}/preview/?data=${btoa(
    JSON.stringify({ ...data, theme })
  )}`;

  return (
    <div className={`portfolio ${theme}`}>
      {/* THEME SWITCH */}
      <div className="theme-switch">
        {["light", "dark", "minimal"].map(t => (
          <button
            key={t}
            onClick={() => setTheme(t as Theme)}
            className={theme === t ? "active" : ""}
          >
            {t}
          </button>
        ))}
      </div>

      {/* HERO */}
      <section className="hero">
        <h1>{data.name}</h1>
        <p className="tagline">{data.summary}</p>
      </section>

      {/* SKILLS */}
      <section>
        <h2>Skills</h2>
        <div className="chips">
          {data.skills.map((s: string, i: number) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section>
        <h2>Experience</h2>
        <div className="experience">
          {data.experience.map((e: any, i: number) => (
            <div key={i} className="exp-card">
              <h3>{e.role}</h3>
              <strong>{e.company}</strong>
              <p className="muted">{e.duration}</p>
              <p>{e.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <footer>
        <p>{data.email} · {data.phone}</p>
        <input value={shareLink} readOnly />
        <small>Share this link (read-only)</small>
      </footer>
    </div>
  );
}
