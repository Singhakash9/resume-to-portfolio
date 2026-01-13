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
  const [resumeText, setResumeText] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [duration, setDuration] = useState("");
  const [details, setDetails] = useState("");

  const [experience, setExperience] = useState<Experience[]>([]);

  /* ================= LOAD SAVED DATA ================= */

  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setPhone(parsed.phone || "");
      setSummary(parsed.summary || "");
      setSkills(parsed.skills || []);
      setExperience(parsed.experience || []);
    }
  }, []);

  /* ================= AUTO SAVE ================= */

  useEffect(() => {
    localStorage.setItem(
      "resumeData",
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

  /* ================= RESUME UPLOAD (SAFE) ================= */

  const handleResumeUpload = async (file: File) => {
    // 🔑 Dynamic import (browser-only)
    const pdfjsLib = await import("pdfjs-dist");

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    setResumeText(text);
    autoFillFromText(text);
  };

  /* ================= BASIC AUTO-FILL ================= */

  const autoFillFromText = (text: string) => {
    if (!email) {
      const emailMatch = text.match(/\S+@\S+\.\S+/);
      if (emailMatch) setEmail(emailMatch[0]);
    }

    if (!phone) {
      const phoneMatch = text.match(/(\+?\d[\d\s-]{8,}\d)/);
      if (phoneMatch) setPhone(phoneMatch[0]);
    }

    if (!summary) {
      setSummary(text.slice(0, 300));
    }
  };

  /* ================= ACTIONS ================= */

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills(prev => [...prev, skillInput.trim()]);
    setSkillInput("");
  };

  const addExperience = () => {
    if (!company || !role) return;

    setExperience(prev => [
      ...prev,
      { company, role, duration, details },
    ]);

    setCompany("");
    setRole("");
    setDuration("");
    setDetails("");
  };

  /* ================= UI ================= */

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Portfolio Editor</h1>

      {/* RESUME UPLOAD */}
      <h3>Upload Resume (Optional)</h3>
      <input
        type="file"
        accept=".pdf"
        onChange={e =>
          e.target.files && handleResumeUpload(e.target.files[0])
        }
      />
      <p style={{ fontSize: 12, color: "#666" }}>
        PDF only. Used to prefill fields. You can edit everything.
      </p>

      <hr />

      {/* BASIC INFO */}
      <h3>Basic Information</h3>
      <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />

      {/* SUMMARY */}
      <h3>Professional Summary</h3>
      <textarea
        placeholder="Write a short professional summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />

      {/* SKILLS */}
      <h3>Skills</h3>
      <input
        placeholder="Add a skill"
        value={skillInput}
        onChange={e => setSkillInput(e.target.value)}
      />
      <button onClick={addSkill}>Add</button>
      <div style={{ marginTop: 8 }}>{skills.join(", ")}</div>

      {/* EXPERIENCE */}
      <h3>Experience</h3>
      <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
      <input placeholder="Role / Title" value={role} onChange={e => setRole(e.target.value)} />
      <input placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} />
      <textarea
        placeholder="Responsibilities & achievements"
        value={details}
        onChange={e => setDetails(e.target.value)}
      />
      <button onClick={addExperience}>Add Experience</button>

      <br /><br />

      {/* PREVIEW */}
      <button
        onClick={() => (window.location.href = "/preview/")}
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Preview Portfolio
      </button>
    </div>
  );
}
