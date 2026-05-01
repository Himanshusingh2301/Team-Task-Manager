export default function FormField({ label, error, children }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <small className="text-sm text-red-600">{error}</small> : null}
    </label>
  );
}
