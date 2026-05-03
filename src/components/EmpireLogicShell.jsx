import { useState } from "react";
import SocialStudio from "./SocialStudio";
import FounderPerks from "./FounderPerks";
import TheVault     from "./TheVault";
import {
  LayoutDashboard,
  Archive,
  Share2,
  Gift,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Shield,
  ChevronRight,
  Zap,
  BarChart2,
  CheckCircle2,
  Circle,
  Star,
  Bell,
  MessageSquare,
  Video,
  PhoneCall,
  FileText,
  Upload,
  Mail,
  Wallet,
  CalendarCheck,
  Megaphone,
  Lightbulb,
  Flame,
} from "lucide-react";

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const C = {
  obsidian:      "#0A0A0A",
  obsidianMid:   "#141414",
  obsidianSurf:  "#1C1C1C",
  gold:          "#C9A84C",
  goldLight:     "rgba(201,168,76,0.12)",
  goldBorder:    "rgba(201,168,76,0.28)",
  goldGlow:      "0 0 0 3px rgba(201,168,76,0.20), 0 0 12px rgba(201,168,76,0.30)",
  cream:         "#F9F8F3",
  creamDeep:     "#EAE6DC",
  ink:           "#1A1A1A",
  inkMid:        "#4A4A4A",
  inkLight:      "#8A8A8A",
  white:         "#FFFFFF",
  success:       "#4A7C59",
  successLight:  "rgba(74,124,89,0.12)",
  lavender:      "rgba(100,90,180,0.08)",
  lavenderBorder:"rgba(100,90,180,0.18)",
  lavenderText:  "#6A60A0",
  rose:          "rgba(160,90,90,0.10)",
  roseText:      "#A05A5A",
};

/* ─── Navigation ─────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Command Center", icon: LayoutDashboard, id: "command" },
  { label: "The Vault",      icon: Archive,          id: "vault"   },
  { label: "Social Studio",  icon: Share2,           id: "social"  },
  { label: "Founder Perks",  icon: Gift,             id: "perks"   },
];

/* ─── Static Data ────────────────────────────────────────────────────── */
const STATS = [
  { label: "Monthly Revenue", value: "$12,480", delta: "+8.3%",  icon: DollarSign, up: true  },
  { label: "Active Clients",  value: "24",      delta: "+2",     icon: Users,      up: true  },
  { label: "Pipeline Value",  value: "$38,200", delta: "+14.1%", icon: TrendingUp, up: true  },
  { label: "Avg Deal Size",   value: "$1,592",  delta: "-3.2%",  icon: BarChart2,  up: false },
];

const GOALS = [
  { label: "Revenue Goal",     current: 12480, target: 20000, color: C.gold    },
  { label: "New Client Quota", current: 24,    target: 30,    color: "#7C9A8A" },
  { label: "Content Output",   current: 7,     target: 10,    color: "#8A7CB0" },
  { label: "Referrals Earned", current: 3,     target: 5,     color: "#A07C5A" },
];

/* ─── Energy Mode Configuration ──────────────────────────────────────── */

/*
  MAINTENANCE MODE  (levels 1–2)
  Quick Wins — small, protective tasks that keep the business alive
  with minimal cognitive load.
*/
const MAINTENANCE_TASKS = [
  { id: "m1", text: "Upload 1 document to the Vault",         icon: Upload,       priority: "low",    done: false },
  { id: "m2", text: "Archive 5 emails from your inbox",       icon: Mail,         priority: "low",    done: false },
  { id: "m3", text: "Check bank balance & flag anything odd", icon: Wallet,       priority: "low",    done: false },
  { id: "m4", text: "Reply to 1 pending client message",      icon: MessageSquare,priority: "low",    done: false },
  { id: "m5", text: "Set tomorrow's top 3 priorities",        icon: CalendarCheck,priority: "low",    done: false },
];

/*
  STEADY MODE  (level 3)
  Standard Ops — consistent, revenue-supporting activities.
*/
const STEADY_TASKS = [
  { id: "s1", text: "Follow up with 2 warm leads",            icon: MessageSquare, priority: "medium", done: false },
  { id: "s2", text: "Review your weekly schedule",            icon: CalendarCheck, priority: "medium", done: false },
  { id: "s3", text: "Send weekly client check-in emails",     icon: Mail,          priority: "medium", done: false },
  { id: "s4", text: "Update project tracker & task board",    icon: FileText,      priority: "low",    done: false },
  { id: "s5", text: "Post 1 piece of educational content",    icon: Megaphone,     priority: "medium", done: false },
];

