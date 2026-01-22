import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import TableSkeleton from "../components/TableSkeleton";
import ErrorBanner from "../components/ErrorBanner";

const Badge = ({ children }) => (
  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
    {children}
  </span>
);

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);

      const data = await apiFetch("/api/clients");
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      setClients([]);
      setError(err?.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <TableSkeleton
        rows={8}
        columns={[
          { label: "Name", width: "w-32" },
          { label: "Email", width: "w-48" },
          { label: "Business", width: "w-32" },
          { label: "Notes", width: "w-56" },
        ]}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clients</h1>
          <p className="mt-1 text-sm text-slate-500">
            Converted leads show up here.
          </p>
        </div>

        <button
          onClick={load}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <ErrorBanner
          title="Couldn’t load clients"
          message={error}
          onRetry={load}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c._id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{c.email}</td>
                <td className="px-4 py-3">
                  <Badge>{c.business || "—"}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{c.notes || "—"}</td>
              </tr>
            ))}

            {!error && clients.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No clients yet — convert a lead to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
