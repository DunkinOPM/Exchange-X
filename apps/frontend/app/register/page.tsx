"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { register } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();

  const loginStore = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await register(email, username, password);

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
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <h1 className="mb-6 text-3xl font-bold text-white">Register</h1>

        {error && (
          <div className="mb-4 rounded bg-red-500/10 p-3 text-red-400">
            {error}
          </div>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3"
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-700"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </main>
  );
}
