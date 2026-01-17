import { Link, Outlet, useLocation } from "react-router-dom";

const NavItem = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              LeadManager
            </h2>

            <nav className="flex flex-col gap-1">
              <NavItem to="/app" label="Dashboard" />
              <NavItem to="/app/leads" label="Leads" />
              <NavItem to="/app/clients" label="Clients" />
              <NavItem to="/app/settings" label="Settings" />
            </nav>
          </aside>

          <main className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
