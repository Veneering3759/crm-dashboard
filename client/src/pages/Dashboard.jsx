import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import TableSkeleton from "../components/TableSkeleton";
import ErrorBanner from "../components/ErrorBanner";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);
      const data = await apiFetch("/api/leads");
      setLeads(Array.isArray(data) ? data : []);
    } catch (e) {
      setLeads([]);
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
        <TableSkeleton rows={6} columns={[{ label: "Lead", width: "w-56" }, { label: "Email", width: "w-64" }, { label: "Company", width: "w-40" }, { label: "Status", width: "w-24" }]} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-slate-500">{leads.length} leads in the system</p>

      {error && (
        <div className="mt-4">
          <ErrorBanner title="Couldn’t load dashboard" message={error} onRetry={load} />
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
