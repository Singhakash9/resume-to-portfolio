"use client";

import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  const [skills, setSkills] = useState<string[]>([]);
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

  /* ================= RESUME UPLOAD ================= */

  const handleResumeUpload = async (file: File) => {
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

  /* ================= BASIC PARSING (V1) ================= */

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

  /* ================= UI ================= */

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>Portfolio Editor</h1>

      {/* UPLOAD */}
      <h3>Upload Resume (Optional)</h3>
      <input
        type="file"
        accept=".pdf"
        onChange={e => e.target.files && handleResumeUpload(e.target.files[0])}
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
      <textarea value={summary} onChange={e => setSummary(e.target.value)} />

      <br /><br />

      <button
        onClick={() => (window.location.href = "/preview/")}
        style={{ padding: "10px 16px", background: "#000", color: "#fff" }}
      >
        Preview Portfolio
      </button>
    </div>
  );
}
