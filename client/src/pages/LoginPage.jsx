import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage projects, assign work, and track delivery progress."
      footerText="Need an account?"
      footerLink="/signup"
      footerLabel="Create one"
    >
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
            required
          />
        </FormField>

        <FormField label="Password">
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
            required
          />
        </FormField>

        {error ? <div className="text-sm font-medium text-red-600">{error}</div> : null}

        <button
          type="submit"
          className="mt-1 rounded-2xl bg-[linear-gradient(135deg,#0f5f5c,#0b4c4a)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Login"}
        </button>

        <p className="text-sm leading-6 text-slate-500">
          Admin access can be selected during signup. For quick testing, create one admin and one member account.
        </p>
      </form>
    </AuthLayout>
  );
}
