import { useState } from "react";
import {
  ExternalLink,
  Star,
  Gift,
  Shield,
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
  TrendingUp,
} from "lucide-react";

/* ─── Design Tokens ──────────────────────────────────────────────── */
const C = {
  obsidian:     "#0A0A0A",
  obsidianMid:  "#141414",
  obsidianSurf: "#1C1C1C",
  obsidianCard: "#111111",
  gold:         "#C9A84C",
  goldLight:    "rgba(201,168,76,0.12)",
  goldBorder:   "rgba(201,168,76,0.28)",
  goldGlow:     "0 0 0 2px rgba(201,168,76,0.15), 0 0 16px rgba(201,168,76,0.20)",
  cream:        "#F9F8F3",
  creamDeep:    "#EAE6DC",
  ink:          "#1A1A1A",
  inkMid:       "#4A4A4A",
  inkLight:     "#8A8A8A",
  white:        "#FFFFFF",
  success:      "#4A7C59",
  successLight: "rgba(74,124,89,0.12)",
};

/* ─── Category Config ────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all",        label: "All Tools",   icon: Sparkles  },
  { id: "banking",    label: "Banking",     icon: Building2 },
  { id: "payroll",    label: "Payroll",     icon: Users     },
  { id: "operations", label: "Operations",  icon: Settings  },
  { id: "legal",      label: "Legal",       icon: Scale     },
];

/* ─── Empire Tech Stack ──────────────────────────────────────────── */
const TOOLS = [
  /* ── Banking ── */
  {
    id:       "mercury",
    category: "banking",
    featured: true,         // Dark hero card treatment
    name:     "Mercury Bank",
    tagline:  "The bank for founders who value speed.",
    description:
      "Mercury is built for startups and scaling businesses. FDIC-insured, no monthly fees, wire transfers in minutes, and a dashboard your CFO will actually enjoy. The empire needs a bank that moves as fast as you do.",
    perk:     "$250 Bonus",
    perkNote: "on account open + first $10k deposit",
    cta:      "Secure Your Account",
    logo:     "M",
    logoColor:"#7C9AFF",
    logoBg:   "rgba(124,154,255,0.15)",
    highlights: ["No fees, ever", "FDIC insured to $5M", "Virtual & physical cards", "API access"],
  },
  {
    id:       "relay",
    category: "banking",
    featured: false,
    name:     "Relay Bank",
    tagline:  "20 accounts, 50 cards, zero fees.",
    description:
      "Built for founders who run the Profit First method or want to separate revenue streams. Open up to 20 checking accounts and 50 debit cards — all from one dashboard.",
    perk:     "$50 Bonus",
    perkNote: "after first qualifying deposit",
    cta:      "Open Free Account",
    logo:     "R",
    logoColor:"#6AC4A4",
    logoBg:   "rgba(106,196,164,0.15)",
    highlights: ["Up to 20 checking accts", "Profit First–friendly", "Team access controls", "Free wires"],
  },

  /* ── Payroll ── */
  {
    id:       "gusto",
    category: "payroll",
    featured: false,
    name:     "Gusto Payroll",
    tagline:  "Automate your team and stay compliant.",
    description:
      "Gusto handles payroll, benefits, and compliance automatically. W-2s, 1099s, state filings — all done for you. Your team gets paid on time, every time, while you build the empire.",
    perk:     "$100 Gift Card",
    perkNote: "after first payroll run",
    cta:      "View Member Benefit",
    logo:     "G",
    logoColor:"#E87B5A",
    logoBg:   "rgba(232,123,90,0.15)",
    highlights: ["Auto tax filing", "Benefits admin", "1099 contractor support", "HR tools included"],
  },
  {
    id:       "deel",
    category: "payroll",
    featured: false,
    name:     "Deel",
    tagline:  "Pay your global team without the headache.",
    description:
      "Hire, onboard, and pay contractors or full-time employees in 150+ countries. Deel handles compliance, contracts, and local tax laws — so you can build a world-class team from anywhere.",
    perk:     "$50 Credit",
    perkNote: "toward your first month",
    cta:      "Start Free Trial",
    logo:     "D",
    logoColor:"#8A6AE8",
    logoBg:   "rgba(138,106,232,0.15)",
    highlights: ["150+ countries", "Instant contractor pay", "Compliant contracts", "Equipment provisioning"],
  },

  /* ── Operations ── */
  {
    id:       "ramp",
    category: "operations",
    featured: false,
    name:     "Ramp Credit",
    tagline:  "The corporate card with 1.5% cashback on every empire expense.",
    description:
      "Ramp isn't just a credit card — it's a spend management platform. Get 1.5% cashback on everything, real-time expense tracking, automatic receipt matching, and AI-powered insights on where your money is going.",
    perk:     "$500 Cashback",
    perkNote: "in the first 3 months on qualifying spend",
    cta:      "Apply for Ramp",
    logo:     "RP",
    logoColor:"#F0C050",
    logoBg:   "rgba(240,192,80,0.15)",
    highlights: ["1.5% cashback", "No personal guarantee", "Auto receipt capture", "Spend analytics"],
  },
  {
    id:       "notion",
    category: "operations",
    featured: false,
    name:     "Notion",
    tagline:  "Your empire's second brain.",
    description:
      "SOPs, wikis, project trackers, CRMs, content calendars — all in one workspace. Notion replaces 5 tools with one. Build your business operating system here.",
    perk:     "6 Months Free",
    perkNote: "Notion Plus via startup program",
    cta:      "Claim Free Plan",
    logo:     "N",
    logoColor:"#1A1A1A",
    logoBg:   "rgba(26,26,26,0.08)",
    highlights: ["Unlimited pages", "AI writing assistant", "Databases & views", "Team collaboration"],
  },
  {
    id:       "loom",
    category: "operations",
    featured: false,
    name:     "Loom",
    tagline:  "Record once. Communicate forever.",
    description:
      "Replace meetings with Looms. Record your screen + camera in seconds, share the link, and get back 10 hours a week. Essential for remote teams and async operations.",
    perk:     "3 Months Free Pro",
    perkNote: "on new Business account",
    cta:      "Try Loom Free",
    logo:     "L",
    logoColor:"#7C5CDB",
    logoBg:   "rgba(124,92,219,0.15)",
    highlights: ["Unlimited recording", "AI transcription", "Viewer insights", "CTA buttons in videos"],
  },

  /* ── Legal ── */
  {
    id:       "stripe-atlas",
    category: "legal",
    featured: false,
    name:     "Stripe Atlas",
    tagline:  "Incorporate your empire in 10 minutes.",
    description:
      "Form a Delaware C-Corp or LLC, open a business bank account, and get your EIN — all in one flow. Stripe Atlas is the fastest path from idea to legit business entity.",
    perk:     "$100 Off",
    perkNote: "Atlas incorporation fee",
    cta:      "Form Your Company",
    logo:     "SA",
    logoColor:"#6772E5",
    logoBg:   "rgba(103,114,229,0.15)",
    highlights: ["Delaware C-Corp or LLC", "EIN + bank account", "Stripe integration", "409A valuation discounts"],
  },
  {
    id:       "bonsai",
    category: "legal",
    featured: false,
    name:     "Bonsai",
    tagline:  "Contracts, proposals & invoices — all automated.",
    description:
      "Bonsai handles your client-facing paperwork so you look polished and get paid faster. Attorney-approved contract templates, e-signatures, automated invoicing, and project tracking built in.",
    perk:     "25% Off First Year",
    perkNote: "on any paid plan",
    cta:      "Start Free Trial",
    logo:     "B",
    logoColor:"#3AA87C",
    logoBg:   "rgba(58,168,124,0.15)",
    highlights: ["Attorney-approved templates", "e-Signature built in", "Automated invoicing", "Time tracking"],
  },
];

