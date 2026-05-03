import { useState, useEffect } from "react";
import { C, fonts, inputSx, labelSx, btnPrimary, btnSecondary } from "../lib/design";
import { Plus, X, AlertTriangle, Users } from "lucide-react";

const STATUSES = ["New", "Contacted", "Proposal Sent", "Call Booked", "Closed", "Lost"];
const SOURCES  = ["Referral", "Social Media", "DM / Cold Outreach", "Website", "Event / Speaking", "Email List", "Other"];

const STATUS_STYLES = {
  "New":           { color: "#4a4a50",    bg: "rgba(74,74,80,0.08)",    border: "rgba(74,74,80,0.2)"    },
  "Contacted":     { color: "#b86b00",    bg: "rgba(184,107,0,0.10)",   border: "rgba(184,107,0,0.25)"  },
  "Proposal Sent": { color: "#6a60a0",    bg: "rgba(106,96,160,0.10)",  border: "rgba(106,96,160,0.22)" },
  "Call Booked":   { color: "#c9a84c",    bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.28)" },
  "Closed":        { color: "#1a3a2a",    bg: "rgba(26,58,42,0.10)",    border: "rgba(26,58,42,0.22)"   },
  "Lost":          { color: "#7a1f1f",    bg: "rgba(122,31,31,0.08)",   border: "rgba(122,31,31,0.18)"  },
};

const fmt = (n) => n ? `$${Number(n).toLocaleString()}` : "—";
const mono = { fontFamily: fonts.mono };
const daysSince = (date) => {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
};

/* ── Lead Form Modal ── */
function LeadModal({ lead, onSave, onClose }) {
  const [name,        setName]       = useState(lead?.name || "");
  const [source,      setSource]     = useState(lead?.source || SOURCES[0]);
  const [offer,       setOffer]      = useState(lead?.offer || "");
  const [dealValue,   setDeal]       = useState(lead?.dealValue || "");
  const [status,      setStatus]     = useState(lead?.status || "New");
  const [lastFollowUp, setFollowUp]  = useState(lead?.lastFollowUp || new Date().toISOString().split("T")[0]);
  const [notes,       setNotes]      = useState(lead?.notes || "");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: lead?.id || Date.now(),
      name: name.trim(), source, offer: offer.trim(),
      dealValue: parseFloat(dealValue) || 0, status,
      lastFollowUp, notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,15,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: "28px", width: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.ink }}>{lead ? "Edit Lead" : "Add Lead"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelSx}>Lead Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" style={inputSx} />
          </div>
          <div>
            <label style={labelSx}>How They Found You</label>
            <select value={source} onChange={e => setSource(e.target.value)} style={{ ...inputSx, appearance: "none" }}>
              {SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSx}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inputSx, appearance: "none" }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSx}>Offer They're Interested In</label>
            <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. 1:1 Coaching" style={inputSx} />
          </div>
          <div>
            <label style={labelSx}>Deal Value ($)</label>
            <input type="number" value={dealValue} onChange={e => setDeal(e.target.value)} placeholder="e.g. 1500" style={{ ...inputSx, ...mono }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelSx}>Last Follow-Up Date</label>
            <input type="date" value={lastFollowUp} onChange={e => setFollowUp(e.target.value)} style={inputSx} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelSx}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything relevant about this lead..." rows={3} style={{ ...inputSx, resize: "vertical", lineHeight: 1.6 }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          <button onClick={handleSave} style={{ ...btnPrimary, flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Plus size={14} /> {lead ? "Update Lead" : "Add Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Follow-up Alert Banner ── */
function FollowUpAlerts({ leads }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const stale = leads.filter(l => {
      if (l.status === "Closed" || l.status === "Lost") return false;
      return daysSince(l.lastFollowUp) >= 3;
    });
    if (stale.length === 0) { setAlerts([]); return; }

    const fetchAlerts = async () => {
      try {
        const res = await fetch("/api/copilot", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "lead_alerts", context: { leads: stale } }),
        });
        const data = await res.json();
        if (data.alerts) setAlerts(data.alerts);
      } catch {
        // fallback: generate alerts locally
        setAlerts(stale.slice(0, 3).map(l => ({
          name: l.name,
          message: `You haven't followed up with ${l.name} in ${daysSince(l.lastFollowUp)} days. Reach out today.`
        })));
      }
    };
    fetchAlerts();
  }, [leads.length]);

  if (alerts.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", borderRadius: 9, background: C.amberLight, border: `1px solid ${C.amberBorder}` }}>
          <AlertTriangle size={13} color={C.amber} style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 13, color: C.inkMid }}>
            <strong style={{ color: C.ink }}>{a.name}:</strong> {a.message}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Pipeline Summary ── */
