import { useEffect, useState } from "react";
import { apiFetch, getStats } from "../lib/api";
import TableSkeleton from "../components/TableSkeleton";
import ErrorBanner from "../components/ErrorBanner";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);

      const data = await apiFetch("/api/leads");
      setLeads(Array.isArray(data) ? data : []);

      const statsData = await getStats();
      setStats(statsData);
    } catch (e) {
      setLeads([]);
      setStats(null);
      setError(e.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-slate-500">Loading summary…</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total leads" value="—" />
          <StatCard label="New" value="—" />
          <StatCard label="Qualified" value="—" />
          <StatCard label="Clients" value="—" />
          <StatCard label="Conversion" value="—" />
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
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-slate-500">
        {stats?.totalLeads ?? leads.length} leads in the system
      </p>

      {error && (
        <div className="mt-4">
          <ErrorBanner
            title="Couldn’t load dashboard"
            message={error}
            onRetry={load}
          />
        </div>
      )}

      {!error && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total leads" value={stats?.totalLeads ?? leads.length} />
          <StatCard label="New" value={stats?.leadsByStatus?.new ?? 0} />
          <StatCard label="Qualified" value={stats?.leadsByStatus?.qualified ?? 0} />
          <StatCard label="Clients" value={stats?.totalClients ?? 0} />
          <StatCard label="Conversion" value={`${stats?.conversionRate ?? 0}%`} />
        </div>
      )}

      <div className="mt-6 space-y-3">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="font-medium">{lead.name}</div>
            <div className="text-sm text-slate-500">{lead.email}</div>
            <div className="text-sm text-slate-400">
              {lead.business || "No company"}
            </div>
            <div className="mt-2 text-xs uppercase text-emerald-600">
              {lead.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}