/* Total perk value display */
const TOTAL_VALUE = "$1,400+";

/* ─── Sub-components ─────────────────────────────────────────────── */

/* ── Featured Hero Card (Mercury-style dark card) ── */
function FeaturedCard({ tool, onCopy, copiedId }) {
  return (
    <div style={{
      gridColumn: "1 / -1",
      background: C.obsidianCard,
      borderRadius: 16,
      border: `1px solid ${C.goldBorder}`,
      boxShadow: C.goldGlow,
      padding: "28px 32px",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "24px 40px",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle gold gradient wash top-right */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 300, height: 200,
        background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* LEFT: Info */}
      <div style={{ position: "relative" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          {/* Logo circle */}
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: tool.logoBg, border: `1px solid ${tool.logoColor}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: tool.logoColor, letterSpacing: "0.02em",
          }}>
            {tool.logo}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.white }}>{tool.name}</h3>
              <CategoryPill category={tool.category} />
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#6A6A6A", marginTop: 2 }}>{tool.tagline}</p>
          </div>

          {/* Member perk badge — featured gets gold star treatment */}
          <div style={{ marginLeft: "auto" }}>
            <PerkBadge perk={tool.perk} perkNote={tool.perkNote} dark />
          </div>
        </div>

        {/* Description */}
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8A8A8A", lineHeight: 1.7, maxWidth: 560 }}>
          {tool.description}
        </p>

        {/* Highlights row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          {tool.highlights.map((h) => (
            <div key={h} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 20,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 11, color: "#9A9A9A",
            }}>
              <CheckCircle2 size={10} color={C.gold} strokeWidth={2} />
              {h}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 24px", borderRadius: 10,
            background: `linear-gradient(135deg, ${C.gold} 0%, #E8C96A 50%, ${C.gold} 100%)`,
            border: "none", color: C.obsidian,
            fontSize: 13, fontWeight: 700, letterSpacing: "0.03em",
            cursor: "pointer",
            boxShadow: "0 2px 16px rgba(201,168,76,0.35)",
          }}>
            {tool.cta}
            <ExternalLink size={13} strokeWidth={2} />
          </button>

          <button
            onClick={() => onCopy(tool.id, tool.perk)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 14px", borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: copiedId === tool.id ? C.success : "#6A6A6A",
              fontSize: 12, cursor: "pointer",
            }}
          >
            {copiedId === tool.id ? <Check size={12} /> : <Copy size={12} />}
            {copiedId === tool.id ? "Copied!" : "Copy perk link"}
          </button>
        </div>
      </div>

      {/* RIGHT: Decorative stat block */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end",
        paddingLeft: 32, borderLeft: `1px solid rgba(255,255,255,0.06)`,
      }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.gold, lineHeight: 1 }}>$250</p>
          <p style={{ margin: "3px 0 0", fontSize: 10, color: "#555", letterSpacing: "0.06em" }}>MEMBER BONUS</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.white }}>$0</p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#555", letterSpacing: "0.06em" }}>MONTHLY FEES</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: C.white }}>$5M</p>
          <p style={{ margin: "2px 0 0", fontSize: 10, color: "#555", letterSpacing: "0.06em" }}>FDIC COVERAGE</p>
        </div>
      </div>
    </div>
  );
}

