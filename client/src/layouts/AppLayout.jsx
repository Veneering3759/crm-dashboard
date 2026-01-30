import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function NavItem({ to, label, onClick }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <aside className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">LeadManager</h2>
      </div>

      <nav className="mt-4 flex flex-col gap-1">
        <NavItem to="/app" label="Dashboard" onClick={onNavigate} />
        <NavItem to="/app/leads" label="Leads" onClick={onNavigate} />
        <NavItem to="/app/clients" label="Clients" onClick={onNavigate} />
        <NavItem to="/app/settings" label="Settings" onClick={onNavigate} />
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          Built by{" "}
          <span className="font-semibold text-slate-900">DANIEL ARYEE</span>
          <div className="mt-1 text-slate-500">Portfolio project</div>
        </div>
      </div>
    </aside>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="font-semibold text-slate-900">LeadManager</div>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <div className="sticky top-6 h-[calc(100vh-3rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SidebarContent />
            </div>
          </div>

          {/* Main content */}
          <main className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Inner scroll area so sticky headers (like Leads) behave nicely */}
            <div className="min-w-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* panel */}
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs rounded-r-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">
                LeadManager
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 h-[calc(100%-3rem)]">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
