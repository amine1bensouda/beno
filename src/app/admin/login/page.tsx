"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const password = new FormData(e.currentTarget).get("password") as string;
    const result = await loginAdmin(password);

    if (!result.success) {
      setError(result.error || "Erreur de connexion.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="mb-1 text-2xl font-black italic text-red-500">BENO</p>
        <h1 className="mb-6 text-xl font-bold text-slate-900">Connexion Admin</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Mot de passe</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full rounded-lg border border-slate-200 px-4 py-3"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-beno-blue py-3 text-sm font-bold text-white hover:bg-beno-navy disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Mot de passe par défaut : admin123
        </p>
      </div>
    </div>
  );
}
