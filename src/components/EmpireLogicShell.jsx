import { useState, useEffect } from "react";
import SocialStudio from "./SocialStudio";
import FounderPerks from "./FounderPerks";
import TheVault from "./TheVault";
import {
  LayoutDashboard, Archive, Share2, Gift, DollarSign, Users, TrendingUp,
  Target, Shield, ChevronRight, Zap, BarChart2, CheckCircle2, Circle, Star,
  Bell, MessageSquare, Video, PhoneCall, FileText, Upload, Mail, Wallet,
  CalendarCheck, Megaphone, Lightbulb, Flame, Brain, Plus, RefreshCw,
  AlertTriangle, ArrowRight, X, ClipboardList, Activity, Coffee,
  ChevronDown, ChevronUp, Trash2,
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
  amber:         "rgba(201,122,76,0.10)",
  amberBorder:   "rgba(201,122,76,0.25)",
  amberText:     "#C97A4C",
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

/* ─── Energy Mode Config ─────────────────────────────────────────────── */
const MAINTENANCE_TASKS = [
  { id: "m1", text: "Upload 1 document to the Vault",         icon: Upload,        priority: "low",    done: false },
  { id: "m2", text: "Archive 5 emails from your inbox",       icon: Mail,          priority: "low",    done: false },
  { id: "m3", text: "Check bank balance & flag anything odd", icon: Wallet,        priority: "low",    done: false },
  { id: "m4", text: "Reply to 1 pending client message",      icon: MessageSquare, priority: "low",    done: false },
  { id: "m5", text: "Set tomorrow's top 3 priorities",        icon: CalendarCheck, priority: "low",    done: false },
];
const STEADY_TASKS = [
  { id: "s1", text: "Follow up with 2 warm leads",            icon: MessageSquare, priority: "medium", done: false },
  { id: "s2", text: "Review your weekly schedule",            icon: CalendarCheck, priority: "medium", done: false },
  { id: "s3", text: "Send weekly client check-in emails",     icon: Mail,          priority: "medium", done: false },
  { id: "s4", text: "Update project tracker & task board",    icon: FileText,      priority: "low",    done: false },
  { id: "s5", text: "Post 1 piece of educational content",    icon: Megaphone,     priority: "medium", done: false },
];
const EMPIRE_TASKS = [
  { id: "e1", text: "Record 3 Reels for Social Studio",              icon: Video,      priority: "high",   done: false },
  { id: "e2", text: "Host or fully prep your Sales Call",            icon: PhoneCall,  priority: "high",   done: false },
  { id: "e3", text: "Draft new offer strategy or price increase",    icon: Lightbulb,  priority: "high",   done: false },
  { id: "e4", text: "Pitch to 1 dream client or partnership",        icon: Star,       priority: "high",   done: false },
  { id: "e5", text: "Optimize your highest revenue stream",          icon: TrendingUp, priority: "medium", done: false },
];

const ENERGY_META = {
  1: { mode: "maintenance", label: "Rest Mode",    sub: "Light admin only",         color: "#7C9A8A" },
  2: { mode: "maintenance", label: "Slow Burn",    sub: "Emails & easy wins",       color: "#9A9A7C" },
  3: { mode: "steady",      label: "In the Zone",  sub: "Balanced work day",        color: C.gold    },
  4: { mode: "empire",      label: "Power Mode",   sub: "Deep work & big moves",    color: "#C97A4C" },
  5: { mode: "empire",      label: "CEO Energy",   sub: "Full execution — go hard", color: "#C94C4C" },
};

const GREETINGS = {
  maintenance: {
    headline: (name)          => `Take it easy today, ${name}.`,
    sub:      (pending)       => `${pending} light tasks ready — no pressure.`,
  },
  steady: {
    headline: (name, greet)   => `${greet}, ${name}.`,
    sub:      (pending)       => `${pending} tasks awaiting — steady & on track.`,
  },
  empire: {
    headline: (name)          => `The empire is calling, ${name}.`,
    sub:      (pending)       => `${pending} power moves on deck. Let's go.`,
  },
};

/* ─── Fallback AI content (shown before API responds) ───────────────── */
const FALLBACK_ACTIONS = [
  { rank: 1, action: "Follow up with your 2 warmest leads today", impact: 4800, why: "Warm leads close 5× faster than new outreach — don't let them go cold." },
  { rank: 2, action: "Post content with a direct offer CTA",       impact: 1200, why: "Your last posts had no CTA. Content without an ask generates zero revenue." },
  { rank: 3, action: "DM 3 people who engaged with your last post",impact: 800,  why: "Engagement signals buying intent — follow up within 24 hours." },
];
const FALLBACK_NONNEG  = "Follow up with your 2 warmest leads";
const FALLBACK_OBS = [
  { type: "insight", text: "Add your active leads and pipeline data in the Revenue Engine setup to get observations tailored to your business." },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const getMode    = (level) => ENERGY_META[level].mode;
const timeGreet  = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const getWeekStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toDateString();
};
const todayStr   = () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const PRIORITY_STYLE = {
  high:   { bg: C.rose,         color: C.roseText, label: "High" },
  medium: { bg: C.goldLight,    color: "#9A7A2A",   label: "Mid"  },
  low:    { bg: C.successLight, color: C.success,   label: "Low"  },
};

/* ═══════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════ */

/* ── Sidebar ── */
function Sidebar({ activeNav, setActiveNav, tasksDone, tasksTotal, energyLevel, setEnergyLevel }) {
  const pct  = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;
  const meta = ENERGY_META[energyLevel];
  return (
    <aside style={{
      width: 240, minHeight: "100vh", background: C.obsidian,
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      borderRight: `1px solid ${C.goldBorder}`, overflowY: "auto",
    }}>
      <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${C.goldBorder}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: C.goldLight, border: `1px solid ${C.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={16} color={C.gold} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ color: C.white, fontSize: 14, fontWeight: 600, margin: 0, letterSpacing: "0.04em" }}>EMPIRE</p>
            <p style={{ color: C.gold,  fontSize: 10, margin: 0, letterSpacing: "0.12em" }}>LOGIC</p>
          </div>
        </div>
      </div>

      <nav style={{ padding: "16px 12px 8px", flexShrink: 0 }}>
        <p style={{ color: C.inkLight, fontSize: 10, letterSpacing: "0.1em", padding: "0 10px 8px", margin: 0 }}>NAVIGATION</p>
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
              <span style={{ color: active ? C.gold : "#9A9A9A", fontSize: 13, fontWeight: active ? 500 : 400 }}>{label}</span>
              {active && <ChevronRight size={12} color={C.gold} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </nav>

      <div style={{ margin: "8px 12px 0", padding: "14px", borderRadius: 10, background: C.obsidianSurf, border: `1px solid ${C.goldBorder}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Zap size={11} color={C.gold} />
          <p style={{ margin: 0, fontSize: 9, color: C.gold, letterSpacing: "0.1em", fontWeight: 600 }}>ENERGY LEVEL</p>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[1,2,3,4,5].map((n) => {
            const active = n === energyLevel;
            return (
              <button key={n} onClick={() => setEnergyLevel(n)} style={{
                flex: 1, height: 30, borderRadius: 7,
                border: active ? `1.5px solid ${C.gold}` : "1px solid rgba(255,255,255,0.08)",
                background: active ? C.goldLight : "transparent",
                color: active ? C.gold : "#555",
                fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer",
                boxShadow: active ? C.goldGlow : "none",
              }}>{n}</button>
            );
          })}
        </div>
        <p style={{ margin: 0, fontSize: 11 }}>
          <strong style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</strong>
          <span style={{ color: "#555", fontSize: 10 }}> — {meta.sub}</span>
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ margin: "12px 12px 16px", padding: "14px", borderRadius: 10, background: C.obsidianSurf, border: `1px solid ${C.goldBorder}`, flexShrink: 0 }}>
        <p style={{ color: C.gold, fontSize: 9, letterSpacing: "0.1em", margin: "0 0 10px", fontWeight: 600 }}>WEEKLY PULSE</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ color: C.white, fontSize: 20, fontWeight: 600 }}>{tasksDone}</span>
          <span style={{ color: C.inkLight, fontSize: 11 }}>of {tasksTotal} tasks</span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: `linear-gradient(90deg, ${C.gold}, #E8C96A)`, transition: "width 0.4s ease" }} />
        </div>
        <p style={{ color: C.inkLight, fontSize: 10, margin: 0 }}>{pct}% of weekly goal complete</p>
      </div>
    </aside>
  );
}

