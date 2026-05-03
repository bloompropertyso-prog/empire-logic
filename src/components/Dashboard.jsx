import { useState, useEffect } from "react";
import { C, fonts, cardGold } from "../lib/design";
import { Target, TrendingUp, RefreshCw, ArrowRight, AlertTriangle, DollarSign, Calendar, Users, Zap, Settings } from "lucide-react";

/* ── helpers ── */
const fmt = (n) => `$${Number(n || 0).toLocaleString()}`;
const mono = { fontFamily: fonts.mono };

function getDaysLeft() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return last - now.getDate();
}
function getDaysElapsed() { return new Date().getDate(); }
function getDaysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}
function getMonthIncome(income) {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return (income || []).filter(i => (i.date || "").startsWith(key)).reduce((s, i) => s + (Number(i.amount) || 0), 0);
}
function getPaceStatus(current, goal, daysElapsed, daysInMonth) {
  const expected = (goal * daysElapsed) / daysInMonth;
  const ratio = expected > 0 ? current / expected : 1;
  if (ratio >= 0.9) return "on-track";
  if (ratio >= 0.65) return "behind";
  return "at-risk";
}

const PACE_STYLES = {
  "on-track": { color: C.green,  bg: C.greenLight,  border: C.greenBorder,  label: "On Track"  },
  "behind":   { color: C.amber,  bg: C.amberLight,  border: C.amberBorder,  label: "Behind"    },
  "at-risk":  { color: C.red,    bg: C.redLight,    border: C.redBorder,    label: "At Risk"   },
};

