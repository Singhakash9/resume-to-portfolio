"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

type Experience = {
  company: string;
  role: string;
  duration: string;
  details: string;
};

type Education = {
  institution: string;
  degree: string;
  duration: string;
};

type Project = {
  name: string;
  description: string;
};

/* ================= SECTION HEADERS ================= */

const SECTION_HEADERS = {
  summary: ["summary", "profile", "about"],
  skills: ["skills", "technical skills", "core skills"],
  experience: ["experience", "work experience", "employment"],
  education: ["education", "academic"],
  projects: ["projects", "personal projects"],
};

/* ================= HELPERS ================= */

const normalizeText = (text: string) =>
  text.replace(/\r/g, "").replace(/\n{2,}/g, "\n").trim();

const segmentResumeText = (raw: string) => {
  const text = normalizeText(raw);
  const lines = text.split("\n");

  const sections: any = {
    summary: "",
    skills: [],
    education: "",
    projects: "",
  };

  let current: keyof typeof sections | null = null;

  for (const line of lines) {
    const lower = line.toLowerCase().trim();

    for (const key in SECTION_HEADERS) {
      if ((SECTION_HEADERS as any)[key].includes(lower)) {
        current = key as any;
        continue;
      }
    }

    if (!current || !line.trim()) continue;

    if (current === "skills") {
      sections.skills.push(line.trim());
    } else {
      sections[current] += line + " ";
    }
  }

  return sections;
};

/* ================= COMPONENT ================= */

export default function EditorPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  /* ================= LOAD / SAVE ================= */

  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (saved) Object.assign(
      {
        setName,
        setEmail,
        setPhone,
        setSummary,
        setSkills,
        setExperience,
        setEducation,
        setProjects,
        setAvatar,
      },
      JSON.parse(saved)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "portfolioData",
      JSON.stringify({
        name,
        email,
        phone,
        summary,
        skills,
        experience,
        education,
        projects,
        avatar,
      })
    );
  }, [name, email, phone, summary, skills, experience, education, projects, avatar]);

  /* ================= UPLOAD ================= */

  const handleUpload = async (file: File) => {
    let text = "";

    if (file.name.endsWith(".txt")) text = await file.text();

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

    if (!summary) setSummary(sections.summary.slice(0, 500));
    if (skills.length === 0) setSkills(sections.skills.slice(0, 15));
  };

  /* ================= AI (OPTIONAL) ================= */

  const improveWithAI = async () => {
    alert(
      "AI enhancement is optional.\n\n" +
      "You can later plug OpenAI / Gemini here.\n" +
      "The app works fully without AI."
    );
  };

  /* ================= UI ================= */

  return (
    <div className="editor fade-in">
      <h1>Portfolio Builder</h1>

      <section className="card">
        <h3>Avatar</h3>
        <input
          type="file"
          accept="image/*"
          onChange={e =>
            e.target.files &&
            setAvatar(URL.createObjectURL(e.target.files[0]))
          }
        />
        {avatar && <img src={avatar} className="avatar" />}
      </section>

      <section className="card">
        <h3>Upload Resume</h3>
        <input type="file" accept=".txt,.docx" onChange={e => e.target.files && handleUpload(e.target.files[0])} />
      </section>

      <section className="card">
        <h3>Basic Info</h3>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      </section>

      <section className="card">
        <h3>Summary</h3>
        <textarea value={summary} onChange={e => setSummary(e.target.value)} />
        <button onClick={improveWithAI}>Improve with AI</button>
      </section>

      <section className="card">
        <h3>Skills</h3>
        <input value={skillInput} onChange={e => setSkillInput(e.target.value)} />
        <button onClick={() => skillInput && setSkills([...skills, skillInput])}>Add</button>
        <div className="chips">{skills.map((s, i) => <span key={i}>{s}</span>)}</div>
      </section>

      <button className="primary" onClick={() => (window.location.href = "/preview/")}>
        Preview Portfolio
      </button>
    </div>
  );
}
