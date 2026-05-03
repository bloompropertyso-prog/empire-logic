import { useState } from "react";
import { C, fonts, inputSx, labelSx, btnPrimary } from "../lib/design";
import { Target, TrendingUp, Users, CheckCircle2, Circle } from "lucide-react";

const mono = { fontFamily: fonts.mono };
const fmt  = (n) => `$${Number(n || 0).toLocaleString()}`;

function GoalBar({ label, current, target, color = C.gold, format = "number" }) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const display = format === "currency" ? fmt(current) : current;
  const targetDisplay = format === "currency" ? fmt(target) : target;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 12, ...mono, color: C.inkLight }}>{display} / {targetDisplay}</span>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 5, overflow: "hidden", marginBottom: 4 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 5, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: pct >= 100 ? C.green : C.inkLight, ...mono }}>{pct >= 100 ? "✓ Complete" : `${pct}% complete`}</span>
        {pct < 100 && <span style={{ fontSize: 11, color: C.inkLight, ...mono }}>{target - current} remaining</span>}
      </div>
    </div>
  );
}

export default function Goals({ profile, leads = [] }) {
  const goal        = profile?.revenueGoal || 10000;
  const offerPrice  = profile?.offerPrice  || 1500;
  const clientsHave = profile?.activeClients || 0;
  const clientsNeed = Math.ceil(goal / offerPrice);

  // Pipeline stats
  const activeLeads = leads.filter(l => l.status !== "Closed" && l.status !== "Lost");
  const closedLeads = leads.filter(l => l.status === "Closed");
  const pipeline    = activeLeads.reduce((s, l) => s + (l.dealValue || 0), 0);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft    = daysInMonth - today.getDate();
  const daysElapsed = today.getDate();

  const milestones = [
    { label: `Hit ${fmt(goal)} revenue this month`,  done: false },
    { label: `Close ${clientsNeed} clients`,          done: closedLeads.length >= clientsNeed },
    { label: "Log income every week",                 done: false },
    { label: "Follow up with every active lead",      done: activeLeads.every(l => { const d = l.lastFollowUp ? Math.floor((Date.now() - new Date(l.lastFollowUp)) / 86400000) : 999; return d < 3; }) },
    { label: "Achieve 50%+ profit margin",            done: false },
    { label: `Build pipeline above ${fmt(goal * 2)}`, done: pipeline >= goal * 2 },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60 }}>
      <div style={{ padding: "24px 32px 0" }}>
        <p style={{ margin: "0 0 2px", fontSize: 10, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>GOALS</p>
        <h1 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 28, fontWeight: 500, color: C.ink }}>Your Growth Targets</h1>
      </div>

      <div style={{ padding: "20px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Revenue Progress */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.gold}`, borderRadius: 12, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <TrendingUp size={15} color={C.gold} strokeWidth={1.5} />
            <h3 style={{ margin: 0, fontSize: 12, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.08em" }}>REVENUE GOALS</h3>
          </div>
          <GoalBar label="Monthly Revenue" current={0} target={goal} color={C.gold} format="currency" />
          <GoalBar label="Clients Closed"  current={closedLeads.length} target={clientsNeed} color={C.green} />
          <GoalBar label="Pipeline Built"  current={pipeline} target={goal * 2} color="#6a60a0" format="currency" />
        </div>

        {/* Lead funnel */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: 12, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Users size={15} color={C.green} strokeWidth={1.5} />
            <h3 style={{ margin: 0, fontSize: 12, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.08em" }}>LEAD FUNNEL</h3>
          </div>
          {["New", "Contacted", "Proposal Sent", "Call Booked", "Closed"].map(status => {
            const count = leads.filter(l => l.status === status).length;
            const total = leads.length || 1;
            const pct   = Math.round((count / total) * 100);
            const colors = { "New": "#8a8a90", "Contacted": C.amber, "Proposal Sent": "#6a60a0", "Call Booked": C.gold, "Closed": C.green };
            return (
              <div key={status} style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: C.inkMid, minWidth: 110, fontFamily: fonts.body }}>{status}</span>
                <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: colors[status] || C.gold, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, ...mono, color: C.ink, minWidth: 28, textAlign: "right", fontWeight: 600 }}>{count}</span>
              </div>
            );
          })}
        </div>

        {/* Milestones */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px", gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Target size={15} color={C.gold} strokeWidth={1.5} />
            <h3 style={{ margin: 0, fontSize: 12, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.08em" }}>THIS MONTH'S MILESTONES</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {milestones.map(({ label, done }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 9, background: done ? C.greenLight : "#fafaf8", border: `1px solid ${done ? C.greenBorder : C.border}` }}>
                {done
                  ? <CheckCircle2 size={16} color={C.green} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  : <Circle       size={16} color={C.inkLight} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                <span style={{ fontSize: 13, color: done ? C.green : C.inkMid, fontWeight: done ? 500 : 400 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Month pacing */}
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px", gridColumn: "1 / -1" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 12, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.08em" }}>MONTH AT A GLANCE</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Days Elapsed",   value: daysElapsed,                                                                  color: C.ink    },
              { label: "Days Remaining", value: daysLeft,                                                                     color: daysLeft < 7 ? C.red : C.ink },
              { label: "Active Leads",   value: activeLeads.length,                                                           color: C.gold   },
              { label: "Clients Needed", value: Math.max(0, clientsNeed - closedLeads.length),                               color: C.green  },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: "14px 16px", background: "#fafaf8", borderRadius: 10, border: `1px solid ${C.border}` }}>
                <p style={{ margin: "0 0 6px", fontSize: 9, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>{label.toUpperCase()}</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 700, ...mono, color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
