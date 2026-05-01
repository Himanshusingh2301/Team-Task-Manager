import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ListTodo, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navClass = ({ isActive }) =>
    [
      "group flex items-center  justify-between gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all duration-150",
      isActive
        ? "border-teal-200 bg-white text-slate-900 shadow-sm ring-2 ring-teal-100"
        : "border-slate-200 bg-white/75 text-slate-600 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-white hover:text-slate-900 hover:shadow-sm"
    ].join(" ");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f3f6fb_100%)] text-slate-900 md:grid md:grid-cols-[288px_1fr]">
      <aside className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f2f6fb_100%)] px-5 py-6 md:min-h-screen md:border-b-0 md:border-r">
        <Link to="/" className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-[linear-gradient(135deg,#0f5f5c,#d08a2f)] text-2xl font-extrabold text-white shadow-[0_12px_24px_rgba(15,95,92,0.20)]">
            TT
          </span>
          <div className="grid gap-0.5">
            <p className="text-[1.75rem] font-bold leading-none tracking-tight text-slate-900">Team Task Manager</p>
            <span className="mt-1 text-base text-slate-500">Plan work, assign fast</span>
          </div>
        </Link>

        <div className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Workspace</div>
        <nav className="mt-4 grid gap-3">
          <NavLink to="/" end className={navClass}>
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-teal-50 group-hover:text-teal-700">
                <LayoutDashboard size={18} />
              </span>
              <span className="text-[1.05rem]">Dashboard</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 transition group-hover:text-teal-600">
              Open
            </span>
          </NavLink>
          <NavLink to="/projects" className={navClass}>
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-teal-50 group-hover:text-teal-700">
                <ListTodo size={18} />
              </span>
              <span className="text-[1.05rem]">Projects</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300 transition group-hover:text-teal-600">
              Open
            </span>
          </NavLink>
        </nav>

        <div className="mt-8 grid gap-4 pt-10  md:mt-auto">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,#eff5f3,#f7efe5)] text-lg font-extrabold text-teal-900">
                {initials || "TT"}
              </span>
              <div>
                <strong className="block text-[1.1rem] font-semibold tracking-tight text-slate-900">{user?.name}</strong>
                <span className="mt-1 inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize tracking-wide text-teal-800">
                  {user?.role}
                </span>
              </div>
            </div>
            <small className="mt-4 block text-[0.95rem] text-slate-500">{user?.email}</small>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-200/80 px-4 py-4 text-[1.05rem] font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-300"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="px-4 py-5 md:px-8 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
