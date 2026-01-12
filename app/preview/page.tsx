"use client";

import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return <p style={{ textAlign: "center" }}>No data to preview.</p>;
  }

  const theme = dark ? darkTheme : lightTheme;

  return (
    <div style={{ ...theme.page }}>
      <button
        onClick={() => setDark(!dark)}
        style={theme.toggle}
      >
        {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div style={theme.card}>
        <h1 style={theme.name}>{data.name}</h1>
        <p style={theme.contact}>
          {data.email} · {data.phone}
        </p>

        <hr style={theme.divider} />

        <section>
          <h3 style={theme.heading}>Professional Summary</h3>
          <p>{data.summary}</p>
        </section>

        <section>
          <h3 style={theme.heading}>Skills</h3>
          <div style={theme.skills}>
            {data.skills.map((skill: string, i: number) => (
              <span key={i} style={theme.skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 style={theme.heading}>Experience</h3>
          {data.experience.map((exp: any, i: number) => (
            <div key={i} style={theme.expCard}>
              <strong>{exp.role}</strong> — {exp.company}
              <div style={theme.duration}>{exp.duration}</div>
              <p>{exp.details}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

/* ================= THEMES ================= */

const lightTheme = {
  page: {
    background: "#f4f4f4",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Inter, Arial",
  },
  card: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#fff",
    padding: 40,
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  name: { marginBottom: 4 },
  contact: { color: "#555" },
  divider: { margin: "20px 0" },
  heading: { marginTop: 30 },
  skills: { display: "flex", gap: 8, flexWrap: "wrap" as const },
  skill: {
    background: "#eee",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 14,
  },
  expCard: {
    marginTop: 15,
    padding: 12,
    borderLeft: "3px solid #000",
  },
  duration: { fontSize: 12, color: "#666" },
  toggle: {
    position: "fixed" as const,
    top: 20,
    right: 20,
    padding: "8px 14px",
    cursor: "pointer",
  },
};

const darkTheme = {
  ...lightTheme,
  page: { ...lightTheme.page, background: "#0f172a", color: "#e5e7eb" },
  card: { ...lightTheme.card, background: "#020617" },
  contact: { color: "#94a3b8" },
  skill: { ...lightTheme.skill, background: "#1e293b" },
  expCard: { ...lightTheme.expCard, borderLeft: "3px solid #38bdf8" },
};