/*
  EMPIRE MODE  (levels 4–5)
  Growth Focus — high-leverage, revenue-generating, legacy-building moves.
*/
const EMPIRE_TASKS = [
  { id: "e1", text: "Record 3 Reels for Social Studio",              icon: Video,     priority: "high",   done: false },
  { id: "e2", text: "Host or fully prep your Sales Call",            icon: PhoneCall, priority: "high",   done: false },
  { id: "e3", text: "Draft new offer strategy or price increase",    icon: Lightbulb, priority: "high",   done: false },
  { id: "e4", text: "Pitch to 1 dream client or partnership",        icon: Star,      priority: "high",   done: false },
  { id: "e5", text: "Optimize your highest revenue stream",          icon: TrendingUp,priority: "medium", done: false },
];

/* Energy metadata per level */
const ENERGY_META = {
  1: { mode: "maintenance", label: "Rest Mode",    sub: "Light admin only",         color: "#7C9A8A" },
  2: { mode: "maintenance", label: "Slow Burn",    sub: "Emails & easy wins",       color: "#9A9A7C" },
  3: { mode: "steady",      label: "In the Zone",  sub: "Balanced work day",        color: C.gold    },
  4: { mode: "empire",      label: "Power Mode",   sub: "Deep work & big moves",    color: "#C97A4C" },
  5: { mode: "empire",      label: "CEO Energy",   sub: "Full execution — go hard", color: "#C94C4C" },
};

/* Daily Briefing content per mode */
const BRIEFINGS = {
  maintenance: {
    eyebrow:  "MAINTENANCE BRIEFING",
    headline: "Rest is a revenue strategy.",
    body:     "Your empire doesn't need you at 100% every day. Sustainable execution beats sporadic sprints. Today: protect your energy, handle the quick wins, and trust the systems you've built.",
    insight:  "Founders who schedule rest days report 34% higher creative output the following week. Protect today.",
    badge:    "Quick Wins",
    badgeColor: C.success,
    badgeBg:    C.successLight,
    borderColor: "rgba(74,124,89,0.25)",
    bgColor:     "rgba(74,124,89,0.04)",
  },
  steady: {
    eyebrow:  "STEADY OPS BRIEFING",
    headline: "Consistency is the quiet engine of empire.",
    body:     "Today is a solid operational day. Keep client relationships warm, move your pipeline forward, and hold your schedule tight. One follow-up email could be worth thousands.",
    insight:  "Following up with 2 leads today could close $3,200 in pipeline by end of week. Do it before noon.",
    badge:    "Standard Ops",
    badgeColor: "#9A7A2A",
    badgeBg:    C.goldLight,
    borderColor: C.goldBorder,
    bgColor:     "rgba(201,168,76,0.04)",
  },
  empire: {
    eyebrow:  "EMPIRE MODE BRIEFING",
    headline: "Today is for big moves only.",
    body:     "You're operating at peak capacity — deploy it toward growth. Revenue-generating tasks only. Delegate the rest, silence the noise, and create something that moves the needle permanently.",
    insight:  "Recording 3 Reels today could generate 10k+ impressions and 2 inbound leads this week. Show up fully.",
    badge:    "Growth Focus",
    badgeColor: "#8A3A2A",
    badgeBg:    "rgba(160,90,70,0.12)",
    borderColor: "rgba(160,90,70,0.28)",
    bgColor:     "rgba(160,90,70,0.04)",
  },
};

/* Greeting text per mode (extra supportive for 1–2) */
const GREETINGS = {
  maintenance: {
    headline: (name) => `Take it easy today, ${name}.`,
    sub: (pending) => `${pending} light tasks are ready — no pressure, no rush.`,
  },
  steady: {
    headline: (name, timeGreet) => `${timeGreet}, ${name}.`,
    sub: (pending) => `${pending} tasks awaiting your attention · Steady & on track.`,
  },
  empire: {
    headline: (name) => `The empire is calling, ${name}.`,
    sub: (pending) => `${pending} power moves on deck — let's make it count.`,
  },
};

