import { AlertCircle, CheckCircle2, FolderKanban, TimerReset } from "lucide-react";

import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import TaskBadge from "../components/TaskBadge";
import { useAsyncData } from "../hooks/useAsyncData";
import api from "../lib/api";
import { formatDate } from "../lib/utils";

export default function DashboardPage() {
  const { data, loading, error } = useAsyncData(async () => {
    const response = await api.get("/dashboard");
    return response.data;
  }, []);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>;
  }

  const { summary, overdueTasks, upcomingTasks, recentTasks, statusCounts } = data;

  return (
    <div className="grid gap-6">
      <section className="rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)]">
        <div>
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">
            Performance snapshot
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Team delivery dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
            Stay ahead of blockers, keep overdue work visible, and track project execution clearly.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={summary.projectsCount} />
        <StatCard label="Tasks" value={summary.tasksCount} />
        <StatCard label="Completed" value={summary.completedCount} tone="success" />
        <StatCard label="Overdue" value={summary.overdueCount} tone="danger" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Status overview</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <TimerReset size={18} />
              <span className="mt-4 block text-sm font-medium text-slate-500">To Do</span>
              <strong className="mt-2 block text-3xl font-semibold tracking-tight text-slate-900">{statusCounts.todo}</strong>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <FolderKanban size={18} />
              <span className="mt-4 block text-sm font-medium text-slate-500">In Progress</span>
              <strong className="mt-2 block text-3xl font-semibold tracking-tight text-slate-900">
                {statusCounts.in_progress}
              </strong>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <CheckCircle2 size={18} />
              <span className="mt-4 block text-sm font-medium text-slate-500">Done</span>
              <strong className="mt-2 block text-3xl font-semibold tracking-tight text-slate-900">{statusCounts.done}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Overdue tasks</h2>
            <AlertCircle size={18} />
          </div>
          {overdueTasks.length ? (
            <div className="mt-5 grid gap-3">
              {overdueTasks.map((task) => (
                <article className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/55 p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white">
                  <div key={task._id} className="contents">
                  <div className="grid gap-1">
                    <strong className="text-base font-semibold tracking-tight text-slate-900">{task.title}</strong>
                    <p className="text-sm text-slate-500">{task.project?.name}</p>
                  </div>
                  <TaskBadge status={task.status} />
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <small>Due {formatDate(task.dueDate)}</small>
                  </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No overdue work" description="Everything that is assigned is currently on track." />
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Upcoming tasks</h2>
          </div>
          {upcomingTasks.length ? (
            <div className="mt-5 grid gap-3">
              {upcomingTasks.map((task) => (
                <article key={task._id} className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/55 p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white">
                  <div className="grid gap-1">
                    <strong className="text-base font-semibold tracking-tight text-slate-900">{task.title}</strong>
                    <p className="text-sm text-slate-500">{task.project?.name}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <small>{formatDate(task.dueDate)}</small>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No upcoming tasks" description="Create a few tasks to populate the dashboard." />
          )}
        </div>

        <div className="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent tasks</h2>
          </div>
          {recentTasks.length ? (
            <div className="mt-5 grid gap-3">
              {recentTasks.map((task) => (
                <article key={task._id} className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/55 p-4 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white">
                  <div className="grid gap-1">
                    <strong className="text-base font-semibold tracking-tight text-slate-900">{task.title}</strong>
                    <p className="text-sm text-slate-500">{task.assignedTo?.name || "Unassigned"}</p>
                  </div>
                  <TaskBadge status={task.status} />
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No recent tasks" description="Tasks will show up here once your team starts working." />
          )}
        </div>
      </section>
    </div>
  );
}