/* ── Standard Tool Card ── */
function ToolCard({ tool, onCopy, copiedId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white,
        borderRadius: 14,
        border: `1px solid ${hovered ? C.goldBorder : C.creamDeep}`,
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 4px 20px rgba(201,168,76,0.10)" : "none",
        cursor: "default",
      }}
    >
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: tool.logoBg,
            border: `1px solid ${tool.logoColor}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: tool.logoColor, letterSpacing: "0.02em",
          }}>
            {tool.logo}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.ink }}>{tool.name}</h3>
            <CategoryPill category={tool.category} />
          </div>
        </div>
        <PerkBadge perk={tool.perk} perkNote={tool.perkNote} />
      </div>

      {/* Tagline */}
      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: C.inkMid, lineHeight: 1.4 }}>
        "{tool.tagline}"
      </p>

      {/* Description */}
      <p style={{ margin: 0, fontSize: 12, color: C.inkLight, lineHeight: 1.65, flex: 1 }}>
        {tool.description}
      </p>

      {/* Highlights */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {tool.highlights.slice(0, 3).map((h) => (
          <div key={h} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <CheckCircle2 size={11} color={C.gold} strokeWidth={2} />
            <span style={{ fontSize: 11, color: C.inkMid }}>{h}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: C.creamDeep }} />

      {/* CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "10px",
          borderRadius: 8,
          background: hovered
            ? `linear-gradient(135deg, ${C.gold} 0%, #E8C96A 50%, ${C.gold} 100%)`
            : C.goldLight,
          border: `1px solid ${C.goldBorder}`,
          color: hovered ? C.obsidian : "#7A5E1A",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
          boxShadow: hovered ? "0 2px 10px rgba(201,168,76,0.25)" : "none",
        }}>
          {tool.cta}
          <ExternalLink size={11} strokeWidth={2} />
        </button>

        <button
          onClick={() => onCopy(tool.id, tool.perk)}
          style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            border: `1px solid ${C.creamDeep}`,
            background: copiedId === tool.id ? C.successLight : "transparent",
            color: copiedId === tool.id ? C.success : C.inkLight,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
          title="Copy referral link"
        >
          {copiedId === tool.id ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

/* ── Perk Badge ── */
function PerkBadge({ perk, perkNote, dark = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 20,
        background: C.goldLight,
        border: `1px solid ${C.goldBorder}`,
      }}>
        <Gift size={10} color={C.gold} strokeWidth={2} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#9A7A2A", letterSpacing: "0.04em" }}>
          MEMBER PERK: {perk}
        </span>
      </div>
      {perkNote && (
        <span style={{ fontSize: 9, color: dark ? "#555" : C.inkLight, letterSpacing: "0.02em" }}>
          {perkNote}
        </span>
      )}
    </div>
  );
}

