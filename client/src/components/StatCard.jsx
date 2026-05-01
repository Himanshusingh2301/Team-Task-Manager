export default function StatCard({ label, value, tone = "default" }) {
  const toneClass =
    {
      default: "text-slate-900",
      success: "text-emerald-700",
      danger: "text-red-600"
    }[tone] || "text-slate-900";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <strong className={`mt-4 block text-3xl font-semibold tracking-tight ${toneClass}`}>{value}</strong>
    </div>
  );
}