/* ══════════════════════════════════════
   REVENUE PLANNER
══════════════════════════════════════ */
function RevenuePlanner({ profile, income, onOpenSettings }) {
  const goal          = profile?.revenueGoal || 10000;
  const offerPrice    = profile?.offerPrice  || 1500;
  const activeClients = profile?.activeClients || 0;
  const currentIncome = getMonthIncome(income);

  const clientsNeeded  = Math.ceil(goal / offerPrice);
  const clientsGap     = Math.max(0, clientsNeeded - activeClients);
  const pct            = Math.min(100, Math.round((currentIncome / goal) * 100));
  const daysLeft       = getDaysLeft();
  const daysElapsed    = getDaysElapsed();
  const daysInMonth    = getDaysInMonth();
  const pace           = getPaceStatus(currentIncome, goal, daysElapsed, daysInMonth);
  const ps             = PACE_STYLES[pace];
  const remaining      = Math.max(0, goal - currentIncome);
  const todayTarget    = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;

  return (
    <div style={{ ...cardGold, marginBottom: 0 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 10, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>MONTHLY REVENUE PLANNER</p>
          <h1 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 32, fontWeight: 500, color: C.ink, lineHeight: 1.1 }}>
            {fmt(goal)}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.inkLight }}>revenue goal this month</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "6px 14px", borderRadius: 6, background: ps.bg, border: `1px solid ${ps.border}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: ps.color, fontFamily: fonts.mono }}>{ps.label}</span>
          </div>
          <button onClick={onOpenSettings} title="Edit goals" style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings size={13} color={C.inkLight} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: C.inkMid }}>Income logged: <strong style={{ ...mono, color: C.ink }}>{fmt(currentIncome)}</strong></span>
          <span style={{ fontSize: 12, ...mono, color: C.inkLight }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: C.border, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 90 ? C.green : pct >= 60 ? C.gold : C.red, borderRadius: 6, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: C.inkLight, ...mono }}>{fmt(currentIncome)} logged</span>
          <span style={{ fontSize: 11, color: C.inkLight, ...mono }}>{fmt(goal)} goal</span>
        </div>
      </div>

      {/* 4 metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Clients Needed",   value: clientsNeeded,                icon: Users,    color: C.ink  },
          { label: "Clients You Have", value: activeClients,                 icon: Users,    color: C.green },
          { label: "Gap to Close",     value: `${clientsGap} more`,         icon: Target,   color: clientsGap > 0 ? C.red : C.green },
          { label: "Days Left",        value: daysLeft,                     icon: Calendar, color: daysLeft < 7 ? C.red : C.ink },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ padding: "14px 16px", borderRadius: 10, background: "#fafaf8", border: `1px solid ${C.border}` }}>
            <Icon size={13} color={color} style={{ marginBottom: 8 }} strokeWidth={1.5} />
            <p style={{ margin: "0 0 3px", fontSize: 18, fontWeight: 600, ...mono, color }}>{value}</p>
            <p style={{ margin: 0, fontSize: 10, color: C.inkLight, fontFamily: fonts.mono, letterSpacing: "0.04em" }}>{label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Alert if gap > 0 */}
      {clientsGap > 0 && (
        <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: pace === "at-risk" ? C.redLight : C.amberLight, border: `1px solid ${pace === "at-risk" ? C.redBorder : C.amberBorder}`, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={13} color={pace === "at-risk" ? C.red : C.amber} style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 13, color: C.inkMid }}>
            You need <strong style={{ ...mono, color: C.ink }}>{clientsGap} more {clientsGap === 1 ? "client" : "clients"}</strong> to hit your goal.{" "}
            At {fmt(offerPrice)}/client — that's <strong style={{ ...mono, color: C.ink }}>{fmt(clientsGap * offerPrice)}</strong> in sales to close this month.
            Today's target: <strong style={{ ...mono, color: C.ink }}>{fmt(todayTarget)}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   DAILY ACTION PLAN
══════════════════════════════════════ */
function DailyActionPlan({ profile, income, leads }) {
  const [actions, setActions]       = useState([]);
  const [topAction, setTopAction]   = useState("");
  const [todayTarget, setTodayTarget] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [fetched, setFetched]       = useState(false);

  const goal         = profile?.revenueGoal || 10000;
  const currentIncome = getMonthIncome(income);
  const daysLeft     = getDaysLeft();
  const remaining    = Math.max(0, goal - currentIncome);
  const calcTarget   = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;

  const fetchActions = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "daily_actions",
          context: {
            name: profile.name,
            coachType: profile.coachType,
            revenueGoal: goal,
            currentIncome,
            daysLeft,
            todayTarget: calcTarget,
            offerPrice: profile.offerPrice,
            leads: leads || [],
          },
        }),
      });
      const data = await res.json();
      if (data.actions) setActions(data.actions);
      if (data.topAction) setTopAction(data.topAction);
      if (data.todayTarget) setTodayTarget(data.todayTarget);
      else setTodayTarget(calcTarget);
    } catch {
      setTodayTarget(calcTarget);
    }
    setLoading(false);
    setFetched(true);
  };

  useEffect(() => {
    if (profile && !fetched) fetchActions();
  }, [profile]);

  const rankColors = ["#c9a84c", C.inkMid, C.inkLight];
  const rankLabels = ["#1 PRIORITY", "#2 PRIORITY", "#3 PRIORITY"];

  return (
    <div style={{ background: C.sidebar, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(201,168,76,0.15)" }}>
      {/* Header */}
      <div style={{ padding: "18px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 10, fontFamily: fonts.mono, color: "rgba(201,168,76,0.6)", letterSpacing: "0.12em" }}>DAILY ACTION PLAN</p>
          <h2 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 20, fontWeight: 500, color: "#fff" }}>
            Today's Revenue Target: <span style={{ color: C.gold }}>{fmt(todayTarget || calcTarget)}</span>
          </h2>
        </div>
        <button onClick={fetchActions} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7, border: "1px solid rgba(201,168,76,0.2)", background: "transparent", color: loading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)", fontSize: 11, cursor: loading ? "default" : "pointer", fontFamily: fonts.mono }}>
          <RefreshCw size={11} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Thinking..." : "Refresh"}
        </button>
      </div>

      {/* Actions */}
      {!profile ? (
        <div style={{ padding: "32px 24px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>Complete setup to unlock your Daily Action Plan.</p>
        </div>
      ) : loading && actions.length === 0 ? (
        <div style={{ padding: "28px 24px" }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 64, background: "rgba(255,255,255,0.04)", borderRadius: 10, marginBottom: 10, animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      ) : actions.length > 0 ? (
        <>
          <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {actions.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", borderRadius: 10, background: i === 0 ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(201,168,76,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ flexShrink: 0, marginTop: 1 }}>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: fonts.mono, color: rankColors[i], letterSpacing: "0.1em", marginBottom: 2 }}>{rankLabels[i]}</p>
                  <p style={{ margin: 0, fontSize: 12, fontFamily: fonts.mono, color: C.gold, fontWeight: 600 }}>{fmt(a.impact)}</p>
                </div>
                <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: i === 0 ? "#fff" : "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a.action}</p>
              </div>
            ))}
          </div>

          {topAction && (
            <div style={{ margin: "0 24px 20px", padding: "14px 18px", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
              <ArrowRight size={14} color={C.gold} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 9, fontFamily: fonts.mono, color: "rgba(201,168,76,0.6)", letterSpacing: "0.12em" }}>IF YOU DO ONE THING TODAY</p>
                <p style={{ margin: 0, fontSize: 14, color: C.gold, fontWeight: 600 }}>{topAction}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: "24px 24px" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: "0 0 12px" }}>No actions generated yet.</p>
          <button onClick={fetchActions} style={{ padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.goldBorder}`, background: C.goldLight, color: C.gold, fontSize: 13, cursor: "pointer", fontFamily: fonts.body, fontWeight: 600 }}>Generate Today's Plan</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   PAGE HEADER
══════════════════════════════════════ */
function PageHeader({ profile, onOpenSettings }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ padding: "24px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ margin: "0 0 2px", fontSize: 11, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.08em" }}>{today.toUpperCase()}</p>
        <h1 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 28, fontWeight: 500, color: C.ink }}>
          {greet}{profile?.name ? `, ${profile.name}` : ""}.
        </h1>
      </div>
      <button onClick={onOpenSettings} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.inkMid, fontSize: 12, cursor: "pointer", fontFamily: fonts.mono, letterSpacing: "0.04em" }}>
        <Settings size={12} /> EDIT PROFILE
      </button>
    </div>
  );
}

/* ══════════════════════════════════════
   DASHBOARD ROOT
══════════════════════════════════════ */
export default function Dashboard({ profile, leads, onOpenSettings }) {
  const [income, setIncome] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("el_income");
    if (saved) setIncome(JSON.parse(saved));
    // listen for updates from budget tracker
    const handler = () => {
      const fresh = localStorage.getItem("el_income");
      if (fresh) setIncome(JSON.parse(fresh));
    };
    window.addEventListener("el_income_updated", handler);
    return () => window.removeEventListener("el_income_updated", handler);
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60 }}>
      <PageHeader profile={profile} onOpenSettings={onOpenSettings} />

      <div style={{ padding: "20px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        <RevenuePlanner profile={profile} income={income} onOpenSettings={onOpenSettings} />
        <DailyActionPlan profile={profile} income={income} leads={leads} />
      </div>
    </div>
  );
}