/* ── Stat Card ── */
function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.creamDeep}`, borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.goldLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={C.gold} strokeWidth={1.5} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, color: stat.up ? C.success : C.roseText, background: stat.up ? C.successLight : C.rose, padding: "2px 8px", borderRadius: 10 }}>{stat.delta}</span>
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
  const ps = PRIORITY_STYLE[task.priority];
  const Icon = task.icon;
  return (
    <div onClick={() => onToggle(task.id)} style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 12px", borderRadius: 8, cursor: "pointer",
      border: `1px solid ${C.creamDeep}`, marginBottom: 6,
      opacity: task.done ? 0.5 : 1, background: task.done ? "transparent" : C.white,
    }}>
      {task.done
        ? <CheckCircle2 size={16} color={C.success}  strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }} />
        : <Circle       size={16} color={C.inkLight} strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }} />}
      <span style={{ flex: 1, fontSize: 13, color: task.done ? C.inkLight : C.ink, textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
      <span style={{ fontSize: 10, fontWeight: 500, color: ps.color, background: ps.bg, padding: "2px 7px", borderRadius: 8, flexShrink: 0 }}>{ps.label}</span>
    </div>
  );
}

/* ── Goal Progress Bar ── */
function GoalBar({ goal }) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);
  const fmt = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `${n}`;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{goal.label}</span>
        <span style={{ fontSize: 12, color: C.inkLight }}>{fmt(goal.current)} / {fmt(goal.target)}</span>
      </div>
      <div style={{ height: 8, borderRadius: 6, background: C.creamDeep, overflow: "hidden", marginBottom: 3 }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: goal.color, transition: "width 0.6s ease" }} />
      </div>
      <p style={{ margin: 0, fontSize: 11, color: C.inkLight, textAlign: "right" }}>{pct}%</p>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ icon: Icon, label, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon size={14} color={C.gold} strokeWidth={1.5} />
      <h2 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</h2>
      {badge && <span style={{ marginLeft: "auto", fontSize: 10, color: C.gold, background: C.goldLight, padding: "2px 9px", borderRadius: 10, border: `1px solid ${C.goldBorder}` }}>{badge}</span>}
    </div>
  );
}

/* ── Input style helper ── */
const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: `1px solid ${C.creamDeep}`, fontSize: 14, color: C.ink,
  outline: "none", background: C.cream, fontFamily: "inherit", boxSizing: "border-box",
};
const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 600, color: C.inkMid, letterSpacing: "0.06em", marginBottom: 6,
};

/* ── Modal Shell ── */
function ModalShell({ onClose, children, width = 480 }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.creamDeep}`, padding: "32px", width, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NEW FEATURES
═══════════════════════════════════════════════════════════════════════ */

