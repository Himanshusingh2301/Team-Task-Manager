import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Plus, Users } from "lucide-react";

import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import api from "../lib/api";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", description: "", members: [] });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");

  const projectsState = useAsyncData(async () => {
    const response = await api.get("/projects");
    return response.data.projects;
  }, []);

  const usersState = useAsyncData(
    async () => {
      if (user.role !== "admin") {
        return [];
      }

      const response = await api.get("/users");
      return response.data.users;
    },
    [user.role]
  );

  const users = usersState.data || [];
  const projects = projectsState.data || [];
  const loading = projectsState.loading || usersState.loading;
  const error = projectsState.error || usersState.error;

  const memberOptions = useMemo(
    () => users.filter((member) => member.id !== user.id && member._id !== user.id),
    [users, user.id]
  );

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return projects;
    }

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.members.some((member) => member.name.toLowerCase().includes(query))
      );
    });
  }, [projects, search]);

  const workspaceStats = useMemo(() => {
    const totalTasks = projects.reduce((sum, project) => sum + project.taskCount, 0);
    const completedTasks = projects.reduce((sum, project) => sum + project.completedTaskCount, 0);
    const totalMembers = new Set(projects.flatMap((project) => project.members.map((member) => member._id))).size;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      totalMembers,
      completionRate
    };
  }, [projects]);

  const inputClass =
    "w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition duration-150 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";
  const sectionClass =
    "rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.22)] backdrop-blur";
  const metricClass =
    "rounded-[26px] border border-white/70 bg-white/90 px-5 py-4 shadow-[0_16px_34px_-24px_rgba(15,23,42,0.24)] backdrop-blur";

  async function handleCreateProject(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFormError("");
      await api.post("/projects", form);
      setForm({ name: "", description: "", members: [] });
      await projectsState.refresh();
    } catch (error) {
      setFormError(error.response?.data?.message || "Unable to create project.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleMemberChange(memberId) {
    setForm((current) => {
      const exists = current.members.includes(memberId);

      return {
        ...current,
        members: exists ? current.members.filter((item) => item !== memberId) : [...current.members, memberId]
      };
    });
  }

  if (loading) {
    return <div className={sectionClass}>Loading projects...</div>;
  }

  if (error) {
    return <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">{error}</div>;
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] xl:flex-row xl:items-end xl:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">
            Workspace
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">Projects</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
            Plan delivery, shape teams, and manage every project from kickoff to completion.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className={metricClass}>
            <div className="flex items-center gap-3">
            <FolderKanban size={18} />
            <div>
                <strong className="block text-2xl font-semibold tracking-tight text-slate-900">{projects.length}</strong>
                <span className="text-sm text-slate-500">Projects</span>
              </div>
            </div>
          </div>
          <div className={metricClass}>
            <div className="flex items-center gap-3">
            <Users size={18} />
            <div>
                <strong className="block text-2xl font-semibold tracking-tight text-slate-900">
                  {workspaceStats.totalMembers}
                </strong>
                <span className="text-sm text-slate-500">People involved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
        <div className="rounded-[30px] bg-[linear-gradient(135deg,#115d5a,#0b4c4a)] p-7 text-white shadow-[0_22px_48px_-28px_rgba(15,95,92,0.48)]">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            Execution
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">{workspaceStats.completionRate}% completion rate</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90">
            Across all visible projects, this is how much tracked work is already complete.
          </p>
        </div>
        <div className={sectionClass}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Workspace pulse</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5">
              <strong className="block text-3xl font-semibold tracking-tight text-slate-900">{workspaceStats.totalTasks}</strong>
              <span className="mt-2 block text-sm text-slate-500">Total tasks</span>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5">
              <strong className="block text-3xl font-semibold tracking-tight text-slate-900">
                {projects.filter((project) => project.taskCount > 0).length}
              </strong>
              <span className="mt-2 block text-sm text-slate-500">Active projects</span>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-5">
              <strong className="block text-3xl font-semibold tracking-tight text-slate-900">
                {projects.filter((project) => project.completedTaskCount === project.taskCount && project.taskCount > 0).length}
              </strong>
              <span className="mt-2 block text-sm text-slate-500">Completed projects</span>
            </div>
          </div>
        </div>
      </section>

      {user.role === "admin" ? (
        <section className={`${sectionClass} overflow-hidden p-0`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-7 py-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Create project</h2>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
              <Plus size={18} />
            </span>
          </div>
          <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-7 py-6">
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Define a project, describe the outcome, and choose the team members who should collaborate on it.
          </p>
          <form className="mt-6 grid auto-rows-min gap-5 md:grid-cols-2 md:items-start" onSubmit={handleCreateProject}>
            <FormField label="Project name">
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className={inputClass}
                placeholder="Website redesign"
                required
              />
            </FormField>

            <FormField label="Description">
              <textarea
                rows="3"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className={`${inputClass} min-h-[124px] resize-y`}
                placeholder="Summarize the goal, deliverables, and scope."
              />
            </FormField>

            <div className="grid gap-3 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Team members</span>
              <div className="flex flex-wrap gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-3">
                {memberOptions.map((member) => (
                  <label
                    key={member._id}
                    className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.4)] transition hover:border-teal-200 hover:bg-teal-50/40"
                  >
                    <input
                      type="checkbox"
                      checked={form.members.includes(member._id)}
                      onChange={() => handleMemberChange(member._id)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      {member.name} <small>({member.role})</small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {formError ? <div className="md:col-span-2 text-sm font-medium text-red-600">{formError}</div> : null}

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-1">
              <p className="text-sm text-slate-400">Projects appear instantly in the workspace after creation.</p>
              <button
                type="submit"
                className="inline-flex w-fit items-center rounded-2xl bg-[linear-gradient(135deg,#0f5f5c,#0b4c4a)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-22px_rgba(15,95,92,0.55)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create project"}
              </button>
            </div>
          </form>
          </div>
        </section>
      ) : null}

      <section className={`${sectionClass} bg-white/90`}>
        <FormField label="Search projects or teammates">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by project name, description, or member"
            className={inputClass}
          />
        </FormField>
      </section>

      <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {filteredProjects.length ? (
          filteredProjects.map((project) => {
            const progress = project.taskCount ? Math.round((project.completedTaskCount / project.taskCount) * 100) : 0;

            return (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="grid gap-5 rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.24)] transition duration-200 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.28)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-900">{project.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {project.description || "No description provided."}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {project.members.length} members
                  </span>
                </div>

                <div className="grid gap-2 rounded-[22px] bg-slate-50/75 p-4 ring-1 ring-slate-200/70">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-slate-500">Progress</span>
                    <strong className="text-lg font-semibold tracking-tight text-slate-900">{progress}%</strong>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#0f5f5c,#c97a22)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{project.taskCount} tasks</span>
                  <span>{project.completedTaskCount} completed</span>
                </div>

                <div className="flex items-center justify-between rounded-[18px] bg-teal-50/70 px-4 py-3 text-sm font-semibold text-teal-800">
                  <span>Open project workspace</span>
                  <strong>Manage</strong>
                </div>
              </Link>
            );
          })
        ) : (
          <EmptyState
            title={projects.length ? "No matching projects" : "No projects yet"}
            description={
              projects.length
                ? "Try a different search term to find the project or teammate you need."
                : "Create the first project to start assigning tasks."
            }
          />
        )}
      </section>
    </div>
  );
}
