"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleContinue() {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      sessionStorage.setItem("resumeData", JSON.stringify(data));
      router.push("/editor");
    } catch (err) {
      alert("Upload failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="border rounded-lg p-8 w-[420px]">
        <h1 className="text-2xl font-bold mb-4">
          Upload Your Resume
        </h1>

        <p className="text-gray-600 mb-4">
          Upload a <strong>DOCX or TXT</strong> resume for best results.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          (PDF files are not supported)
        </p>

        <input
          type="file"
          accept=".doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-6"
        />

        <button
          onClick={handleContinue}
          disabled={!file || loading}
          className={`w-full py-2 rounded text-white ${
            file ? "bg-black" : "bg-gray-400"
          }`}
        >
          {loading ? "Processing..." : "Continue"}
        </button>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 underline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
