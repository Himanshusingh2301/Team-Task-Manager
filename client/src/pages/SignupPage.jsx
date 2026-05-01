import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
    adminInviteCode: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Set up an admin or member account and start tracking team delivery in one place."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Login"
    >
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <FormField label="Full name">
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Aarav Singh"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
            required
          />
        </FormField>

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
            placeholder="Minimum 6 characters"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
            required
          />
        </FormField>

        <FormField label="Role">
          <select
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </FormField>

        {form.role === "admin" ? (
          <FormField label="Admin invite code">
            <input
              type="password"
              value={form.adminInviteCode}
              onChange={(event) => setForm((current) => ({ ...current, adminInviteCode: event.target.value }))}
              placeholder="Enter admin invite code"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-3 focus:ring-teal-100"
              required
            />
          </FormField>
        ) : null}

        {error ? <div className="text-sm font-medium text-red-600">{error}</div> : null}

        <button
          type="submit"
          className="mt-1 rounded-2xl bg-[linear-gradient(135deg,#0f5f5c,#0b4c4a)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthLayout>
  );
}
