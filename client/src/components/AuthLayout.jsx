import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-md place-items-center">
        <div className="w-full rounded-[28px] border border-slate-200 bg-white p-9 shadow-sm">
          <div>
            <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">
              Delivery-ready assignment build
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>

          {children}

          <p className="mt-6 text-sm text-slate-500">
            {footerText}{" "}
            <Link to={footerLink} className="font-semibold text-teal-800 hover:text-teal-700">
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
