"use client";

import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return <p>Nothing to preview</p>;

  return (
    <div className="portfolio">
      <section className="hero">
        <h1>{data.name}</h1>
        <p>{data.summary}</p>
      </section>

      <section>
        <h2>Skills</h2>
        <div className="chips">
          {data.skills.map((s: string, i: number) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </section>

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

      <footer>
        <p>{data.email} · {data.phone}</p>
      </footer>
    </div>
  );
}