/* ─── Helpers ────────────────────────────────────────────────────────── */
const getMode    = (level) => ENERGY_META[level].mode;
const timeGreet  = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const PRIORITY_STYLE = {
  high:   { bg: C.rose,        color: C.roseText,   label: "High"   },
  medium: { bg: C.goldLight,   color: "#9A7A2A",    label: "Mid"    },
  low:    { bg: C.successLight,color: C.success,    label: "Low"    },
};

/* ─── Sub-components ─────────────────────────────────────────────────── */

/*
  Sidebar now receives energyLevel + setEnergyLevel so the toggle
  lives here — always visible and functional on every page.
*/
function Sidebar({ activeNav, setActiveNav, tasksDone, tasksTotal, energyLevel, setEnergyLevel }) {
  const pct  = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const meta = ENERGY_META[energyLevel];

  return (
    <aside style={{
      width: 240, minHeight: "100vh", background: C.obsidian,
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      borderRight: `1px solid ${C.goldBorder}`,
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${C.goldBorder}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: C.goldLight, border: `1px solid ${C.goldBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Star size={16} color={C.gold} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ color: C.white, fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: "0.04em" }}>EMPIRE</p>
            <p style={{ color: C.gold,  fontSize: 10, margin: 0, letterSpacing: "0.12em" }}>LOGIC</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: "16px 12px 8px", flexShrink: 0 }}>
        <p style={{ color: C.inkLight, fontSize: 10, letterSpacing: "0.1em", padding: "0 10px 8px", margin: 0 }}>
          NAVIGATION
        </p>
        {NAV_ITEMS.map(({ label, icon: Icon, id }) => {
          const active = activeNav === id;
          return (
            <button key={id} onClick={() => setActiveNav(id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: active ? C.goldLight : "transparent",
              borderLeft: active ? `2px solid ${C.gold}` : "2px solid transparent",
              marginBottom: 2, transition: "all 0.15s ease",
            }}>
              <Icon size={16} color={active ? C.gold : C.inkLight} strokeWidth={1.5} />
              <span style={{ color: active ? C.gold : "#9A9A9A", fontSize: 13, fontWeight: active ? 500 : 400, letterSpacing: "0.01em" }}>
                {label}
              </span>
              {active && <ChevronRight size={12} color={C.gold} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </nav>

      {/* ── Energy Toggle — persistent across ALL pages ── */}
      <div style={{
        margin: "8px 12px 0", padding: "14px 14px 12px", borderRadius: 10,
        background: C.obsidianSurf,
        border: `1px solid ${C.goldBorder}`,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Zap size={11} color={C.gold} />
          <p style={{ margin: 0, fontSize: 9, color: C.gold, letterSpacing: "0.1em", fontWeight: 600 }}>
            ENERGY LEVEL
          </p>
        </div>
        {/* 1–5 buttons */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n === energyLevel;
            return (
              <button key={n} onClick={() => setEnergyLevel(n)} style={{
                flex: 1, height: 30, borderRadius: 7,
                border: active ? `1.5px solid ${C.gold}` : "1px solid rgba(255,255,255,0.08)",
                background: active ? C.goldLight : "transparent",
                color: active ? C.gold : "#555",
                fontSize: 12, fontWeight: active ? 700 : 400,
                cursor: "pointer", transition: "all 0.2s ease",
                boxShadow: active ? "0 0 0 2px rgba(201,168,76,0.18), 0 0 10px rgba(201,168,76,0.22)" : "none",
              }}>
                {n}
              </button>
            );
          })}
        </div>
        {/* Current level label */}
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.3 }}>
          <strong style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</strong>
          <span style={{ color: "#555", fontSize: 10 }}> — {meta.sub}</span>
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Weekly Pulse */}
      <div style={{
        margin: "12px 12px 16px", padding: "14px", borderRadius: 10,
        background: C.obsidianSurf, border: `1px solid ${C.goldBorder}`,
        flexShrink: 0,
      }}>
        <p style={{ color: C.gold, fontSize: 9, letterSpacing: "0.1em", margin: "0 0 10px", fontWeight: 600 }}>WEEKLY PULSE</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ color: C.white, fontSize: 20, fontWeight: 600 }}>{tasksDone}</span>
          <span style={{ color: C.inkLight, fontSize: 11 }}>of {tasksTotal} tasks</span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 6 }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 4,
            background: `linear-gradient(90deg, ${C.gold}, #E8C96A)`,
            transition: "width 0.4s ease",
          }} />
        </div>
        <p style={{ color: C.inkLight, fontSize: 10, margin: 0 }}>{pct}% of weekly goal complete</p>
      </div>
    </aside>
  );
}

/* ── Energy Toggle with Champagne Glow ── */
function EnergyToggle({ level, setLevel }) {
  const meta = ENERGY_META[level];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Zap size={13} color={C.gold} />
        <span style={{ fontSize: 11, color: C.inkMid, letterSpacing: "0.06em" }}>ENERGY LEVEL</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n === level;
          return (
            <button
              key={n}
              onClick={() => setLevel(n)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: active ? `1.5px solid ${C.gold}` : `1px solid ${C.creamDeep}`,
                background: active ? C.goldLight : "transparent",
                color: active ? C.gold : C.inkLight,
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
                /* ✦ Champagne glow on active */
                boxShadow: active ? C.goldGlow : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      <span style={{ fontSize: 11, color: C.inkMid }}>
        <strong style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</strong>
        {" "}— {meta.sub}
      </span>
    </div>
  );
}

/* ── Vault Badge ── */
function VaultBadge() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "7px 14px",
      borderRadius: 20, background: C.successLight, border: `1px solid rgba(74,124,89,0.3)`,
    }}>
      <Shield size={13} color={C.success} />
      <span style={{ fontSize: 12, color: C.success, fontWeight: 500 }}>Vault: Funding Ready</span>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, animation: "blink 2s infinite" }} />
    </div>
  );
}

