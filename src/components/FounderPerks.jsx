import { useState } from "react";
import {
  ExternalLink,
  Star,
  Gift,
  Zap,
  ChevronRight,
  Building2,
  Users,
  Settings,
  Scale,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

/* ─── Design Tokens ──────────────────────────────────────────────── */
const C = {
  obsidian:     "#0A0A0A",
  obsidianMid:  "#141414",
  obsidianSurf: "#1C1C1C",
  gold:         "#C9A84C",
  goldLight:    "rgba(201,168,76,0.10)",
  goldBorder:   "rgba(201,168,76,0.22)",
  cream:        "#F9F8F3",
  creamDeep:    "#EAE6DC",
  ink:          "#1A1A1A",
  inkMid:       "#4A4A4A",
  inkLight:     "#8A8A8A",
  white:        "#FFFFFF",
  success:      "#4A7C59",
  successLight: "rgba(74,124,89,0.10)",
};

/* ─── Category Config ────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all",        label: "All",        icon: Sparkles  },
  { id: "banking",    label: "Banking",    icon: Building2 },
  { id: "payroll",    label: "Payroll",    icon: Users     },
  { id: "operations", label: "Ops",        icon: Settings  },
  { id: "legal",      label: "Legal",      icon: Scale     },
];

/* ─── Tools ──────────────────────────────────────────────────────── */
const TOOLS = [
  {
    id: "mercury", category: "banking",
    name: "Mercury Bank", tagline: "The founder's bank.",
    perk: "$250 Bonus", perkNote: "on first $10k deposit",
    cta: "Open Account", logo: "M", logoColor: "#7C9AFF",
    logoBg: "rgba(124,154,255,0.12)",
    highlights: ["No fees", "FDIC to $5M", "Virtual cards", "API access"],
  },
  {
    id: "relay", category: "banking",
    name: "Relay Bank", tagline: "20 accounts, zero fees.",
    perk: "$50 Bonus", perkNote: "first qualifying deposit",
    cta: "Open Free Account", logo: "R", logoColor: "#6AC4A4",
    logoBg: "rgba(106,196,164,0.12)",
    highlights: ["20 checking accts", "Profit First–ready", "Team controls", "Free wires"],
  },
  {
    id: "gusto", category: "payroll",
    name: "Gusto", tagline: "Payroll on autopilot.",
    perk: "$100 Gift Card", perkNote: "after first payroll",
    cta: "View Benefit", logo: "G", logoColor: "#E87B5A",
    logoBg: "rgba(232,123,90,0.12)",
    highlights: ["Auto tax filing", "Benefits admin", "1099 support", "HR tools"],
  },
  {
    id: "deel", category: "payroll",
    name: "Deel", tagline: "Pay global teams instantly.",
    perk: "$50 Credit", perkNote: "first month",
    cta: "Start Free Trial", logo: "D", logoColor: "#8A6AE8",
    logoBg: "rgba(138,106,232,0.12)",
    highlights: ["150+ countries", "Instant pay", "Compliant contracts", "Equipment"],
  },
  {
    id: "ramp", category: "operations",
    name: "Ramp", tagline: "1.5% cashback on everything.",
    perk: "$500 Cashback", perkNote: "first 3 months",
    cta: "Apply Now", logo: "RP", logoColor: "#F0C050",
    logoBg: "rgba(240,192,80,0.12)",
    highlights: ["1.5% cashback", "No personal guarantee", "Auto receipts", "Analytics"],
  },
  {
    id: "notion", category: "operations",
    name: "Notion", tagline: "Your empire's second brain.",
    perk: "6 Months Free", perkNote: "Notion Plus plan",
    cta: "Claim Free Plan", logo: "N", logoColor: "#1A1A1A",
    logoBg: "rgba(26,26,26,0.06)",
    highlights: ["Unlimited pages", "AI assistant", "Databases", "Team collab"],
  },
  {
    id: "loom", category: "operations",
    name: "Loom", tagline: "Record once. Communicate forever.",
    perk: "3 Months Free Pro", perkNote: "new Business account",
    cta: "Try Free", logo: "L", logoColor: "#7C5CDB",
    logoBg: "rgba(124,92,219,0.12)",
    highlights: ["Unlimited recording", "AI transcription", "Viewer insights", "CTA buttons"],
  },
  {
    id: "stripe-atlas", category: "legal",
    name: "Stripe Atlas", tagline: "Incorporate in 10 minutes.",
    perk: "$100 Off", perkNote: "incorporation fee",
    cta: "Form Your Company", logo: "SA", logoColor: "#6772E5",
    logoBg: "rgba(103,114,229,0.12)",
    highlights: ["Delaware C-Corp or LLC", "EIN + bank", "Stripe integration", "409A discounts"],
  },
  {
    id: "bonsai", category: "legal",
    name: "Bonsai", tagline: "Contracts & invoices automated.",
    perk: "25% Off First Year", perkNote: "any paid plan",
    cta: "Start Free Trial", logo: "B", logoColor: "#3AA87C",
    logoBg: "rgba(58,168,124,0.12)",
    highlights: ["Attorney-approved", "e-Signature", "Auto invoicing", "Time tracking"],
  },
];

const TOTAL_VALUE = "$1,400+";

const CATEGORY_COLORS = {
  banking:    { color: "#5A8AE8", bg: "rgba(90,138,232,0.08)"  },
  payroll:    { color: "#E87B5A", bg: "rgba(232,123,90,0.08)"  },
  operations: { color: "#C9A84C", bg: "rgba(201,168,76,0.10)"  },
  legal:      { color: "#8A7CB0", bg: "rgba(138,124,176,0.10)" },
};

/* ─── Apple-style Tool Card ──────────────────────────────────────── */
function ToolCard({ tool, onCopy, copiedId }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORY_COLORS[tool.category] || { color: C.inkLight, bg: C.creamDeep };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: 16,
        border: `1px solid ${hovered ? C.goldBorder : C.creamDeep}`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(201,168,76,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row: logo + category pill */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: tool.logoBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: tool.logoColor,
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}>
          {tool.logo}
        </div>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
          color: cat.color, background: cat.bg,
          padding: "3px 9px", borderRadius: 20, textTransform: "uppercase",
        }}>
          {tool.category}
        </span>
      </div>

      {/* Name + tagline */}
      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
          {tool.name}
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: C.inkLight, lineHeight: 1.5 }}>
          {tool.tagline}
        </p>
      </div>

      {/* Highlights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        {tool.highlights.map((h) => (
          <div key={h} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <CheckCircle2 size={11} color={C.gold} strokeWidth={2} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.inkMid }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Perk badge */}
      <div style={{
        padding: "8px 12px", borderRadius: 10,
        background: C.goldLight, border: `1px solid ${C.goldBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Gift size={11} color={C.gold} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#9A7A2A" }}>
            {tool.perk}
          </span>
        </div>
        <span style={{ fontSize: 10, color: C.inkLight }}>{tool.perkNote}</span>
      </div>

      {/* CTA row */}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 10,
          background: hovered
            ? `linear-gradient(135deg, ${C.gold}, #E8C96A)`
            : C.goldLight,
          border: `1px solid ${C.goldBorder}`,
          color: hovered ? C.obsidian : "#7A5E1A",
          fontSize: 12, fontWeight: 600,
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "all 0.2s ease",
          letterSpacing: "0.01em",
          boxShadow: hovered ? "0 2px 10px rgba(201,168,76,0.3)" : "none",
        }}>
          {tool.cta}
          <ExternalLink size={11} strokeWidth={2} />
        </button>

        <button
          onClick={() => onCopy(tool.id)}
          title="Copy referral link"
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            border: `1px solid ${C.creamDeep}`,
            background: copiedId === tool.id ? C.successLight : "transparent",
            color: copiedId === tool.id ? C.success : C.inkLight,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          {copiedId === tool.id ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────── */
export default function FounderPerks() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    setCopiedId(id);
    try { navigator.clipboard.writeText(`https://empirelogic.co/perks/${id}`); } catch (_) {}
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = TOOLS.filter((t) => activeCategory === "all" || t.category === activeCategory);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: C.obsidian, padding: "28px 36px 0", borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 24 }}>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, color: C.gold, letterSpacing: "0.14em", fontWeight: 600 }}>
              EMPIRE LOGIC
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 30, fontWeight: 500, color: C.white,
              margin: "0 0 6px", lineHeight: 1.15,
            }}>
              Founder Perks
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#5A5A5A" }}>
              The Empire Tech Stack — exclusive benefits for members.
            </p>
          </div>

          {/* Value badge */}
          <div style={{
            padding: "16px 22px", borderRadius: 14,
            background: "rgba(201,168,76,0.08)",
            border: `1px solid ${C.goldBorder}`,
            textAlign: "right",
          }}>
            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#9A7A2A", letterSpacing: "0.1em", fontWeight: 700 }}>
              TOTAL MEMBER VALUE
            </p>
            <p style={{ margin: "0 0 1px", fontSize: 28, fontWeight: 700, color: C.gold, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
              {TOTAL_VALUE}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "#6A5A2A" }}>in perks unlocked</p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const active = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "13px 20px",
                  background: "transparent", border: "none",
                  borderBottom: active ? `2px solid ${C.gold}` : "2px solid transparent",
                  color: active ? C.gold : "#555",
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                  letterSpacing: "0.02em", whiteSpace: "nowrap",
                }}
              >
                <Icon size={12} strokeWidth={1.5} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3-Column Grid ── */}
      <main style={{ flex: 1, padding: "32px 36px 48px", overflowY: "auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          animation: "fadeIn 0.3s ease",
        }}>
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onCopy={handleCopy} copiedId={copiedId} />
          ))}
        </div>

        {/* Bottom strip */}
        <div style={{
          marginTop: 40, padding: "20px 28px", borderRadius: 14,
          background: C.obsidian, border: `1px solid ${C.goldBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.goldLight, border: `1px solid ${C.goldBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Star size={15} color={C.gold} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: C.white, fontWeight: 500 }}>
                Empire members save over {TOTAL_VALUE} in their first year.
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#4A4A4A" }}>
                Every tool has been vetted by the Empire Logic team.
              </p>
            </div>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            background: C.goldLight, border: `1px solid ${C.goldBorder}`,
            color: C.gold, fontSize: 12, fontWeight: 600,
            letterSpacing: "0.03em", cursor: "pointer",
          }}>
            <Gift size={12} color={C.gold} />
            Share Perks
            <ChevronRight size={11} color={C.gold} />
          </button>
        </div>
      </main>
    </div>
  );
}