/* ── Onboarding Modal ── */
function OnboardingModal({ onSave, onClose }) {
  const [step, setStep]             = useState(1);
  const [name, setName]             = useState("Bryttani");
  const [leads, setLeads]           = useState([{ name: "", dealSize: "" }, { name: "", dealSize: "" }]);
  const [offerPrice, setOfferPrice] = useState("");
  const [postingFreq, setPostingFreq] = useState("3");
  const [pipelineValue, setPipelineValue] = useState("");
  const [revenueGoal, setRevenueGoal]     = useState("20000");
  const [currentRevenue, setCurrentRevenue] = useState("");

  const addLead   = () => setLeads([...leads, { name: "", dealSize: "" }]);
  const removeLead = (i) => setLeads(leads.filter((_, idx) => idx !== i));
  const updateLead = (i, field, val) => setLeads(leads.map((l, idx) => idx === i ? { ...l, [field]: val } : l));

  const handleSave = () => {
    const profile = {
      name: name || "Bryttani",
      leads: leads.filter((l) => l.name.trim()),
      offerPrice:      parseFloat(offerPrice)     || 1500,
      postingFreq:     parseInt(postingFreq)       || 3,
      pipelineValue:   parseFloat(pipelineValue)   || 0,
      revenueGoal:     parseFloat(revenueGoal)     || 20000,
      currentRevenue:  parseFloat(currentRevenue)  || 0,
    };
    localStorage.setItem("el_profile", JSON.stringify(profile));
    onSave(profile);
  };

  const btnPrimary = {
    flex: 2, padding: "12px", borderRadius: 10, border: `1px solid ${C.goldBorder}`,
    background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`, color: C.obsidian,
    fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 12px rgba(201,168,76,0.3)",
  };
  const btnSecondary = {
    flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.creamDeep}`,
    background: "transparent", color: C.inkMid, fontSize: 13, fontWeight: 500, cursor: "pointer",
  };

  return (
    <ModalShell onClose={onClose} width={520}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Brain size={18} color={C.gold} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.ink, fontFamily: "'Playfair Display', Georgia, serif" }}>Revenue Engine Setup</h2>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: 13, color: C.inkLight, lineHeight: 1.6 }}>
        Tell the Co-Pilot about your business so it can prioritize your daily actions by revenue impact.
      </p>

      {step === 1 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>YOUR NAME</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bryttani" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>YOUR CORE OFFER PRICE ($)</label>
            <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="e.g. 1500" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>HOW MANY TIMES DO YOU POST PER WEEK?</label>
            <input type="number" value={postingFreq} onChange={(e) => setPostingFreq(e.target.value)} placeholder="e.g. 3" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>MONTHLY REVENUE GOAL ($)</label>
            <input type="number" value={revenueGoal} onChange={(e) => setRevenueGoal(e.target.value)} placeholder="e.g. 20000" style={inputStyle} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={btnSecondary}>Skip for Now</button>
            <button onClick={() => setStep(2)} style={btnPrimary}>Next: Add Leads →</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>CURRENT MONTHLY REVENUE ($)</label>
            <input type="number" value={currentRevenue} onChange={(e) => setCurrentRevenue(e.target.value)} placeholder="e.g. 12480" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 6 }}>
            <label style={labelStyle}>TOTAL PIPELINE VALUE ($)</label>
            <input type="number" value={pipelineValue} onChange={(e) => setPipelineValue(e.target.value)} placeholder="e.g. 38000" style={inputStyle} />
          </div>

          <div style={{ marginTop: 20, marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ ...labelStyle, margin: 0 }}>ACTIVE LEADS (name + deal size)</label>
              <button onClick={addLead} style={{ fontSize: 11, color: C.gold, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>+ Add Lead</button>
            </div>
            {leads.map((lead, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <input value={lead.name} onChange={(e) => updateLead(i, "name", e.target.value)} placeholder="Lead name" style={{ ...inputStyle, flex: 2 }} />
                <input type="number" value={lead.dealSize} onChange={(e) => updateLead(i, "dealSize", e.target.value)} placeholder="Deal $" style={{ ...inputStyle, flex: 1 }} />
                {leads.length > 1 && (
                  <button onClick={() => removeLead(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight, flexShrink: 0 }}><X size={14} /></button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(1)} style={btnSecondary}>← Back</button>
            <button onClick={handleSave} style={btnPrimary}>Launch Revenue Engine 🚀</button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ── Daily Revenue Engine ── */
function DailyRevenueEngine({ actions, nonNegotiable, loading, onRefresh, hasProfile, onSetup }) {
  const rankLabel = ["🔥 #1 PRIORITY", "⚡ #2 PRIORITY", "📊 #3 PRIORITY"];

  return (
    <div style={{
      margin: "20px 32px 0", background: C.obsidian, borderRadius: 16,
      border: `1px solid ${C.goldBorder}`, overflow: "hidden",
    }}>
      {/* Header row */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(201,168,76,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Target size={14} color={C.gold} />
          <span style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: "0.12em" }}>TODAY'S FOCUS</span>
          <span style={{ fontSize: 11, color: "#555", marginLeft: 4 }}>{todayStr()}</span>
        </div>
        {hasProfile && (
          <button onClick={onRefresh} disabled={loading} style={{
            background: "transparent", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 8,
            padding: "5px 12px", cursor: loading ? "default" : "pointer",
            display: "flex", alignItems: "center", gap: 6, color: loading ? "#444" : "#888", fontSize: 11,
          }}>
            <RefreshCw size={11} color={loading ? "#444" : "#888"} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Thinking..." : "Refresh"}
          </button>
        )}
      </div>

      {!hasProfile ? (
        /* Setup prompt */
        <div style={{ padding: "36px 24px", textAlign: "center" }}>
          <Brain size={30} color="#333" style={{ marginBottom: 14 }} />
          <p style={{ color: "#777", fontSize: 14, marginBottom: 8, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 20px" }}>
            Tell the AI Co-Pilot about your leads, pipeline, and revenue goals so it can rank your daily actions by real dollar impact.
          </p>
          <button onClick={onSetup} style={{
            padding: "11px 28px", borderRadius: 10,
            background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`,
            border: "none", color: C.obsidian, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>Set Up Revenue Engine →</button>
        </div>
      ) : loading ? (
        /* Loading skeleton */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ padding: "22px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ height: 10, background: "#1C1C1C", borderRadius: 4, marginBottom: 12, width: "60%" }} />
              <div style={{ height: 14, background: "#1C1C1C", borderRadius: 4, marginBottom: 8, width: "90%" }} />
              <div style={{ height: 14, background: "#1C1C1C", borderRadius: 4, marginBottom: 16, width: "75%" }} />
              <div style={{ height: 10, background: "#1C1C1C", borderRadius: 4, width: "40%" }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 3 action cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {actions.map((action, i) => (
              <div key={i} style={{ padding: "22px", borderRight: i < 2 ? "1px solid rgba(201,168,76,0.08)" : "none" }}>
                <span style={{ fontSize: 10, color: i === 0 ? C.gold : "#666", fontWeight: 700, letterSpacing: "0.1em" }}>{rankLabel[i]}</span>
                <p style={{ color: C.white, fontSize: 14, fontWeight: 500, lineHeight: 1.55, margin: "10px 0 8px", minHeight: 44 }}>{action.action}</p>
                <p style={{ color: "#666", fontSize: 12, margin: "0 0 14px", lineHeight: 1.5 }}>{action.why}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <DollarSign size={12} color={C.gold} />
                  <span style={{ color: C.gold, fontSize: 13, fontWeight: 600 }}>~${action.impact.toLocaleString()} impact</span>
                </div>
              </div>
            ))}
          </div>

          {/* Non-negotiable CTA strip */}
          <div style={{ padding: "13px 24px", background: "rgba(201,168,76,0.07)", borderTop: `1px solid rgba(201,168,76,0.15)`, display: "flex", alignItems: "center", gap: 12 }}>
            <ArrowRight size={14} color={C.gold} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "#888", fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0 }}>IF YOU DO NOTHING ELSE TODAY →</span>
            <span style={{ color: C.gold, fontSize: 14, fontWeight: 600 }}>{nonNegotiable}</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Co-Pilot Card ── */
function CoPilotCard({ observations, loading }) {
  const obsStyle = {
    warning: { color: C.amberText,   bg: C.amber,    border: C.amberBorder,    icon: AlertTriangle },
    insight: { color: C.lavenderText, bg: C.lavender, border: C.lavenderBorder, icon: Brain },
    action:  { color: C.gold,         bg: C.goldLight, border: C.goldBorder,   icon: Zap },
  };
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Brain size={14} color={C.inkMid} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.ink, letterSpacing: "0.06em", textTransform: "uppercase" }}>Co-Pilot Observations</h2>
        <span style={{ marginLeft: "auto", fontSize: 9, color: "#BBB", letterSpacing: "0.06em" }}>UPDATED DAILY</span>
      </div>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1,2].map(i => <div key={i} style={{ height: 48, background: C.creamDeep, borderRadius: 8 }} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {observations.map((obs, i) => {
            const s = obsStyle[obs.type] || obsStyle.insight;
            const Icon = s.icon;
            return (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: s.bg, border: `1px solid ${s.border}` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <Icon size={13} color={s.color} style={{ marginTop: 2, flexShrink: 0 }} strokeWidth={1.5} />
                  <p style={{ margin: 0, fontSize: 12.5, color: C.inkMid, lineHeight: 1.65 }}>"{obs.text}"</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Log Action Modal ── */
function LogActionModal({ onSave, onClose }) {
  const [action, setAction]         = useState("");
  const [count, setCount]           = useState("");
  const [result, setResult]         = useState("");
  const [revenueImpact, setRevenue] = useState("");

  const handleSave = () => {
    if (!action.trim()) return;
    onSave({ id: Date.now(), action: action.trim(), count: parseInt(count) || 1, result: result.trim() || "No result yet", revenueImpact: revenueImpact.trim() || "$0", date: new Date().toLocaleDateString() });
    onClose();
  };

  return (
    <ModalShell onClose={onClose} width={440}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Activity size={16} color={C.gold} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.ink }}>Log an Action</h2>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
      </div>
      <p style={{ margin: "0 0 22px", fontSize: 12, color: C.inkLight }}>Track what you did and what it produced.</p>

      {[
        { label: "ACTION TAKEN", value: action, set: setAction, placeholder: "e.g. DMs sent, posts published, discovery calls", type: "text" },
        { label: "# DONE",       value: count,  set: setCount,  placeholder: "e.g. 5",                                            type: "number" },
        { label: "RESULT",       value: result, set: setResult, placeholder: "e.g. 2 calls booked, 1 deal closed, no result yet", type: "text" },
        { label: "REVENUE IMPACT", value: revenueImpact, set: setRevenue, placeholder: "e.g. $2,400 pipeline or $1,500 won",      type: "text" },
      ].map(({ label, value, set, placeholder, type }) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <label style={labelStyle}>{label}</label>
          <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={inputStyle} />
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.creamDeep}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer" }}>Cancel</button>
        <button onClick={handleSave} style={{ flex: 2, padding: "11px", borderRadius: 10, border: `1px solid ${C.goldBorder}`, background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`, color: C.obsidian, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Log It</button>
      </div>
    </ModalShell>
  );
}

/* ── What's Working Table ── */
function WhatWorkingTable({ actionLog, insight, onLogAction, onDelete }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.creamDeep}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={14} color={C.gold} />
          <h2 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.ink, letterSpacing: "0.06em", textTransform: "uppercase" }}>What's Working</h2>
          {actionLog.length > 0 && <span style={{ fontSize: 10, color: C.inkLight, background: C.creamDeep, padding: "2px 8px", borderRadius: 10 }}>{actionLog.length} entries</span>}
        </div>
        <button onClick={onLogAction} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.gold, fontSize: 11, fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em" }}>
          <Plus size={11} color={C.gold} /> Log Action
        </button>
      </div>

      {actionLog.length === 0 ? (
        <div style={{ padding: "32px 20px", textAlign: "center" }}>
          <ClipboardList size={26} color={C.inkLight} style={{ marginBottom: 10 }} />
          <p style={{ color: C.inkLight, fontSize: 13, margin: "0 0 4px", fontWeight: 500 }}>No actions logged yet.</p>
          <p style={{ color: C.inkLight, fontSize: 12, margin: 0 }}>Start tracking what you do — the AI will tell you what's actually making money.</p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAF8" }}>
                  {["Action", "# Done", "Result", "Revenue Impact", "Date", ""].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, color: C.inkLight, fontWeight: 600, letterSpacing: "0.06em", borderBottom: `1px solid ${C.creamDeep}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {actionLog.map((row, i) => (
                  <tr key={row.id} style={{ background: i % 2 === 0 ? C.white : "#FAFAF8" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: C.ink, borderBottom: `1px solid ${C.creamDeep}`, fontWeight: 500 }}>{row.action}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: C.ink, fontWeight: 600, borderBottom: `1px solid ${C.creamDeep}`, textAlign: "center" }}>{row.count}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: C.inkMid, borderBottom: `1px solid ${C.creamDeep}` }}>{row.result}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: C.success, fontWeight: 600, borderBottom: `1px solid ${C.creamDeep}`, whiteSpace: "nowrap" }}>{row.revenueImpact}</td>
                    <td style={{ padding: "12px 16px", fontSize: 11, color: C.inkLight, borderBottom: `1px solid ${C.creamDeep}`, whiteSpace: "nowrap" }}>{row.date}</td>
                    <td style={{ padding: "12px 12px", borderBottom: `1px solid ${C.creamDeep}` }}>
                      <button onClick={() => onDelete(row.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight, padding: 4, borderRadius: 4 }}><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {insight && (
            <div style={{ padding: "12px 20px", background: C.lavender, borderTop: `1px solid ${C.lavenderBorder}`, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Flame size={12} color={C.lavenderText} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: C.lavenderText, fontStyle: "italic", lineHeight: 1.55 }}>"{insight}"</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Daily Check-In Modal ── */
function DailyCheckInModal({ onClose }) {
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("el_checkin_date", new Date().toDateString());
    localStorage.setItem("el_last_checkin", JSON.stringify({ date: new Date().toLocaleDateString(), topAction: q1, followUps: q2, onlinePresence: q3 }));
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <ModalShell onClose={onClose} width={480}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Coffee size={18} color={C.gold} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.ink, fontFamily: "'Playfair Display', Georgia, serif" }}>Daily Check-In</h2>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: 13, color: C.inkLight }}>2 minutes. Every morning. This feeds your Revenue Engine.</p>

      {saved ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <CheckCircle2 size={36} color={C.success} style={{ marginBottom: 12 }} />
          <p style={{ color: C.ink, fontSize: 15, fontWeight: 500 }}>Check-in complete. Let's get to work.</p>
        </div>
      ) : (
        <>
          {[
            { label: "WHAT'S YOUR #1 REVENUE ACTION TODAY?", value: q1, set: setQ1, placeholder: "Be specific — name the action and who it involves" },
            { label: "ANY LEADS TO FOLLOW UP WITH?",         value: q2, set: setQ2, placeholder: "Names, or 'none today'" },
            { label: "HOW ARE YOU SHOWING UP ONLINE TODAY?", value: q3, set: setQ3, placeholder: "e.g. posting a story, going live, DMs only" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <label style={labelStyle}>{label}</label>
              <textarea value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} rows={2}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.creamDeep}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer" }}>Skip Today</button>
            <button onClick={handleSave} style={{ flex: 2, padding: "12px", borderRadius: 10, border: `1px solid ${C.goldBorder}`, background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`, color: C.obsidian, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Lock In My Day →</button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ── Weekly Reset Modal ── */
function WeeklyResetModal({ onClose }) {
  const [wins, setWins]     = useState("");
  const [stuck, setStuck]   = useState("");
  const [priorities, setPriorities] = useState("");
  const [saved, setSaved]   = useState(false);

  const handleSave = () => {
    const weekStr = getWeekStr();
    localStorage.setItem("el_weekly_date", weekStr);
    localStorage.setItem("el_last_weekly", JSON.stringify({ week: weekStr, wins, stuck, priorities }));
    setSaved(true);
    setTimeout(onClose, 1800);
  };

  return (
    <ModalShell onClose={onClose} width={500}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Star size={18} color={C.gold} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.ink, fontFamily: "'Playfair Display', Georgia, serif" }}>Weekly Reset</h2>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: 13, color: C.inkLight }}>Clear the slate. Set the tone. Plan the wins.</p>

      {saved ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <CheckCircle2 size={36} color={C.success} style={{ marginBottom: 12 }} />
          <p style={{ color: C.ink, fontSize: 15, fontWeight: 500, margin: 0 }}>Weekly focus locked in. This week belongs to you.</p>
        </div>
      ) : (
        <>
          {[
            { label: "WHAT WERE YOUR WINS LAST WEEK?",    value: wins,       set: setWins,       placeholder: "Revenue closed, content wins, client breakthroughs — anything that moved the needle" },
            { label: "WHAT DIDN'T MOVE? WHY?",            value: stuck,      set: setStuck,      placeholder: "Be honest. No judgment here. What stalled and what was the real reason?" },
            { label: "YOUR 3 REVENUE PRIORITIES THIS WEEK", value: priorities, set: setPriorities, placeholder: "1. \n2. \n3. " },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <label style={labelStyle}>{label}</label>
              <textarea value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.creamDeep}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer" }}>Skip</button>
            <button onClick={handleSave} style={{ flex: 2, padding: "12px", borderRadius: 10, border: `1px solid ${C.goldBorder}`, background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`, color: C.obsidian, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Set My Week →</button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ── Monthly Review Modal ── */
function MonthlyReviewModal({ liveStats, actionLog, onClose }) {
  const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const [stopText, setStopText]       = useState("");
  const [startText, setStartText]     = useState("");
  const [continueText, setContinueText] = useState("");
  const [saved, setSaved] = useState(false);

  // Find top action from log
  const topAction = actionLog.length > 0
    ? [...actionLog].sort((a, b) => b.count - a.count)[0]?.action
    : null;

  const handleSave = () => {
    const monthStr = `${new Date().getFullYear()}-${new Date().getMonth()}`;
    localStorage.setItem("el_monthly_date", monthStr);
    localStorage.setItem("el_last_monthly", JSON.stringify({ month, stopText, startText, continueText }));
    setSaved(true);
    setTimeout(onClose, 2000);
  };

  return (
    <ModalShell onClose={onClose} width={520}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <TrendingUp size={18} color={C.gold} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.ink, fontFamily: "'Playfair Display', Georgia, serif" }}>Monthly Review — {month}</h2>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: C.inkLight }}>Your monthly snapshot. Be real. Grow from it.</p>

      {saved ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <CheckCircle2 size={36} color={C.success} style={{ marginBottom: 12 }} />
          <p style={{ color: C.ink, fontSize: 15, fontWeight: 500, margin: 0 }}>Monthly snapshot saved. Screenshot it.</p>
        </div>
      ) : (
        <>
          {/* Snapshot stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, padding: "16px", background: C.obsidian, borderRadius: 12, border: `1px solid ${C.goldBorder}` }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: C.gold }}>${Number(liveStats.revenue).toLocaleString()}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#666", letterSpacing: "0.06em" }}>REVENUE THIS MONTH</p>
            </div>
            <div style={{ textAlign: "center", borderLeft: "1px solid #222", borderRight: "1px solid #222" }}>
              <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: C.white }}>{liveStats.clients}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#666", letterSpacing: "0.06em" }}>ACTIVE CLIENTS</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: C.white }}>{actionLog.length}</p>
              <p style={{ margin: 0, fontSize: 10, color: "#666", letterSpacing: "0.06em" }}>ACTIONS LOGGED</p>
            </div>
          </div>

          {topAction && (
            <div style={{ padding: "12px 16px", background: C.successLight, border: `1px solid rgba(74,124,89,0.2)`, borderRadius: 10, marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
              <Star size={13} color={C.success} />
              <p style={{ margin: 0, fontSize: 12, color: C.success, fontWeight: 500 }}>Top action this month: <strong>{topAction}</strong></p>
            </div>
          )}

          {/* Stop / Start / Continue */}
          {[
            { label: "ONE THING TO STOP",     value: stopText,     set: setStopText,     placeholder: "What drained your time with no return?" },
            { label: "ONE THING TO START",     value: startText,    set: setStartText,    placeholder: "What have you been avoiding that you know would grow revenue?" },
            { label: "ONE THING TO CONTINUE",  value: continueText, set: setContinueText, placeholder: "What clearly worked and needs more of your energy?" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{label}</label>
              <textarea value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} rows={2}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.creamDeep}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer" }}>Close</button>
            <button onClick={handleSave} style={{ flex: 2, padding: "12px", borderRadius: 10, border: `1px solid ${C.goldBorder}`, background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`, color: C.obsidian, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save Snapshot →</button>
          </div>
        </>
      )}
    </ModalShell>
  );
}

/* ── Manual Sync Modal ── */
function ManualSyncModal({ onSave, onClose }) {
  const [revenue, setRevenue] = useState("");
  const [clients, setClients] = useState("");
  const handleSave = () => { onSave({ revenue: revenue.trim(), clients: clients.trim() }); onClose(); };
  return (
    <ModalShell onClose={onClose} width={400}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <BarChart2 size={16} color={C.gold} strokeWidth={1.5} />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.ink }}>Manual Sync</h2>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
      </div>
      <p style={{ margin: "0 0 24px", fontSize: 12, color: C.inkLight }}>Update your dashboard with your latest numbers.</p>
      {[
        { label: "MONTHLY REVENUE ($)", value: revenue, set: setRevenue, placeholder: "e.g. 12480" },
        { label: "ACTIVE CLIENTS",      value: clients, set: setClients, placeholder: "e.g. 24"    },
      ].map(({ label, value, set, placeholder }) => (
        <div key={label} style={{ marginBottom: 16 }}>
          <label style={labelStyle}>{label}</label>
          <input type="number" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={inputStyle} />
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 10, border: `1px solid ${C.creamDeep}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer" }}>Cancel</button>
        <button onClick={handleSave} style={{ flex: 2, padding: "11px", borderRadius: 10, border: `1px solid ${C.goldBorder}`, background: `linear-gradient(135deg, ${C.gold}, #E8C96A)`, color: C.obsidian, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Sync Dashboard</button>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function EmpireLogicShell() {
  const [activeNav,   setActiveNav]   = useState("command");
  const [energyLevel, setEnergyLevel] = useState(3);
  const [showSync,    setShowSync]    = useState(false);
  const [liveStats,   setLiveStats]   = useState({ revenue: 12480, clients: 24 });

  /* Task state per mode */
  const [taskStates, setTaskStates] = useState({
    maintenance: MAINTENANCE_TASKS.map((t) => ({ ...t })),
    steady:      STEADY_TASKS.map((t)      => ({ ...t })),
    empire:      EMPIRE_TASKS.map((t)      => ({ ...t })),
  });

  /* ── New feature state ── */
  const [profile,        setProfile]       = useState(null);
  const [revenueActions, setRevenueActions]= useState(FALLBACK_ACTIONS);
  const [nonNegotiable,  setNonNegotiable] = useState(FALLBACK_NONNEG);
  const [copilotObs,     setCopilotObs]    = useState(FALLBACK_OBS);
  const [weeklyInsight,  setWeeklyInsight] = useState("");
  const [actionLog,      setActionLog]     = useState([]);
  const [loadingRevenue, setLoadingRevenue]= useState(false);
  const [loadingObs,     setLoadingObs]    = useState(false);

  /* Modal visibility */
  const [showOnboarding,    setShowOnboarding]    = useState(false);
  const [showCheckIn,       setShowCheckIn]       = useState(false);
  const [showWeeklyReset,   setShowWeeklyReset]   = useState(false);
  const [showMonthlyReview, setShowMonthlyReview] = useState(false);
  const [showLogAction,     setShowLogAction]      = useState(false);

  /* ── Load persisted data on mount ── */
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("el_profile");
      const savedActions = localStorage.getItem("el_actions");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      else setShowOnboarding(true);
      if (savedActions) setActionLog(JSON.parse(savedActions));
    } catch {}

    // Ritual auto-triggers
    const now = new Date();
    const todayDateStr = now.toDateString();
    const lastCheckin  = localStorage.getItem("el_checkin_date");
    if ((!lastCheckin || lastCheckin !== todayDateStr) && now.getHours() >= 5 && now.getHours() < 12) {
      setShowCheckIn(true);
    }
    const lastWeekly = localStorage.getItem("el_weekly_date");
    if ((!lastWeekly || lastWeekly !== getWeekStr()) && (now.getDay() === 0 || now.getDay() === 1)) {
      // don't auto-show weekly — just make it accessible via button
    }
    const monthStr   = `${now.getFullYear()}-${now.getMonth()}`;
    const lastMonthly = localStorage.getItem("el_monthly_date");
    if ((!lastMonthly || lastMonthly !== monthStr) && now.getDate() === 1) {
      // don't auto-show monthly — accessible via button
    }
  }, []);

  /* ── Fetch AI content when profile is available ── */
  useEffect(() => {
    if (profile && activeNav === "command") {
      fetchRevenueActions();
      fetchObservations();
    }
  }, [profile, activeNav]);

  /* ── Fetch weekly insight when action log changes ── */
  useEffect(() => {
    if (actionLog.length >= 2) fetchWeeklyInsight();
  }, [actionLog.length]);

  /* ── API call helpers ── */
  const fetchRevenueActions = async () => {
    setLoadingRevenue(true);
    try {
      const res  = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "revenue_actions",
          context: { ...profile, daysSinceFollowup: 3, currentRevenue: liveStats.revenue },
        }),
      });
      const data = await res.json();
      if (data.actions)       setRevenueActions(data.actions);
      if (data.nonNegotiable) setNonNegotiable(data.nonNegotiable);
    } catch {}
    setLoadingRevenue(false);
  };

  const fetchObservations = async () => {
    setLoadingObs(true);
    try {
      const res  = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "observations",
          context: {
            daysSinceFollowup: 3,
            postsThisWeek:     profile?.postingFreq || 3,
            postsWithCTA:      1,
            avgDealSize:       profile?.offerPrice  || 1500,
            monthlyGoal:       profile?.revenueGoal || 20000,
            currentRevenue:    liveStats.revenue,
            actionsToday:      actionLog.filter(a => a.date === new Date().toLocaleDateString()).length,
            planningDays:      0,
          },
        }),
      });
      const data = await res.json();
      if (data.observations?.length) setCopilotObs(data.observations);
    } catch {}
    setLoadingObs(false);
  };

  const fetchWeeklyInsight = async () => {
    try {
      const res  = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "weekly_insight", context: { actionLog } }),
      });
      const data = await res.json();
      if (data.insight) setWeeklyInsight(data.insight);
    } catch {}
  };

  /* ── Action log helpers ── */
  const addAction = (entry) => {
    const updated = [entry, ...actionLog];
    setActionLog(updated);
    localStorage.setItem("el_actions", JSON.stringify(updated));
  };
  const deleteAction = (id) => {
    const updated = actionLog.filter((a) => a.id !== id);
    setActionLog(updated);
    localStorage.setItem("el_actions", JSON.stringify(updated));
  };

  const saveProfile = (p) => {
    setProfile(p);
    setShowOnboarding(false);
  };

  /* ── Derived values ── */
  const mode         = getMode(energyLevel);
  const meta         = ENERGY_META[energyLevel];
  const currentTasks = taskStates[mode];
  const pendingCount = currentTasks.filter((t) => !t.done).length;
  const doneCount    = currentTasks.filter((t) => t.done).length;
  const greetCfg     = GREETINGS[mode];

  const toggleTask = (id) => {
    setTaskStates((prev) => ({
      ...prev,
      [mode]: prev[mode].map((t) => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  const greetingLine =
    mode === "maintenance"
      ? greetCfg.headline("Bryttani")
      : greetCfg.headline("Bryttani", timeGreet());

  const dynStats = STATS.map((s) => {
    if (s.label === "Monthly Revenue") return { ...s, value: `$${Number(liveStats.revenue).toLocaleString()}` };
    if (s.label === "Active Clients")  return { ...s, value: `${liveStats.clients}` };
    return s;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream, fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        textarea { font-family: inherit; }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* ── Modals ── */}
      {showOnboarding    && <OnboardingModal   onSave={saveProfile} onClose={() => setShowOnboarding(false)} />}
      {showSync          && <ManualSyncModal   onSave={({ revenue, clients }) => setLiveStats({ revenue: revenue || liveStats.revenue, clients: clients || liveStats.clients })} onClose={() => setShowSync(false)} />}
      {showCheckIn       && <DailyCheckInModal onClose={() => setShowCheckIn(false)} />}
      {showWeeklyReset   && <WeeklyResetModal  onClose={() => setShowWeeklyReset(false)} />}
      {showMonthlyReview && <MonthlyReviewModal liveStats={liveStats} actionLog={actionLog} onClose={() => setShowMonthlyReview(false)} />}
      {showLogAction     && <LogActionModal    onSave={addAction} onClose={() => setShowLogAction(false)} />}

      {/* ── Sidebar ── */}
      <Sidebar
        activeNav={activeNav} setActiveNav={setActiveNav}
        tasksDone={doneCount} tasksTotal={currentTasks.length}
        energyLevel={energyLevel} setEnergyLevel={setEnergyLevel}
      />

      {/* ── Main Content ── */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {activeNav === "social" && <SocialStudio energyLevel={energyLevel} />}
        {activeNav === "perks"  && <FounderPerks />}
        {activeNav === "vault"  && <TheVault />}

        {activeNav === "command" && (
          <>
            {/* ── Header ── */}
            <header style={{ background: C.cream, borderBottom: `1px solid ${C.creamDeep}`, padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 500, margin: 0, lineHeight: 1.2, color: C.ink }}>{greetingLine}</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.inkLight }}>{greetCfg.sub(pendingCount)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Ritual buttons */}
                {[
                  { label: "Check-In",     icon: Coffee,      onClick: () => setShowCheckIn(true)       },
                  { label: "Weekly Reset", icon: Star,        onClick: () => setShowWeeklyReset(true)   },
                  { label: "Month Review", icon: TrendingUp,  onClick: () => setShowMonthlyReview(true) },
                ].map(({ label, icon: Icon, onClick }) => (
                  <button key={label} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 8, background: "transparent", border: `1px solid ${C.creamDeep}`, color: C.inkMid, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                    <Icon size={12} color={C.inkMid} /> {label}
                  </button>
                ))}
                <button onClick={() => setShowSync(true)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 20, background: C.obsidian, border: `1px solid ${C.goldBorder}`, color: C.gold, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  <BarChart2 size={12} color={C.gold} /> Sync
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: C.goldLight, border: `1px solid ${C.goldBorder}` }}>
                  <Zap size={11} color={C.gold} />
                  <span style={{ fontSize: 11, color: "#9A7A2A", fontWeight: 600 }}>{meta.label}</span>
                </div>
                <button style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${C.creamDeep}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bell size={14} color={C.inkMid} />
                </button>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.obsidian, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.gold, fontWeight: 700, cursor: "pointer" }}>B</div>
              </div>
            </header>

            {/* ── Daily Revenue Engine ── */}
            <DailyRevenueEngine
              actions={revenueActions}
              nonNegotiable={nonNegotiable}
              loading={loadingRevenue}
              onRefresh={fetchRevenueActions}
              hasProfile={!!profile}
              onSetup={() => setShowOnboarding(true)}
            />

            {/* ── 3-Column Grid ── */}
            <main style={{ flex: 1, padding: "20px 32px 40px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, alignContent: "start" }}>

              {/* Col 1: Financial Stats */}
              <section>
                <SectionHeader icon={TrendingUp} label="Financial & Growth" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {dynStats.map((s) => <StatCard key={s.label} stat={s} />)}
                </div>
                <div style={{ background: C.obsidian, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.goldBorder}` }}>
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

              {/* Col 2: Co-Pilot + Tasks */}
              <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <SectionHeader icon={Brain} label="Co-Pilot" />
                  <CoPilotCard observations={copilotObs} loading={loadingObs} />
                </div>
                <div>
                  <SectionHeader
                    icon={Zap}
                    label={mode === "maintenance" ? "Quick Wins" : mode === "steady" ? "Standard Ops" : "Growth Focus"}
                    badge={`${pendingCount} pending`}
                  />
                  <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "14px" }}>
                    {currentTasks.map((task) => <TaskItem key={task.id} task={task} onToggle={toggleTask} />)}
                  </div>
                </div>
              </section>

              {/* Col 3: Goal Snapshot + Vault Status */}
              <section>
                <SectionHeader icon={Target} label="Goal Snapshot" />
                <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "20px", marginBottom: 16 }}>
                  {GOALS.map((g) => <GoalBar key={g.label} goal={g} />)}
                </div>
                <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.creamDeep}`, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Archive size={14} color={C.inkMid} />
                    <p style={{ margin: 0, fontSize: 12, color: C.inkMid, fontWeight: 500, letterSpacing: "0.04em" }}>VAULT STATUS</p>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 12, background: C.successLight, border: "1px solid rgba(74,124,89,0.25)" }}>
                      <Shield size={11} color={C.success} />
                      <span style={{ fontSize: 10, color: C.success, fontWeight: 500 }}>Funding Ready</span>
                    </div>
                  </div>
                  {[
                    { label: "Business Plan",         ready: true  },
                    { label: "Pitch Deck",            ready: true  },
                    { label: "Financial Projections", ready: true  },
                    { label: "Legal Docs",            ready: false },
                  ].map(({ label, ready }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      {ready ? <CheckCircle2 size={14} color={C.success} /> : <Circle size={14} color={C.inkLight} />}
                      <span style={{ fontSize: 12, color: ready ? C.ink : C.inkLight }}>{label}</span>
                      {!ready && <span style={{ marginLeft: "auto", fontSize: 10, color: C.roseText, background: C.rose, padding: "2px 8px", borderRadius: 8 }}>Needed</span>}
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* ── What's Working — Full Width ── */}
            <div style={{ padding: "0 32px 48px" }}>
              <SectionHeader icon={Activity} label="What's Working" />
              <WhatWorkingTable
                actionLog={actionLog}
                insight={weeklyInsight}
                onLogAction={() => setShowLogAction(true)}
                onDelete={deleteAction}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