/* ── Daily Briefing (full-width strip, mode-aware) ── */
function DailyBriefing({ mode }) {
  const b = BRIEFINGS[mode];
  return (
    <div style={{
      margin: "20px 32px 0",
      padding: "20px 24px",
      borderRadius: 14,
      background: b.bgColor,
      border: `1px solid ${b.borderColor}`,
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "16px 32px",
      alignItems: "start",
    }}>
      {/* Left: text */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            color: b.badgeColor, background: b.badgeBg,
            padding: "3px 10px", borderRadius: 10,
          }}>
            {b.badge}
          </span>
          <span style={{ fontSize: 10, color: C.inkLight, letterSpacing: "0.08em" }}>{b.eyebrow}</span>
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 18, fontWeight: 500, color: C.ink, margin: "0 0 8px", lineHeight: 1.25,
        }}>
          {b.headline}
        </h2>
        <p style={{ fontSize: 13, color: C.inkMid, margin: 0, lineHeight: 1.65, maxWidth: 520 }}>
          {b.body}
        </p>
      </div>
      {/* Right: AI Insight pill */}
      <div style={{
        padding: "14px 16px", borderRadius: 10,
        background: C.lavender, border: `1px solid ${C.lavenderBorder}`,
        maxWidth: 260, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
          <Flame size={12} color={C.lavenderText} />
          <span style={{ fontSize: 10, color: C.lavenderText, fontWeight: 600, letterSpacing: "0.08em" }}>AI INSIGHT</span>
        </div>
        <p style={{ fontSize: 12, color: C.lavenderText, margin: 0, lineHeight: 1.55 }}>{b.insight}</p>
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.creamDeep}`, borderRadius: 12,
      padding: "16px", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: C.goldLight,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={15} color={C.gold} strokeWidth={1.5} />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500,
          color: stat.up ? C.success : C.roseText,
          background: stat.up ? C.successLight : C.rose,
          padding: "2px 8px", borderRadius: 10,
        }}>
          {stat.delta}
        </span>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 600, color: C.ink, lineHeight: 1.1 }}>{stat.value}</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: C.inkLight }}>{stat.label}</p>
      </div>
    </div>
  );
}

/* ── Task Item ── */
function TaskItem({ task, onToggle }) {
  const ps   = PRIORITY_STYLE[task.priority];
  const Icon = task.icon;
  return (
    <div
      onClick={() => onToggle(task.id)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "10px 12px", borderRadius: 8, cursor: "pointer",
        border: `1px solid ${C.creamDeep}`, marginBottom: 6,
        transition: "all 0.15s ease", opacity: task.done ? 0.5 : 1,
        background: task.done ? "transparent" : C.white,
      }}
    >
      {task.done
        ? <CheckCircle2 size={16} color={C.success}   strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }} />
        : <Circle       size={16} color={C.inkLight}  strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }} />
      }
      <span style={{
        flex: 1, fontSize: 13, lineHeight: 1.4,
        color: task.done ? C.inkLight : C.ink,
        textDecoration: task.done ? "line-through" : "none",
      }}>
        {task.text}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 500,
        color: ps.color, background: ps.bg,
        padding: "2px 7px", borderRadius: 8, flexShrink: 0, letterSpacing: "0.03em",
      }}>
        {ps.label}
      </span>
    </div>
  );
}

/* ── Goal Progress Bar ── */
function GoalBar({ goal }) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `${n}`;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{goal.label}</span>
        <span style={{ fontSize: 12, color: C.inkLight }}>{fmt(goal.current)} / {fmt(goal.target)}</span>
      </div>
      <div style={{ height: 8, borderRadius: 6, background: C.creamDeep, overflow: "hidden", marginBottom: 4 }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: goal.color, transition: "width 0.6s ease" }} />
      </div>
      <p style={{ margin: 0, fontSize: 11, color: C.inkLight, textAlign: "right" }}>{pct}% complete</p>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon: Icon, label, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon size={14} color={C.gold} strokeWidth={1.5} />
      <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </h2>
      {badge && (
        <span style={{
          marginLeft: "auto", fontSize: 10, color: C.gold,
          background: C.goldLight, padding: "2px 9px", borderRadius: 10, border: `1px solid ${C.goldBorder}`,
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

/* ─── Root Component ─────────────────────────────────────────────────── */
export default function EmpireLogicShell() {
  const [activeNav,   setActiveNav]   = useState("command");
  const [energyLevel, setEnergyLevel] = useState(3);

  /*
    Each mode maintains its own independent task state so that checking off
    a Maintenance task doesn't affect your Empire task list when you switch.
  */
  const [taskStates, setTaskStates] = useState({
    maintenance: MAINTENANCE_TASKS.map((t) => ({ ...t })),
    steady:      STEADY_TASKS.map((t)      => ({ ...t })),
    empire:      EMPIRE_TASKS.map((t)      => ({ ...t })),
  });

  /* Derived values */
  const mode         = getMode(energyLevel);
  const meta         = ENERGY_META[energyLevel];
  const currentTasks = taskStates[mode];
  const pendingCount = currentTasks.filter((t) => !t.done).length;
  const doneCount    = currentTasks.filter((t) => t.done).length;
  const greetCfg     = GREETINGS[mode];

  /* Toggle a task within its mode bucket */
  const toggleTask = (id) => {
    setTaskStates((prev) => ({
      ...prev,
      [mode]: prev[mode].map((t) => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  /* Greeting headline: maintenance gets the warm variant, others use time-of-day */
  const greetingLine =
    mode === "maintenance"
      ? greetCfg.headline("Bryttani")
      : greetCfg.headline("Bryttani", timeGreet());

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>

      {/* ── Sidebar — always visible, energy toggle lives here ── */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        tasksDone={doneCount}
        tasksTotal={currentTasks.length}
        energyLevel={energyLevel}
        setEnergyLevel={setEnergyLevel}
      />

      {/* ── Main Content ── */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* ── Social Studio route ── */}
        {activeNav === "social" && (
          <SocialStudio energyLevel={energyLevel} />
        )}

        {/* ── Founder Perks route ── */}
        {activeNav === "perks" && (
          <FounderPerks />
        )}

        {/* ── The Vault route ── */}
        {activeNav === "vault" && (
          <TheVault />
        )}

        {/* ── Command Center route ── */}
        {activeNav === "command" && <>

        {/* ── Header ── */}
        <header style={{
          background: C.cream, borderBottom: `1px solid ${C.creamDeep}`,
          padding: "20px 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40,
        }}>
          {/* Greeting — changes with energy mode */}
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26, fontWeight: 500, margin: 0, lineHeight: 1.2,
              color: mode === "empire" ? "#1A1A1A" : C.ink,
            }}>
              {greetingLine}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: C.inkLight }}>
              {greetCfg.sub(pendingCount)}
            </p>
          </div>

          {/* Right cluster — energy toggle now lives in sidebar */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <VaultBadge />
            {/* Current energy pill — read-only display, toggle is in sidebar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 20,
              background: C.goldLight, border: `1px solid ${C.goldBorder}`,
            }}>
              <Zap size={11} color={C.gold} />
              <span style={{ fontSize: 11, color: "#9A7A2A", fontWeight: 600 }}>
                {ENERGY_META[energyLevel].label}
              </span>
            </div>
            <button style={{
              width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.creamDeep}`,
              background: "transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={15} color={C.inkMid} />
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: C.obsidian,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: C.gold, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer",
            }}>
              B
            </div>
          </div>
        </header>

        {/* ── Daily Briefing (mode-aware, full width) ── */}
        <DailyBriefing mode={mode} />

        {/* ── 3-Column Dashboard ── */}
        <main style={{
          flex: 1, padding: "24px 32px 40px",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignContent: "start",
        }}>

          {/* ── Col 1: Financial Stats ── */}
          <section>
            <SectionHeader icon={TrendingUp} label="Financial & Growth" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
            </div>
            {/* Milestone card */}
            <div style={{
              background: C.obsidian, borderRadius: 12, padding: "16px 20px",
              border: `1px solid ${C.goldBorder}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Star size={13} color={C.gold} />
                <p style={{ margin: 0, fontSize: 11, color: C.gold, letterSpacing: "0.08em" }}>NEXT MILESTONE</p>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: C.white, fontWeight: 500 }}>$20k Monthly Revenue</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6A6A6A" }}>$7,520 away — keep the momentum.</p>
              <div style={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,0.08)", marginTop: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "62%", borderRadius: 3, background: C.gold }} />
              </div>
            </div>
          </section>

          {/* ── Col 2: AI Prioritized Tasks ── */}
          <section>
            <SectionHeader
              icon={Zap}
              label={
                mode === "maintenance" ? "Quick Wins" :
                mode === "steady"      ? "Standard Ops" :
                                         "Growth Focus"
              }
              badge={`${pendingCount} pending`}
            />

            {/* Mode label strip */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 12px", borderRadius: 8, marginBottom: 10,
              background: mode === "maintenance" ? C.successLight :
                          mode === "steady"      ? C.goldLight    : C.rose,
              border: `1px solid ${
                mode === "maintenance" ? "rgba(74,124,89,0.2)" :
                mode === "steady"      ? C.goldBorder           : "rgba(160,90,90,0.2)"
              }`,
            }}>
              {mode === "maintenance" && <span style={{ fontSize: 11, color: C.success, fontWeight: 500 }}>🌿 Maintenance Mode — small wins only</span>}
              {mode === "steady"      && <span style={{ fontSize: 11, color: "#9A7A2A",  fontWeight: 500 }}>⚡ Steady Mode — consistent operations</span>}
              {mode === "empire"      && <span style={{ fontSize: 11, color: C.roseText,  fontWeight: 500 }}>🔥 Empire Mode — growth focus only</span>}
            </div>

            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "16px" }}>
              {currentTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
              <button style={{
                width: "100%", marginTop: 8, padding: "9px", borderRadius: 8,
                border: `1px dashed ${C.goldBorder}`, background: "transparent",
                color: C.gold, fontSize: 12, cursor: "pointer",
                fontWeight: 500, letterSpacing: "0.04em",
              }}>
                + Add Task
              </button>
            </div>
          </section>

          {/* ── Col 3: Goal Snapshot + Vault Status ── */}
          <section>
            <SectionHeader icon={Target} label="Goal Snapshot" />
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "20px" }}>
              {GOALS.map((g) => <GoalBar key={g.label} goal={g} />)}
            </div>

            {/* Vault Status */}
            <div style={{ marginTop: 16, background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Archive size={14} color={C.inkMid} />
                <p style={{ margin: 0, fontSize: 12, color: C.inkMid, fontWeight: 500, letterSpacing: "0.04em" }}>VAULT STATUS</p>
              </div>
              {[
                { label: "Business Plan",        ready: true  },
                { label: "Pitch Deck",           ready: true  },
                { label: "Financial Projections",ready: true  },
                { label: "Legal Docs",           ready: false },
              ].map(({ label, ready }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  {ready
                    ? <CheckCircle2 size={14} color={C.success}  />
                    : <Circle       size={14} color={C.inkLight} />
                  }
                  <span style={{ fontSize: 12, color: ready ? C.ink : C.inkLight }}>{label}</span>
                  {!ready && (
                    <span style={{
                      marginLeft: "auto", fontSize: 10, color: C.roseText,
                      background: C.rose, padding: "2px 8px", borderRadius: 8,
                    }}>
                      Needed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
        </> /* end Command Center route */
        }
      </div>
    </div>
  );
}