/* ── Category Pill ── */
const CATEGORY_STYLES = {
  banking:    { color: "#5A8AE8", bg: "rgba(90,138,232,0.10)"  },
  payroll:    { color: "#E87B5A", bg: "rgba(232,123,90,0.10)"  },
  operations: { color: "#C9A84C", bg: "rgba(201,168,76,0.12)"  },
  legal:      { color: "#8A7CB0", bg: "rgba(138,124,176,0.12)" },
};

function CategoryPill({ category }) {
  const s = CATEGORY_STYLES[category] || { color: C.inkLight, bg: C.creamDeep };
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
      color: s.color, background: s.bg,
      padding: "2px 7px", borderRadius: 8, textTransform: "uppercase",
      marginTop: 2, display: "inline-block",
    }}>
      {category}
    </span>
  );
}

/* ─── Root Component ─────────────────────────────────────────────── */
export default function FounderPerks() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId,       setCopiedId]       = useState(null);

  const handleCopy = (id, perk) => {
    setCopiedId(id);
    try { navigator.clipboard.writeText(`https://empirelogic.co/perks/${id}`); } catch (_) {}
    setTimeout(() => setCopiedId(null), 2000);
  };

  const featured = TOOLS.filter((t) => t.featured);
  const standard = TOOLS.filter((t) => !t.featured && (activeCategory === "all" || t.category === activeCategory));
  const allFiltered = TOOLS.filter((t) => activeCategory === "all" || t.category === activeCategory);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{
        background: C.obsidian,
        padding: "28px 36px 0",
        borderBottom: `1px solid rgba(201,168,76,0.2)`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 24, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, color: C.gold, letterSpacing: "0.12em" }}>
              EMPIRE LOGIC
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 30, fontWeight: 500, color: C.white,
              margin: "0 0 6px", lineHeight: 1.15,
            }}>
              Founder Perks
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#6A6A6A" }}>
              The Empire Tech Stack — curated tools with exclusive member benefits.
            </p>
          </div>

          {/* Total value badge */}
          <div style={{
            padding: "14px 20px", borderRadius: 12,
            background: C.goldLight, border: `1px solid ${C.goldBorder}`,
            textAlign: "right",
          }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, color: "#9A7A2A", letterSpacing: "0.08em", fontWeight: 600 }}>
              TOTAL MEMBER VALUE
            </p>
            <p style={{ margin: "0 0 2px", fontSize: 26, fontWeight: 700, color: C.gold, lineHeight: 1 }}>
              {TOTAL_VALUE}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "#9A7A2A" }}>
              in exclusive perks unlocked
            </p>
          </div>
        </div>

        {/* Category filter bar */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingTop: 0 }}>
          {CATEGORIES.map(({ id, label, icon: Icon }) => {
            const active = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "14px 18px",
                  background: "transparent", border: "none",
                  borderBottom: active ? `2px solid ${C.gold}` : "2px solid transparent",
                  color: active ? C.gold : "#555",
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                  letterSpacing: "0.02em", whiteSpace: "nowrap",
                }}
              >
                <Icon size={13} strokeWidth={1.5} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Card Grid ── */}
      <main style={{ flex: 1, padding: "28px 36px 48px", overflowY: "auto" }}>

        {/* Featured card — only shown in "all" or "banking" */}
        {(activeCategory === "all" || activeCategory === "banking") &&
          featured.map((tool) => (
            <div key={tool.id} style={{ marginBottom: 24, animation: "fadeIn 0.3s ease" }}>
              <FeaturedCard tool={tool} onCopy={handleCopy} copiedId={copiedId} />
            </div>
          ))
        }

        {/* Category section headers + standard cards */}
        {activeCategory === "all" ? (
          /* When viewing "All" — group by category with section labels */
          ["banking", "payroll", "operations", "legal"].map((cat) => {
            const catTools = TOOLS.filter((t) => !t.featured && t.category === cat);
            if (catTools.length === 0) return null;
            const catMeta = CATEGORIES.find((c) => c.id === cat);
            const CatIcon = catMeta?.icon;
            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  {CatIcon && <CatIcon size={14} color={C.gold} strokeWidth={1.5} />}
                  <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.inkMid, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {catMeta?.label}
                  </h2>
                  <div style={{ flex: 1, height: 1, background: C.creamDeep, marginLeft: 8 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                  {catTools.map((tool) => (
                    <div key={tool.id} style={{ animation: "fadeIn 0.3s ease" }}>
                      <ToolCard tool={tool} onCopy={handleCopy} copiedId={copiedId} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          /* Filtered by category — flat grid */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {standard.map((tool) => (
              <div key={tool.id} style={{ animation: "fadeIn 0.3s ease" }}>
                <ToolCard tool={tool} onCopy={handleCopy} copiedId={copiedId} />
              </div>
            ))}
          </div>
        )}

        {/* Bottom value strip */}
        <div style={{
          marginTop: 40, padding: "20px 28px", borderRadius: 14,
          background: C.obsidian, border: `1px solid ${C.goldBorder}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.goldLight, border: `1px solid ${C.goldBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Star size={16} color={C.gold} strokeWidth={1.5} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: C.white, fontWeight: 500 }}>
                Empire members save over {TOTAL_VALUE} in their first year.
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#555" }}>
                Every tool in the stack has been vetted and used by the Empire Logic team.
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
            <Gift size={13} color={C.gold} />
            Share the Perks
            <ChevronRight size={12} color={C.gold} />
          </button>
        </div>
      </main>
    </div>
  );
}
