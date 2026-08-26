"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2 } from "lucide-react";

const RESOURCE_TYPES = [
  "NOTES",
  "HANDWRITTEN_NOTES",
  "PYQ",
  "QUESTION_BANK",
  "ASSIGNMENT",
  "PRACTICAL",
  "LAB_MANUAL",
  "REFERENCE_MATERIAL",
  "IMPORTANT_QUESTIONS",
  "CHEAT_SHEET",
];

export default function UploadForm({ subjects }: { subjects: { id: string; label: string }[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [type, setType] = useState("NOTES");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!session) {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4 text-[var(--soft)]">Sign in to upload notes.</p>
        <button onClick={() => router.push("/login")} className="px-5 py-2.5 rounded-lg text-white font-semibold" style={{ background: "var(--primary)" }}>
          Sign In
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: "var(--primary)" }} />
        <p className="font-semibold mb-1">Your resource has been submitted for review.</p>
        <p className="text-sm text-[var(--soft)] mb-4">An admin will approve it shortly. Track its status in your dashboard.</p>
        <button onClick={() => router.push("/dashboard")} className="px-5 py-2.5 rounded-lg text-white font-semibold" style={{ background: "var(--primary)" }}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title || !subjectId) {
      setError("File, title and subject are required.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    form.append("description", description);
    form.append("subjectId", subjectId);
    if (unitNumber) form.append("unitNumber", unitNumber);
    form.append("type", type);
    form.append("tags", tags);

    const res = await fetch("/api/resources", { method: "POST", body: form });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Upload failed.");
      return;
    }
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="card p-8 flex flex-col items-center gap-2 cursor-pointer border-dashed">
        <UploadCloud size={28} style={{ color: "var(--primary)" }} />
        <span className="text-sm font-medium">{file ? file.name : "Click to choose a PDF, DOCX or PPTX"}</span>
        <input
          type="file"
          accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <div>
        <label className="text-sm font-medium block mb-1">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)]" />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)]" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Subject</label>
          <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)]">
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Unit (optional)</label>
          <input type="number" min={1} max={10} value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)]" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Resource type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)]">
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)]" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button disabled={submitting} className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-60" style={{ background: "var(--primary)" }}>
        {submitting ? "Uploading..." : "Submit for Review"}
      </button>
    </form>
  );
}
