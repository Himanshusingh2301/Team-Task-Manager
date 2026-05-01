import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PencilLine, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import TaskBadge from "../components/TaskBadge";
import { useAuth } from "../context/AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import api from "../lib/api";
import { formatDate, getDueState } from "../lib/utils";

const initialTaskForm = {
  title: "",
  description: "",
  assignedTo: "",
  project: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [taskError, setTaskError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "", members: [] });
  const [projectError, setProjectError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const projectState = useAsyncData(async () => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  }, [projectId]);

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

  const project = projectState.data?.project;
  const tasks = projectState.data?.tasks || [];
  const users = usersState.data || [];

  const inputClass =
    "w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition duration-150 placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";
  const sectionClass =
    "rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.22)] backdrop-blur";

  const groupedTasks = useMemo(
    () => ({
      todo: tasks.filter((task) => task.status === "todo"),
      in_progress: tasks.filter((task) => task.status === "in_progress"),
      done: tasks.filter((task) => task.status === "done")
    }),
    [tasks]
  );

  const projectMetrics = useMemo(() => {
    const done = groupedTasks.done.length;
    const inProgress = groupedTasks.in_progress.length;
    const completionRate = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

    return { done, inProgress, completionRate };
  }, [groupedTasks, tasks.length]);

  useEffect(() => {
    if (!project) {
      return;
    }

    setProjectForm({
      name: project.name,
      description: project.description || "",
      members: project.members.map((member) => member._id)
    });
  }, [project]);

  async function handleCreateTask(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setTaskError("");
      const payload = {
        ...taskForm,
        project: projectId
      };

      if (!payload.dueDate) {
        delete payload.dueDate;
      }

      await api.post("/tasks", payload);
      setTaskForm({ ...initialTaskForm, project: projectId });
      await projectState.refresh();
    } catch (error) {
      setTaskError(error.response?.data?.message || "Unable to create task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      await projectState.refresh();
    } catch (error) {
      setTaskError(error.response?.data?.message || "Unable to update task status.");
    }
  }

  function handleProjectMemberChange(memberId) {
    setProjectForm((current) => {
      const exists = current.members.includes(memberId);

      return {
        ...current,
        members: exists ? current.members.filter((item) => item !== memberId) : [...current.members, memberId]
      };
    });
  }

  async function handleProjectUpdate(event) {
    event.preventDefault();

    try {
      setSavingProject(true);
      setProjectError("");
      setProjectSuccess("");
      await api.put(`/projects/${projectId}`, projectForm);
      setProjectSuccess("Project details updated successfully.");
      await projectState.refresh();
    } catch (error) {
      setProjectError(error.response?.data?.message || "Unable to update the project.");
    } finally {
      setSavingProject(false);
    }
  }

  async function handleProjectDelete() {
    const confirmed = window.confirm("Delete this project and all its tasks? This action cannot be undone.");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProject(true);
      setProjectError("");
      await api.delete(`/projects/${projectId}`);
      navigate("/projects");
    } catch (error) {
      setProjectError(error.response?.data?.message || "Unable to delete the project.");
      setDeletingProject(false);
    }
  }

  if (projectState.loading) {
    return <div className={sectionClass}>Loading project...</div>;
  }

  if (projectState.error || usersState.error) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        {projectState.error || usersState.error}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link to="/projects" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-700">
            <ArrowLeft size={16} />
            Back to projects
          </Link>
          <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">
            Project details
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">{project.name}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
            {project.description || "No description provided for this project yet."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {project.members.map((member) => (
            <div key={member._id} className="min-w-[140px] rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-3">
              <strong className="block text-sm font-semibold text-slate-900">{member.name}</strong>
              <span className="mt-1 block text-xs font-medium capitalize text-slate-500">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_1fr]">
        <div className="rounded-[30px] bg-[linear-gradient(135deg,#115d5a,#0b4c4a)] p-7 text-white shadow-[0_22px_48px_-28px_rgba(15,95,92,0.48)]">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
            Delivery
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">{projectMetrics.completionRate}% complete</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90">
            This project's overall progress is based on how many tracked tasks are marked done.
          </p>
        </div>

        <div className={sectionClass}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <strong className="block text-3xl font-semibold tracking-tight text-slate-900">{tasks.length}</strong>
              <span className="mt-2 block text-sm text-slate-500">Total tasks</span>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <strong className="block text-3xl font-semibold tracking-tight text-slate-900">{projectMetrics.inProgress}</strong>
              <span className="mt-2 block text-sm text-slate-500">In progress</span>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-5">
              <strong className="block text-3xl font-semibold tracking-tight text-slate-900">{project.members.length}</strong>
              <span className="mt-2 block text-sm text-slate-500">Team members</span>
            </div>
          </div>
        </div>
      </section>

      {user.role === "admin" ? (
        <section className={`${sectionClass} overflow-hidden p-0`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-7 py-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Manage project</h2>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
              <PencilLine size={18} />
            </span>
          </div>
          <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-7 py-6">
            <p className="max-w-2xl text-sm leading-6 text-slate-500">
              Update the project brief, adjust the team, or remove the project if it is no longer needed.
            </p>

            <form className="mt-6 grid auto-rows-min gap-5 md:grid-cols-2 md:items-start" onSubmit={handleProjectUpdate}>
              <FormField label="Project name">
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))}
                  className={inputClass}
                  placeholder="Website redesign"
                  required
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  rows="4"
                  value={projectForm.description}
                  onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                  className={`${inputClass} min-h-[132px] resize-y`}
                  placeholder="Add project scope, owner, and execution notes."
                />
              </FormField>

              <div className="grid gap-3 md:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Team members</span>
                <div className="flex flex-wrap gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/80 p-3">
                  {users.map((member) => (
                    <label
                      key={member._id}
                      className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_24px_-22px_rgba(15,23,42,0.4)] transition hover:border-teal-200 hover:bg-teal-50/40"
                    >
                      <input
                        type="checkbox"
                        checked={projectForm.members.includes(member._id)}
                        onChange={() => handleProjectMemberChange(member._id)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {member.name} <small>({member.role})</small>
                      </span>
                    </label>
                  ))}
                </div>
                <small className="text-sm text-slate-500">
                  Admins are kept on the project automatically so management access is preserved.
                </small>
              </div>

              {projectError ? <div className="md:col-span-2 text-sm font-medium text-red-600">{projectError}</div> : null}
              {projectSuccess ? <div className="md:col-span-2 text-sm font-medium text-emerald-700">{projectSuccess}</div> : null}

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-[linear-gradient(135deg,#0f5f5c,#0b4c4a)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-22px_rgba(15,95,92,0.55)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={savingProject}
                >
                  {savingProject ? "Saving..." : "Save project changes"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleProjectDelete}
                  disabled={deletingProject}
                >
                  <Trash2 size={16} />
                  {deletingProject ? "Deleting..." : "Delete project"}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      {user.role === "admin" ? (
        <section className={`${sectionClass} overflow-hidden p-0`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-7 py-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Create task</h2>
          </div>
          <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfd_100%)] px-7 py-6">
            <p className="max-w-2xl text-sm leading-6 text-slate-500">
              Assign work, set deadlines, and keep the team moving with clear ownership.
            </p>

            <form className="mt-6 grid auto-rows-min gap-5 md:grid-cols-2 md:items-start" onSubmit={handleCreateTask}>
              <FormField label="Title">
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
                  className={inputClass}
                  placeholder="Design handoff review"
                  required
                />
              </FormField>

              <FormField label="Assignee">
                <select
                  value={taskForm.assignedTo}
                  onChange={(event) => setTaskForm((current) => ({ ...current, assignedTo: event.target.value }))}
                  className={inputClass}
                  required
                >
                  <option value="">Select member</option>
                  {project.members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Priority">
                <select
                  value={taskForm.priority}
                  onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))}
                  className={inputClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  value={taskForm.status}
                  onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))}
                  className={inputClass}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </FormField>

              <FormField label="Due date">
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(event) => setTaskForm((current) => ({ ...current, dueDate: event.target.value }))}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  rows="3"
                  value={taskForm.description}
                  onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))}
                  className={`${inputClass} min-h-[124px] resize-y`}
                  placeholder="Add the expected outcome or important notes."
                />
              </FormField>

              {taskError ? <div className="md:col-span-2 text-sm font-medium text-red-600">{taskError}</div> : null}

              <button
                type="submit"
                className="w-fit rounded-2xl bg-[linear-gradient(135deg,#0f5f5c,#0b4c4a)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-22px_rgba(15,95,92,0.55)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create task"}
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          ["todo", "To Do"],
          ["in_progress", "In Progress"],
          ["done", "Done"]
        ].map(([key, label]) => (
          <div key={key} className={sectionClass}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">{label}</h2>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {groupedTasks[key].length}
              </span>
            </div>

            {groupedTasks[key].length ? (
              <div className="mt-5 grid gap-3">
                {groupedTasks[key].map((task) => (
                  <article
                    key={task._id}
                    className={`grid gap-3 rounded-[24px] border bg-slate-50/55 p-4 transition hover:-translate-y-0.5 hover:bg-white ${
                      getDueState(task) === "overdue"
                        ? "border-red-200"
                        : getDueState(task) === "today"
                          ? "border-amber-200"
                          : "border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <strong className="text-base font-semibold tracking-tight text-slate-900">{task.title}</strong>
                        <p className="mt-1 text-sm text-slate-500">{task.assignedTo?.name}</p>
                      </div>
                      <TaskBadge status={task.status} />
                    </div>

                    <p className="text-sm leading-6 text-slate-500">{task.description || "No description provided."}</p>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <small>Due {formatDate(task.dueDate)}</small>
                      <small
                        className={`font-semibold capitalize ${
                          task.priority === "high"
                            ? "text-red-600"
                            : task.priority === "medium"
                              ? "text-amber-700"
                              : "text-sky-700"
                        }`}
                      >
                        {task.priority}
                      </small>
                    </div>

                    {user.role === "admin" || task.assignedTo?._id === user.id ? (
                      <label className="grid gap-2">
                        <span className="text-sm font-semibold text-slate-700">Update status</span>
                        <select
                          value={task.status}
                          onChange={(event) => handleStatusChange(task._id, event.target.value)}
                          className={inputClass}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </label>
                    ) : (
                      <small className="text-sm text-slate-500">
                        This task can only be updated by the assigned member or an admin.
                      </small>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState title={`No ${label.toLowerCase()} tasks`} description="Move work here as the team progresses." />
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
