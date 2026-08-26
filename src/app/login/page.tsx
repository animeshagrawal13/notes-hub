"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-16">
      <h1 className="serif text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-sm text-[var(--soft)] mb-8">Sign in to your College Notes Hub account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-white font-semibold disabled:opacity-60"
          style={{ background: "var(--primary)" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-[var(--soft)] mt-6">
        No account?{" "}
        <Link href="/register" className="font-semibold" style={{ color: "var(--primary)" }}>
          Register
        </Link>
      </p>

      <div className="mt-8 card p-4 text-xs text-[var(--faint)]">
        <p className="font-semibold text-[var(--soft)] mb-1">Demo accounts</p>
        <p>Admin: admin@collegenoteshub.dev / Admin@123</p>
        <p>Student: student@collegenoteshub.dev / Student@123</p>
      </div>
    </main>
  );
}