function PipelineSummary({ leads }) {
  const active = leads.filter(l => l.status !== "Closed" && l.status !== "Lost");
  const closed = leads.filter(l => l.status === "Closed");
  const pipeline = active.reduce((s, l) => s + (l.dealValue || 0), 0);
  const won      = closed.reduce((s, l) => s + (l.dealValue || 0), 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
      {[
        { label: "Total Leads",    value: leads.length,                   color: C.ink  },
        { label: "Active Leads",   value: active.length,                  color: C.gold },
        { label: "Pipeline Value", value: `$${Number(pipeline).toLocaleString()}`, color: C.gold  },
        { label: "Won This Month", value: `$${Number(won).toLocaleString()}`,      color: C.green },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ background: "#fff", border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`, borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ margin: "0 0 4px", fontSize: 9, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>{label.toUpperCase()}</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color, fontFamily: fonts.mono }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   LEAD LOG ROOT
══════════════════════════════════════ */
export default function LeadLog({ leads = [], onChange }) {
  const [modal,       setModal]    = useState(null); // null | "add" | lead object
  const [filter,      setFilter]   = useState("All");
  const [editingLead, setEditing]  = useState(null);

  const openAdd  = () => { setEditing(null); setModal("add"); };
  const openEdit = (lead) => { setEditing(lead); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditing(null); };

  const saveLead = (lead) => {
    const updated = editingLead
      ? leads.map(l => l.id === lead.id ? lead : l)
      : [lead, ...leads];
    onChange(updated);
  };

  const deleteLead = (id) => onChange(leads.filter(l => l.id !== id));

  const filtered = filter === "All" ? leads : leads.filter(l => l.status === filter);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60 }}>
      {(modal === "add" || modal === "edit") && (
        <LeadModal lead={editingLead} onSave={saveLead} onClose={closeModal} />
      )}

      {/* Header */}
      <div style={{ padding: "24px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 10, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>LEAD LOG</p>
          <h1 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 28, fontWeight: 500, color: C.ink }}>Your Pipeline</h1>
        </div>
        <button onClick={openAdd} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 7 }}>
          <Plus size={14} /> Add Lead
        </button>
      </div>

      <div style={{ padding: "20px 32px" }}>
        <PipelineSummary leads={leads} />
        <FollowUpAlerts leads={leads} />

        {/* Status filter tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {["All", ...STATUSES].map(s => {
            const on = filter === s;
            const st = STATUS_STYLES[s];
            return (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: fonts.mono, fontWeight: on ? 600 : 400,
                border: on && st ? `1px solid ${st.border}` : `1px solid ${C.border}`,
                background: on && st ? st.bg : "transparent",
                color: on && st ? st.color : C.inkMid,
              }}>{s} {s !== "All" && `(${leads.filter(l => l.status === s).length})`}</button>
            );
          })}
        </div>

        {/* Leads table */}
        {filtered.length === 0 ? (
          <div style={{ padding: "60px 32px", textAlign: "center", background: "#fff", borderRadius: 12, border: `1px solid ${C.border}` }}>
            <Users size={28} color={C.inkLight} style={{ marginBottom: 12 }} />
            <p style={{ color: C.inkMid, fontSize: 14, margin: "0 0 4px", fontWeight: 500 }}>No leads yet.</p>
            <p style={{ color: C.inkLight, fontSize: 13, margin: "0 0 20px" }}>Add your first lead and the AI will help you follow up strategically.</p>
            <button onClick={openAdd} style={btnPrimary}>Add Your First Lead</button>
          </div>
        ) : (
          <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", background: "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafaf8" }}>
                  {["Lead", "Source", "Offer", "Deal Value", "Status", "Last Contact", "Days", ""].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 9, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => {
                  const days = daysSince(lead.lastFollowUp);
                  const ss   = STATUS_STYLES[lead.status] || STATUS_STYLES["New"];
                  const stale = days >= 3 && lead.status !== "Closed" && lead.status !== "Lost";
                  return (
                    <tr key={lead.id} onClick={() => openEdit(lead)} style={{ background: i % 2 === 0 ? "#fff" : "#fafaf8", cursor: "pointer" }}>
                      <td style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.ink }}>{lead.name}</p>
                        {lead.notes && <p style={{ margin: "2px 0 0", fontSize: 11, color: C.inkLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{lead.notes}</p>}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: C.inkLight, borderBottom: `1px solid ${C.border}` }}>{lead.source || "—"}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: C.inkMid, borderBottom: `1px solid ${C.border}` }}>{lead.offer || "—"}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, ...mono, color: C.gold, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{fmt(lead.dealValue)}</td>
                      <td style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ padding: "4px 10px", borderRadius: 5, fontSize: 11, fontFamily: fonts.mono, fontWeight: 600, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`, whiteSpace: "nowrap" }}>{lead.status}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: C.inkLight, ...mono, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{lead.lastFollowUp || "—"}</td>
                      <td style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
                        {days !== null && (
                          <span style={{ fontSize: 12, fontFamily: fonts.mono, fontWeight: 600, color: stale ? C.red : C.inkLight }}>{days}d ago</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 10px", borderBottom: `1px solid ${C.border}` }}>
                        <button onClick={e => { e.stopPropagation(); deleteLead(lead.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight, padding: 3 }}><X size={13} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
