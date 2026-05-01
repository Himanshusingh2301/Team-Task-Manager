import { getTaskStatusLabel } from "../lib/utils";

export default function TaskBadge({ status }) {
  const className =
    {
      todo: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
      in_progress: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      done: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    }[status] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

  return (
    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {getTaskStatusLabel(status)}
    </span>
  );
}
