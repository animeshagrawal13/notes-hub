"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-16">
      <h1 className="serif text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-sm text-[var(--soft)] mb-8">Join to bookmark, upload and rate notes.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] outline-none" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] outline-none" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full py-2.5 rounded-lg text-white font-semibold disabled:opacity-60" style={{ background: "var(--primary)" }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-[var(--soft)] mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--primary)" }}>
          Sign in
        </Link>
      </p>
    </main>
  );
}
