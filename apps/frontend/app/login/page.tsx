"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();

  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      loginStore(result.token, result.user);

      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            err.response?.data?.error ??
            "Registration failed.",
        );
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="mb-6 text-3xl font-bold text-white">Login</h1>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 p-3 text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm text-zinc-400">Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-zinc-400">Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 outline-none focus:border-blue-500"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>
    </main>
  );
}
