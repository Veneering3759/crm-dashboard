import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const STATUSES = ["new", "contacted", "qualified", "closed"];

const ColumnShell = ({ title, count, children, isOver }) => (
  <div
    className={[
      "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition",
      isOver ? "ring-2 ring-slate-300" : "",
    ].join(" ")}
  >
    <div className="mb-3 flex items-center justify-between">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {count}
      </div>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

function LeadCard({ lead, onView }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead._id,
    });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "rounded-2xl border border-slate-200 bg-slate-50 p-3",
        isDragging ? "opacity-40" : "opacity-100",
      ].join(" ")}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {lead.name}
          </div>
          <div className="truncate text-xs text-slate-600">{lead.email}</div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {lead.business || "No company"}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onView?.(lead);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs hover:bg-slate-50"
        >
          View
        </button>
      </div>
    </div>
  );
}

function DroppableColumn({ status, title, count, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col:${status}`,
  });

  return (
    <div ref={setNodeRef}>
      <ColumnShell title={title} count={count} isOver={isOver}>
        {children}
      </ColumnShell>
    </div>
  );
}

export default function Pipeline() {
  const API = import.meta.env.VITE_API_URL;

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState(null);

  async function load() {
    setLoading(true);
    const data = await fetch(`${API}/api/leads`).then((r) => r.json());
    setLeads(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map((s) => [s, []]));
    for (const l of leads) {
      const s = STATUSES.includes(l.status) ? l.status : "new";
      map[s].push(l);
    }
    return map;
  }, [leads]);

  function findLead(id) {
    return leads.find((l) => l._id === id);
  }

  async function updateStatus(id, status) {
    const res = await fetch(`${API}/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || "Failed to update status");
    }
  }

  const handleDragStart = (event) => {
    const id = event.active?.id;
    if (!id) return;
    setActiveLead(findLead(id));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!active?.id || !over?.id) return;

    const leadId = active.id;
    const overId = over.id;

    // Must be dropped on a column
    if (!String(overId).startsWith("col:")) return;

    const nextStatus = String(overId).replace("col:", "");
    const lead = findLead(leadId);
    if (!lead) return;
    if (lead.status === nextStatus) return;

    // optimistic UI
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: nextStatus } : l))
    );

    try {
      await updateStatus(leadId, nextStatus);
    } catch (e) {
      console.error(e);
      // rollback
      setLeads((prev) =>
        prev.map((l) =>
          l._id === leadId ? { ...l, status: lead.status } : l
        )
      );
      alert("Drop failed to save. Try again.");
    }
  };

  if (loading) return <p className="text-slate-500">Loading pipeline...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pipeline</h1>
          <p className="mt-1 text-sm text-slate-500">
            Drag leads across stages. Changes save to MongoDB.
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-4">
          {STATUSES.map((s) => (
            <DroppableColumn
              key={s}
              status={s}
              title={s}
              count={grouped[s].length}
            >
              {grouped[s].map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  onView={() =>
                    alert(
                      `${lead.name}\n${lead.email}\n${lead.business || ""}\n\n${
                        lead.message || ""
                      }`
                    )
                  }
                />
              ))}
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
              <div className="text-sm font-semibold text-slate-900">
                {activeLead.name}
              </div>
              <div className="text-xs text-slate-600">{activeLead.email}</div>
              <div className="mt-1 text-xs text-slate-500">
                {activeLead.business || "No company"}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
