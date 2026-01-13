"use client";

import { useEffect, useState } from "react";

type Experience = {
  company: string;
  role: string;
  duration: string;
  details: string;
};

export default function EditorPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [details, setDetails] = useState("");
  const [experience, setExperience] = useState<Experience[]>([]);

  /* ================= LOAD SAVED DATA ================= */

  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (saved) {
      const d = JSON.parse(saved);
      setName(d.name || "");
      setEmail(d.email || "");
      setPhone(d.phone || "");
      setSummary(d.summary || "");
      setSkills(d.skills || []);
      setExperience(d.experience || []);
    }
  }, []);

  /* ================= AUTO SAVE ================= */

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
      })
    );
  }, [name, email, phone, summary, skills, experience]);

  /* ================= RESUME UPLOAD ================= */

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

    setSummary(text.slice(0, 400));
  };

  /* ================= ACTIONS ================= */

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const addExperience = () => {
    if (!company || !role) return;
    setExperience([...experience, { company, role, duration, details }]);
    setCompany("");
    setRole("");
    setDuration("");
    setDetails("");
  };

  /* ================= UI ================= */

  return (
    <div className="editor">
      <h1>Portfolio Builder</h1>

      <section className="card">
        <h3>Upload Resume (Optional)</h3>
        <input
          type="file"
          accept=".txt,.docx"
          onChange={e => e.target.files && handleUpload(e.target.files[0])}
        />
        <p className="hint">Supports .txt and .docx only</p>
      </section>

      <section className="card">
        <h3>Basic Information</h3>
        <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
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
          placeholder="Add a skill"
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
        />
        <button onClick={addSkill}>Add Skill</button>
        <div className="chips">
          {skills.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Experience</h3>
        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
        <input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
        <input placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} />
        <textarea
          placeholder="What did you work on?"
          value={details}
          onChange={e => setDetails(e.target.value)}
        />
        <button onClick={addExperience}>Add Experience</button>
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
