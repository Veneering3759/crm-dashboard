import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

function Badge({ tone = "slate", children }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        tones[tone] || tones.slate
      }`}
    >
      {children}
    </span>
  );
}

function Card({ title, subtitle, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="min-w-0 text-right text-sm font-medium text-slate-900">
        <span className="break-all">{value}</span>
      </div>
    </div>
  );
}

export default function Settings() {
  const [checking, setChecking] = useState(true);
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const apiBase = useMemo(() => {
    // Vite env is compiled at build time, so safe to read directly
    return import.meta.env.VITE_API_URL || "";
  }, []);

  async function runChecks() {
    try {
      setError("");
      setChecking(true);

      // If this fails, backend URL/env is wrong or backend is down
      const h = await apiFetch("/healthz");
      setHealth(h);

      // Stats is a real DB-backed endpoint
      const s = await apiFetch("/api/stats");
      setStats(s);
    } catch (e) {
      setHealth(null);
      setStats(null);
      setError(e?.message || "Health check failed");
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    runChecks();
  }, []);

  const statusTone = !apiBase
    ? "amber"
    : error
    ? "red"
    : checking
    ? "blue"
    : "green";

  const statusText = !apiBase
    ? "Missing VITE_API_URL"
    : error
    ? "Backend unreachable"
    : checking
    ? "Checking…"
    : "Connected";

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Environment checks, project links, and product roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone={statusTone}>{statusText}</Badge>
          <button
            onClick={runChecks}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Re-check
          </button>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <div className="font-semibold">Connection problem</div>
          <div className="mt-1 opacity-90">{error}</div>
          <div className="mt-3 text-xs text-rose-700">
            Tip: confirm your Vercel env var <b>VITE_API_URL</b> matches your
            Render service URL (no trailing slash).
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Connection */}
        <Card
          title="Backend connection"
          subtitle="Live status + database-backed check (stats)."
          right={
            checking ? (
              <Badge tone="blue">Running…</Badge>
            ) : error ? (
              <Badge tone="red">Failed</Badge>
            ) : (
              <Badge tone="green">OK</Badge>
            )
          }
        >
          <div className="divide-y divide-slate-100">
            <Row label="API base URL" value={apiBase || "—"} />
            <Row
              label="Health endpoint"
              value={health ? JSON.stringify(health) : "—"}
            />
            <Row
              label="Stats snapshot"
              value={
                stats
                  ? `Leads: ${stats.totalLeads}, Clients: ${stats.totalClients}, Conversion: ${stats.conversionRate}%`
                  : "—"
              }
            />
          </div>
        </Card>

        {/* Project */}
        <Card
          title="Project links"
          subtitle="Make it easy for recruiters to click around."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/"
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Open marketing site
              <div className="mt-1 text-xs text-slate-500">Landing page</div>
            </a>

            <a
              href="/app"
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Open dashboard
              <div className="mt-1 text-xs text-slate-500">App experience</div>
            </a>

            <a
              href="https://github.com/Veneering3759/leadmanager-crm"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              GitHub repo
              <div className="mt-1 text-xs text-slate-500">
                Replace this link
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/daniel-a-869619399/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              LinkedIn
              <div className="mt-1 text-xs text-slate-500">
                Replace this link
              </div>
            </a>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Recruiter tip</div>
            <div className="mt-1 text-slate-600">
              Add a short “Case Study” on your portfolio: problem → solution →
              architecture → trade-offs. It makes this feel like a shipped
              product, not a tutorial.
            </div>
          </div>
        </Card>

        {/* Stack */}
        <Card
          title="Tech stack"
          subtitle="A quick “at a glance” snapshot."
        >
          <div className="flex flex-wrap gap-2">
            <Badge tone="slate">React</Badge>
            <Badge tone="slate">Vite</Badge>
            <Badge tone="slate">Tailwind</Badge>
            <Badge tone="slate">Node.js</Badge>
            <Badge tone="slate">Express</Badge>
            <Badge tone="slate">MongoDB</Badge>
            <Badge tone="slate">Render</Badge>
            <Badge tone="slate">Vercel</Badge>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Highlights</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Full CRUD flows + conversion (lead → client)</li>
              <li>Dashboard metrics (stats endpoint)</li>
              <li>Responsive UI (table + mobile cards)</li>
              <li>Production deployments (Render + Vercel env wiring)</li>
            </ul>
          </div>
        </Card>

        {/* Roadmap */}
        <Card
          title="Roadmap"
          subtitle="Small additions that make it feel “enterprise” without being huge."
        >
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge tone="green">Next</Badge>
              <div>
                <div className="font-semibold text-slate-900">Activity feed</div>
                <div className="text-slate-600">
                  Log events like “status updated”, “lead converted”, “note added”.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge tone="amber">Soon</Badge>
              <div>
                <div className="font-semibold text-slate-900">Pipeline view</div>
                <div className="text-slate-600">
                  Kanban board for leads (drag & drop stages).
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge tone="slate">Later</Badge>
              <div>
                <div className="font-semibold text-slate-900">Auth</div>
                <div className="text-slate-600">
                  Protect user data + demonstrate backend authorization.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
