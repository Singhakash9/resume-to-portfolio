"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Experience = {
  company: string;
  role: string;
  duration: string;
  details: string;
};

/* ================= SECTION HEADERS ================= */

const SECTION_HEADERS = {
  summary: ["summary", "profile", "about"],
  skills: ["skills", "technical skills", "core skills", "data & tools"],
  experience: ["experience", "work experience", "employment"],
};

/* ================= HELPERS ================= */

const normalizeText = (text: string) =>
  text.replace(/\r/g, "").replace(/\n{2,}/g, "\n").trim();

/**
 * Break resume into high-level sections only
 */
const segmentResumeText = (raw: string) => {
  const text = normalizeText(raw);
  const lines = text.split("\n");

  const sections = {
    summary: "",
    skills: [] as string[],
  };

  let current: keyof typeof sections | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase().trim();

    if (SECTION_HEADERS.summary.includes(lower)) {
      current = "summary";
      continue;
    }

    if (SECTION_HEADERS.skills.includes(lower)) {
      current = "skills";
      continue;
    }

    if (!current || !line.trim()) continue;

    if (current === "skills") {
      sections.skills.push(line.trim());
    } else {
      sections.summary += line + " ";
    }
  }

  return sections;
};

/**
 * Convert resume skill paragraphs into clean skill tokens
 */
const normalizeSkills = (rawSkills: string[]) => {
  const cleaned: string[] = [];

  rawSkills.forEach(line => {
    // Remove category labels like "Business Analysis:"
    const noCategory = line.replace(/^[A-Za-z &]+:/, "").trim();

    // Split by commas
    noCategory.split(",").forEach(part => {
      const skill = part
        .replace(/\(.*?\)/g, "") // remove explanations
        .replace(/and /gi, "")
        .trim();

      if (skill.length > 2) cleaned.push(skill);
    });
  });

  return Array.from(new Set(cleaned));
};

/* ================= COMPONENT ================= */

export default function EditorPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  /* ================= LOAD ================= */

  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (!saved) return;

    try {
      const d = JSON.parse(saved);
      setName(d.name || "");
      setEmail(d.email || "");
      setPhone(d.phone || "");
      setSummary(d.summary || "");
      setSkills(d.skills || []);
    } catch {
      console.warn("Invalid saved portfolio data");
    }
  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {
    localStorage.setItem(
      "portfolioData",
      JSON.stringify({
        name,
        email,
        phone,
        summary,
        skills,
      })
    );
  }, [name, email, phone, summary, skills]);

  /* ================= UPLOAD ================= */

  const handleUpload = async (file: File) => {
    let text = "";

    if (file.name.endsWith(".txt")) {
      text = await file.text();
    }

    if (file.name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      text = result.value;
    }

    autoFill(text);
  };

  const autoFill = (text: string) => {
    const emailMatch = text.match(/\S+@\S+\.\S+/);
    if (emailMatch) setEmail(emailMatch[0]);

    const phoneMatch = text.match(/(\+?\d[\d\s-]{8,}\d)/);
    if (phoneMatch) setPhone(phoneMatch[0]);

    const sections = segmentResumeText(text);

    if (!summary && sections.summary) {
      setSummary(sections.summary.slice(0, 500));
    }

    if (skills.length === 0 && sections.skills.length) {
      const normalized = normalizeSkills(sections.skills);
      setSkills(normalized.slice(0, 20));
    }
  };

  /* ================= UI ================= */

  return (
    <div className="editor fade-in">
      <h1>Portfolio Builder</h1>

      <section className="card">
        <h3>Upload Resume (Optional)</h3>
        <input
          type="file"
          accept=".txt,.docx"
          onChange={e => e.target.files && handleUpload(e.target.files[0])}
        />
        <p className="hint">
          Used to prefill summary, skills, email, and phone. Always review.
        </p>
      </section>

      <section className="card">
        <h3>Basic Information</h3>
        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      </section>

      <section className="card">
        <h3>Professional Summary</h3>
        <textarea
          placeholder="Short professional introduction"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
      </section>

      <section className="card">
        <h3>Skills</h3>
        <input
          placeholder="Add a skill manually"
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
        />
        <button
          onClick={() => {
            if (!skillInput.trim()) return;
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
          }}
        >
          Add
        </button>

        <div className="chips">
          {skills.map((s, i) => (
            <span key={i} className="skill-chip">
              {s}
            </span>
          ))}
        </div>
      </section>

      <button
        className="primary"
        onClick={() => (window.location.href = "/preview/")}
      >
        Preview Portfolio
      </button>
    </div>
  );
}
