import { useEffect, useMemo, useState } from "react";
import { apiFetch, getStats } from "../lib/api";
import TableSkeleton from "../components/TableSkeleton";
import ErrorBanner from "../components/ErrorBanner";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  // Simple, readable timestamp
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusPill({ status }) {
  const map = {
    new: "bg-sky-50 text-sky-700 ring-sky-200",
    contacted: "bg-amber-50 text-amber-700 ring-amber-200",
    qualified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closed: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  const cls = map[status] || "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
}

function ActivityIcon({ type }) {
  // Lightweight icon using simple shapes (no extra libs)
  const base = "grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset";
  if (type === "lead_created") return <div className={`${base} bg-sky-50 text-sky-700 ring-sky-200`}>+</div>;
  if (type === "lead_status_updated") return <div className={`${base} bg-amber-50 text-amber-700 ring-amber-200`}>↻</div>;
  if (type === "lead_converted") return <div className={`${base} bg-emerald-50 text-emerald-700 ring-emerald-200`}>✓</div>;
  if (type === "lead_deleted") return <div className={`${base} bg-rose-50 text-rose-700 ring-rose-200`}>–</div>;
  return <div className={`${base} bg-slate-50 text-slate-700 ring-slate-200`}>•</div>;
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
          {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
        </div>

        <div className="h-9 w-9 rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200" />
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);

      const [leadsData, statsData, activityData] = await Promise.all([
        apiFetch("/api/leads"),
        getStats(),
        apiFetch("/api/activity"),
      ]);

      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setStats(statsData || null);
      setActivity(Array.isArray(activityData) ? activityData : []);
    } catch (e) {
      setLeads([]);
      setStats(null);
      setActivity([]);
      setError(e?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const recentLeads = useMemo(() => leads.slice(0, 8), [leads]);
  const totalLeads = stats?.totalLeads ?? leads.length;

  if (loading) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Loading summary…</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total leads" value="—" />
          <StatCard label="New" value="—" />
          <StatCard label="Qualified" value="—" />
          <StatCard label="Clients" value="—" />
          <StatCard label="Conversion" value="—" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Recent leads</div>
                <div className="text-xs text-slate-500">Latest records</div>
              </div>
            </div>

            <TableSkeleton
              rows={6}
              columns={[
                { label: "Lead", width: "w-56" },
                { label: "Email", width: "w-64" },
                { label: "Company", width: "w-40" },
                { label: "Status", width: "w-24" },
              ]}
            />
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold text-slate-900">Recent activity</div>
            <div className="mt-2 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">{totalLeads} leads in the system</p>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <ErrorBanner title="Couldn’t load dashboard" message={error} onRetry={load} />
      )}

      {!error && (
        <>
          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Total leads" value={totalLeads} hint="All time" />
            <StatCard label="New" value={stats?.leadsByStatus?.new ?? 0} hint="Need follow-up" />
            <StatCard label="Qualified" value={stats?.leadsByStatus?.qualified ?? 0} hint="High intent" />
            <StatCard label="Clients" value={stats?.totalClients ?? 0} hint="Converted" />
            <StatCard label="Conversion" value={`${stats?.conversionRate ?? 0}%`} hint="Leads → clients" />
          </div>

          {/* Main grid */}
          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            {/* Recent leads */}
            <Card className="overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Recent leads</div>
                  <div className="mt-0.5 text-xs text-slate-500">Latest 8 records</div>
                </div>
                <div className="text-xs text-slate-500">{leads.length} total</div>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead._id} className="border-t border-slate-200 hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                        <td className="px-4 py-3 text-slate-600">{lead.business || "—"}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={lead.status} />
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-slate-500">
                          {formatTime(lead.createdAt)}
                        </td>
                      </tr>
                    ))}

                    {recentLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                          No leads yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-4 md:hidden">
                {recentLeads.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
                    No leads yet.
                  </div>
                ) : (
                  recentLeads.map((lead) => (
                    <div key={lead._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-900">{lead.name}</div>
                          <div className="truncate text-sm text-slate-600">{lead.email}</div>
                          <div className="mt-1 truncate text-xs text-slate-500">{lead.business || "—"}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusPill status={lead.status} />
                          <div className="text-xs text-slate-500">{formatTime(lead.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Activity timeline */}
            <Card className="overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Recent activity</div>
                  <div className="mt-0.5 text-xs text-slate-500">Live audit trail (API)</div>
                </div>
                <button
                  onClick={load}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>

              <div className="p-4">
                {activity.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    No activity yet. Create a lead or update a status to generate events.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activity.slice(0, 10).map((item) => (
                      <div key={item._id} className="flex gap-3">
                        <ActivityIcon type={item.type} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">{item.title}</div>
                          <div className="mt-0.5 text-xs text-slate-500">{formatTime(item.createdAt)}</div>

                          {/* optional meta preview */}
                          {item?.meta?.email ? (
                            <div className="mt-1 truncate text-xs text-slate-500">
                              {item.meta.email}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
