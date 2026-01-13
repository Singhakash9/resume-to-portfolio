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

/* ---------- COMPONENT ---------- */

export default function EditorPage() {
  /* BASIC INFO */
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");

  /* SECTIONS */
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("portfolioData");
    if (!saved) return;

    const d = JSON.parse(saved);
    setName(d.name || "");
    setTitle(d.title || "");
    setEmail(d.email || "");
    setLocation(d.location || "");
    setSummary(d.summary || "");
    setSkills(d.skills || []);
    setExperience(d.experience || []);
    setEducation(d.education || []);
    setProjects(d.projects || []);
  }, []);

  /* ---------- SAVE ---------- */
  useEffect(() => {
    localStorage.setItem(
      "portfolioData",
      JSON.stringify({
        name,
        title,
        email,
        location,
        summary,
        skills,
        experience,
        education,
        projects,
      })
    );
  }, [
    name,
    title,
    email,
    location,
    summary,
    skills,
    experience,
    education,
    projects,
  ]);

  /* ---------- HELPERS ---------- */

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  /* ---------- UI ---------- */

  return (
    <div className="editor">
      <h1>Portfolio Builder</h1>

      {/* BASIC INFO */}
      <section className="card">
        <h2>Basic Information</h2>
        <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Professional Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      </section>

      {/* SUMMARY */}
      <section className="card">
        <h2>Professional Summary</h2>
        <textarea
          placeholder="2–4 sentence overview of your professional profile"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
      </section>

      {/* EXPERIENCE */}
      <section className="card">
        <h2>Experience</h2>

        {experience.map((exp, i) => (
          <div key={i} className="block">
            <input
              placeholder="Role / Title"
              value={exp.role}
              onChange={e => {
                const copy = [...experience];
                copy[i].role = e.target.value;
                setExperience(copy);
              }}
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={e => {
                const copy = [...experience];
                copy[i].company = e.target.value;
                setExperience(copy);
              }}
            />
            <input
              placeholder="Date range"
              value={exp.dates}
              onChange={e => {
                const copy = [...experience];
                copy[i].dates = e.target.value;
                setExperience(copy);
              }}
            />
            <textarea
              placeholder="What did you work on?"
              value={exp.description}
              onChange={e => {
                const copy = [...experience];
                copy[i].description = e.target.value;
                setExperience(copy);
              }}
            />
            <button onClick={() => setExperience(experience.filter((_, x) => x !== i))}>
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setExperience([...experience, { role: "", company: "", dates: "", description: "" }])
          }
        >
          + Add Experience
        </button>
      </section>

      {/* EDUCATION */}
      <section className="card">
        <h2>Education</h2>

        {education.map((edu, i) => (
          <div key={i} className="block">
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={e => {
                const copy = [...education];
                copy[i].degree = e.target.value;
                setEducation(copy);
              }}
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={e => {
                const copy = [...education];
                copy[i].institution = e.target.value;
                setEducation(copy);
              }}
            />
            <input
              placeholder="Date range"
              value={edu.dates}
              onChange={e => {
                const copy = [...education];
                copy[i].dates = e.target.value;
                setEducation(copy);
              }}
            />
            <textarea
              placeholder="Notes (optional)"
              value={edu.notes}
              onChange={e => {
                const copy = [...education];
                copy[i].notes = e.target.value;
                setEducation(copy);
              }}
            />
            <button onClick={() => setEducation(education.filter((_, x) => x !== i))}>
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setEducation([...education, { degree: "", institution: "", dates: "", notes: "" }])
          }
        >
          + Add Education
        </button>
      </section>

      {/* SKILLS */}
      <section className="card">
        <h2>Skills</h2>
        <input
          placeholder="Add a skill"
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
        />
        <button onClick={addSkill}>Add</button>

        <div className="chips">
          {skills.map((s, i) => (
            <span key={i} className="skill-chip">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="card">
        <h2>Projects</h2>

        {projects.map((p, i) => (
          <div key={i} className="block">
            <input
              placeholder="Project name"
              value={p.name}
              onChange={e => {
                const copy = [...projects];
                copy[i].name = e.target.value;
                setProjects(copy);
              }}
            />
            <input
              placeholder="Project link (GitHub / Live)"
              value={p.link}
              onChange={e => {
                const copy = [...projects];
                copy[i].link = e.target.value;
                setProjects(copy);
              }}
            />
            <textarea
              placeholder="Project description"
              value={p.description}
              onChange={e => {
                const copy = [...projects];
                copy[i].description = e.target.value;
                setProjects(copy);
              }}
            />
            <button onClick={() => setProjects(projects.filter((_, x) => x !== i))}>
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setProjects([...projects, { name: "", description: "", link: "" }])
          }
        >
          + Add Project
        </button>
      </section>

      <button className="primary" onClick={() => (window.location.href = "/preview/")}>
        Preview Portfolio
      </button>
    </div>
  );
}
