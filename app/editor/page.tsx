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

  // 🔁 AUTO-LOAD SAVED DATA
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

  // 💾 AUTO-SAVE ON EVERY CHANGE
  useEffect(() => {
    const resumeData = {
      name,
      email,
      phone,
      summary,
      skills,
      experience,
    };
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [name, email, phone, summary, skills, experience]);

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const addExperience = () => {
    if (!company || !role) return;

    setExperience([
      ...experience,
      { company, role, duration, details },
    ]);

    setCompany("");
    setRole("");
    setDuration("");
    setDetails("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Portfolio Editor</h1>

      <h3>Basic Information</h3>
      <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />

      <h3>Professional Summary</h3>
      <textarea
        placeholder="Write a short professional summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />

      <h3>Skills</h3>
      <input
        placeholder="Add a skill"
        value={skillInput}
        onChange={e => setSkillInput(e.target.value)}
      />
      <button onClick={addSkill}>Add</button>
      <div>{skills.join(", ")}</div>

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
      <button onClick={() => window.location.href = "/preview"}>
        Preview
      </button>
    </div>
  );
}
