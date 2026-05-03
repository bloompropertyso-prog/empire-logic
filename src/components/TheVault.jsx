import { useState, useRef } from "react";
import {
  Shield,
  Upload,
  CheckCircle2,
  Circle,
  Star,
  FileText,
  Image,
  Landmark,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Lock,
  AlertCircle,
  Eye,
  Users,
  BookOpen,
  Layers,
} from "lucide-react";

/* ─── Design Tokens ──────────────────────────────────────────────── */
const C = {
  obsidian:     "#0A0A0A",
  obsidianSurf: "#1C1C1C",
  gold:         "#C9A84C",
  goldLight:    "rgba(201,168,76,0.12)",
  goldBorder:   "rgba(201,168,76,0.28)",
  goldGlow:     "0 0 0 3px rgba(201,168,76,0.15), 0 0 20px rgba(201,168,76,0.20)",
  cream:        "#F9F8F3",
  creamDeep:    "#EAE6DC",
  ink:          "#1A1A1A",
  inkMid:       "#4A4A4A",
  inkLight:     "#8A8A8A",
  white:        "#FFFFFF",
  success:      "#4A7C59",
  successLight: "rgba(74,124,89,0.12)",
  rose:         "rgba(160,90,90,0.10)",
  roseText:     "#A05A5A",
  lavender:     "rgba(100,90,180,0.08)",
  lavText:      "#6A60A0",
};

/* ─── Vault Categories & Documents ──────────────────────────────── */
const INITIAL_CATEGORIES = [
  {
    id:      "identity",
    label:   "Identity",
    icon:    Star,
    color:   "#C9A84C",
    colorBg: "rgba(201,168,76,0.12)",
    desc:    "Your brand's foundation — mission, voice, and positioning.",
    docs: [
      { id: "i1", label: "Mission Statement",         done: true,  size: "24 KB",  date: "Apr 12" },
      { id: "i2", label: "Brand Voice Guide",         done: true,  size: "156 KB", date: "Apr 18" },
      { id: "i3", label: "Brand Kit (Colors & Fonts)",done: true,  size: "8.2 MB", date: "Mar 30" },
      { id: "i4", label: "Founder Story",             done: false, size: null,     date: null     },
    ],
  },
  {
    id:      "legal",
    label:   "Legal",
    icon:    Landmark,
    color:   "#7C9AFF",
    colorBg: "rgba(124,154,255,0.12)",
    desc:    "Entity documents, agreements, and registrations.",
    docs: [
      { id: "l1", label: "LLC Operating Agreement",  done: true,  size: "142 KB", date: "Jan 08" },
      { id: "l2", label: "EIN Confirmation Letter",  done: true,  size: "38 KB",  date: "Jan 08" },
      { id: "l3", label: "Business License",         done: false, size: null,     date: null     },
      { id: "l4", label: "Trademark Registration",   done: false, size: null,     date: null     },
    ],
  },
  {
    id:      "financial",
    label:   "Financial",
    icon:    Briefcase,
    color:   "#6AC4A4",
    colorBg: "rgba(106,196,164,0.12)",
    desc:    "Statements, projections, and tax records for funding.",
    docs: [
      { id: "f1", label: "Bank Statements — Q1 2026", done: true,  size: "312 KB", date: "Apr 01" },
      { id: "f2", label: "P&L Statement — Q1 2026",   done: true,  size: "88 KB",  date: "Apr 05" },
      { id: "f3", label: "Revenue Projections 2026",   done: false, size: null,     date: null     },
      { id: "f4", label: "Tax Returns 2025",            done: false, size: null,     date: null     },
    ],
  },
  {
    id:      "assets",
    label:   "Assets",
    icon:    Image,
    color:   "#C47CA4",
    colorBg: "rgba(196,124,164,0.12)",
    desc:    "Visual collateral — logo, photos, and media materials.",
    docs: [
      { id: "a1", label: "Logo Files (SVG + PNG)",    done: true,  size: "4.8 MB", date: "Feb 14" },
      { id: "a2", label: "Professional Headshots",    done: true,  size: "22 MB",  date: "Mar 02" },
      { id: "a3", label: "Brand Photography",         done: false, size: null,     date: null     },
      { id: "a4", label: "Media Kit PDF",             done: false, size: null,     date: null     },
    ],
  },
];

/* ─── Client Success Folders ─────────────────────────────────────── */
const CLIENT_SUCCESS_FOLDERS = [
  {
    id: "rosters",
    label: "Active Rosters",
    icon: Users,
    color: "#7C9AFF",
    colorBg: "rgba(124,154,255,0.10)",
    desc: "Current client roster, contact details, and program assignments.",
    docs: [
      { id: "cr1", label: "Client Roster Q2 2026",        done: true,  size: "48 KB",  date: "May 01" },
      { id: "cr2", label: "VIP Client Directory",          done: true,  size: "32 KB",  date: "Apr 28" },
      { id: "cr3", label: "Client Progress Tracker",       done: false, size: null,     date: null     },
      { id: "cr4", label: "Renewal & Retention Log",       done: false, size: null,     date: null     },
    ],
  },
  {
    id: "onboarding",
    label: "Onboarding Flows",
    icon: Layers,
    color: "#6AC4A4",
    colorBg: "rgba(106,196,164,0.10)",
    desc: "Welcome sequences, intake forms, and onboarding SOPs.",
    docs: [
      { id: "ob1", label: "Client Welcome Packet",         done: true,  size: "1.2 MB", date: "Mar 15" },
      { id: "ob2", label: "Intake Questionnaire",          done: true,  size: "64 KB",  date: "Mar 15" },
      { id: "ob3", label: "Onboarding SOP",                done: false, size: null,     date: null     },
      { id: "ob4", label: "First 30-Day Roadmap Template", done: false, size: null,     date: null     },
    ],
  },
  {
    id: "curriculum",
    label: "Program Curriculum",
    icon: BookOpen,
    color: "#C47CA4",
    colorBg: "rgba(196,124,164,0.10)",
    desc: "Coaching frameworks, session guides, and program materials.",
    docs: [
      { id: "cu1", label: "Empire Logic Framework PDF",    done: true,  size: "3.4 MB", date: "Feb 20" },
      { id: "cu2", label: "90-Day Roadmap Template",       done: true,  size: "280 KB", date: "Mar 01" },
      { id: "cu3", label: "Session Slide Decks",           done: false, size: null,     date: null     },
      { id: "cu4", label: "Homework & Workbooks",          done: false, size: null,     date: null     },
    ],
  },
];

const READINESS_THRESHOLD = 75; // % needed to show "Funding Ready"

/* ─── Helpers ────────────────────────────────────────────────────── */
const readiness = (docs) => Math.round((docs.filter((d) => d.done).length / docs.length) * 100);
const overallReadiness = (cats) => Math.round(cats.reduce((s, c) => s + readiness(c.docs), 0) / cats.length);

/* ─── Sub-components ─────────────────────────────────────────────── */

function ReadinessBar({ pct, color }) {
  const barColor =
    pct >= 75 ? C.success :
    pct >= 50 ? C.gold    : C.roseText;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: C.inkLight, letterSpacing: "0.06em", fontWeight: 600 }}>
          PROFESSIONAL READINESS
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: barColor }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 5, background: C.creamDeep, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 5,
          background: pct >= 75
            ? `linear-gradient(90deg, ${C.success}, #6AB07A)`
            : pct >= 50
            ? `linear-gradient(90deg, ${C.gold}, #E8C96A)`
            : `linear-gradient(90deg, #C07070, #D08080)`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}

function VaultStatusBadge({ pct }) {
  const ready = pct >= READINESS_THRESHOLD;
  const partial = pct >= 50;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
      borderRadius: 20,
      background: ready ? C.successLight : partial ? C.goldLight : C.rose,
      border: `1px solid ${ready ? "rgba(74,124,89,0.3)" : partial ? C.goldBorder : "rgba(160,90,90,0.25)"}`,
    }}>
      {ready
        ? <Shield size={13} color={C.success} />
        : <AlertCircle size={13} color={partial ? C.gold : C.roseText} />
      }
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: ready ? C.success : partial ? "#9A7A2A" : C.roseText,
      }}>
        {ready ? "Funding Ready" : partial ? "In Progress" : "Building"}
      </span>
      <span style={{
        fontSize: 11,
        color: ready ? C.success : partial ? "#9A7A2A" : C.roseText,
        opacity: 0.75,
      }}>
        · {pct}% complete
      </span>
      {ready && (
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, animation: "blink 2s infinite" }} />
      )}
    </div>
  );
}

function CategoryCard({ cat, onToggleDoc, onAddDoc }) {
  const [expanded, setExpanded] = useState(true);
  const pct   = readiness(cat.docs);
  const Icon  = cat.icon;
  const done  = cat.docs.filter((d) => d.done).length;

  return (
    <div style={{
      background: C.white, borderRadius: 16,
      border: `1px solid ${C.creamDeep}`,
      overflow: "hidden",
      transition: "box-shadow 0.2s ease",
    }}>
      {/* Card header */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          padding: "20px 22px 16px",
          cursor: "pointer",
          borderBottom: expanded ? `1px solid ${C.creamDeep}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: cat.colorBg,
              border: `1px solid ${cat.color}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={16} color={cat.color} strokeWidth={1.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: C.ink }}>{cat.label}</h3>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.inkLight }}>{done} of {cat.docs.length} documents</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {pct >= 75 && (
              <span style={{
                fontSize: 9, fontWeight: 700, color: C.success,
                background: C.successLight, padding: "3px 8px", borderRadius: 10,
                letterSpacing: "0.06em",
              }}>
                ✓ READY
              </span>
            )}
            {expanded
              ? <ChevronUp size={14} color={C.inkLight} />
              : <ChevronDown size={14} color={C.inkLight} />
            }
          </div>
        </div>
        <ReadinessBar pct={pct} color={cat.color} />
      </div>

      {/* Document list */}
      {expanded && (
        <div style={{ padding: "12px 22px 16px" }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, color: C.inkLight, lineHeight: 1.5 }}>
            {cat.desc}
          </p>
          {cat.docs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onToggleDoc(cat.id, doc.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8, cursor: "pointer",
                marginBottom: 4,
                background: doc.done ? "rgba(74,124,89,0.04)" : "transparent",
                border: `1px solid ${doc.done ? "rgba(74,124,89,0.12)" : C.creamDeep}`,
                transition: "all 0.15s ease",
              }}
            >
              {doc.done
                ? <CheckCircle2 size={14} color={C.success} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                : <Circle       size={14} color="#CCCCCC"   strokeWidth={1.5} style={{ flexShrink: 0 }} />
              }
              <span style={{
                flex: 1, fontSize: 12, lineHeight: 1.3,
                color: doc.done ? C.inkMid : C.inkLight,
                fontWeight: doc.done ? 500 : 400,
              }}>
                {doc.label}
              </span>
              {doc.done ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: C.inkLight }}>{doc.size}</span>
                  <span style={{ fontSize: 10, color: C.inkLight }}>·</span>
                  <span style={{ fontSize: 10, color: C.inkLight }}>{doc.date}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    style={{
                      width: 22, height: 22, borderRadius: 5, border: `1px solid ${C.creamDeep}`,
                      background: "transparent", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Eye size={10} color={C.inkLight} />
                  </button>
                </div>
              ) : (
                <span style={{
                  fontSize: 10, color: C.roseText, background: C.rose,
                  padding: "2px 7px", borderRadius: 8, fontWeight: 600,
                  letterSpacing: "0.04em",
                }}>
                  Missing
                </span>
              )}
            </div>
          ))}
          {/* Add document button */}
          <button
            onClick={() => onAddDoc(cat.id)}
            style={{
              width: "100%", marginTop: 8, padding: "8px",
              borderRadius: 8, border: `1px dashed ${C.goldBorder}`,
              background: "transparent", color: C.gold,
              fontSize: 11, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              letterSpacing: "0.03em",
            }}
          >
            <Plus size={12} color={C.gold} />
            Add Document
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Drop Zone ── */
function DropZone({ activeCategory, onFileAccepted }) {
  const [dragging,   setDragging]   = useState(false);
  const [uploaded,   setUploaded]   = useState([]);
  const [justDropped,setJustDropped]= useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer?.files || []);
    if (!files.length) return;
    processFiles(files);
  };

  const processFiles = (files) => {
    const newUploads = files.map((f) => ({
      name: f.name,
      size: f.size < 1024 * 1024
        ? `${Math.round(f.size / 1024)} KB`
        : `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    }));
    setUploaded((prev) => [...newUploads, ...prev].slice(0, 5));
    setJustDropped(true);
    setTimeout(() => setJustDropped(false), 2000);
    if (onFileAccepted) onFileAccepted(newUploads, activeCategory);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? C.gold : justDropped ? C.success : C.goldBorder}`,
          borderRadius: 16,
          padding: "44px 32px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging
            ? "rgba(201,168,76,0.06)"
            : justDropped
            ? "rgba(74,124,89,0.05)"
            : "transparent",
          boxShadow: dragging ? C.goldGlow : "none",
          transition: "all 0.25s ease",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => processFiles(Array.from(e.target.files || []))}
        />

        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, margin: "0 auto 18px",
          background: justDropped ? C.successLight : C.goldLight,
          border: `1px solid ${justDropped ? "rgba(74,124,89,0.3)" : C.goldBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.25s ease",
        }}>
          {justDropped
            ? <CheckCircle2 size={22} color={C.success} strokeWidth={1.5} />
            : <Upload       size={22} color={C.gold}    strokeWidth={1.5} />
          }
        </div>

        {/* Serif headline */}
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 20, fontWeight: 500,
          color: justDropped ? C.success : dragging ? C.gold : C.ink,
          margin: "0 0 8px",
          transition: "color 0.25s ease",
        }}>
          {justDropped
            ? "Secured."
            : dragging
            ? "Release to secure."
            : "Secure your legacy here."
          }
        </h2>

        <p style={{ margin: "0 0 20px", fontSize: 13, color: C.inkLight, lineHeight: 1.55 }}>
          {justDropped
            ? "Your file has been added to the Vault."
            : "Drop any file — PDFs, images, contracts, spreadsheets, or recordings."
          }
        </p>

        {/* Category target badge */}
        {activeCategory && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 20,
            background: C.goldLight, border: `1px solid ${C.goldBorder}`,
            fontSize: 11, color: "#9A7A2A", fontWeight: 500,
            marginBottom: 16,
          }}>
            <Lock size={10} color={C.gold} />
            Uploading to: {activeCategory}
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          style={{
            padding: "9px 24px", borderRadius: 9,
            background: "transparent",
            border: `1px solid ${C.goldBorder}`,
            color: C.gold, fontSize: 12, fontWeight: 600,
            cursor: "pointer", letterSpacing: "0.04em",
          }}
        >
          Browse Files
        </button>
      </div>

      {/* Recent uploads */}
      {uploaded.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ margin: "0 0 8px", fontSize: 10, color: C.inkLight, letterSpacing: "0.08em", fontWeight: 600 }}>
            RECENTLY ADDED
          </p>
          {uploaded.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 12px", borderRadius: 8, marginBottom: 4,
              background: C.white, border: `1px solid ${C.creamDeep}`,
              animation: "slideIn 0.2s ease",
            }}>
              <FileText size={12} color={C.gold} />
              <span style={{ flex: 1, fontSize: 12, color: C.ink }}>{f.name}</span>
              <span style={{ fontSize: 11, color: C.inkLight }}>{f.size}</span>
              <span style={{ fontSize: 10, color: C.success, background: C.successLight, padding: "1px 7px", borderRadius: 8 }}>
                Secured
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Root Component ─────────────────────────────────────────────── */
export default function TheVault() {
  const [categories,    setCategories]    = useState(INITIAL_CATEGORIES);
  const [activeCategory,setActiveCategory]= useState(null);

  const overall = overallReadiness(categories);

  const toggleDoc = (catId, docId) => {
    setCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : {
        ...c,
        docs: c.docs.map((d) => d.id === docId ? { ...d, done: !d.done } : d),
      }
    ));
  };

  const handleAddDoc = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    setActiveCategory(cat?.label || catId);
    document.getElementById("vault-dropzone")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes slideIn{ from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{
        background: C.obsidian,
        padding: "28px 36px 24px",
        borderBottom: `1px solid rgba(201,168,76,0.2)`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 10, color: C.gold, letterSpacing: "0.12em" }}>
              EMPIRE LOGIC
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 30, fontWeight: 500, color: C.white,
              margin: "0 0 6px", lineHeight: 1.15,
            }}>
              The Vault
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#6A6A6A" }}>
              Your business documentation — secured, organized, and investor-ready.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            <VaultStatusBadge pct={overall} />
            {/* Overall progress mini-bar */}
            <div style={{ width: 200 }}>
              <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${overall}%`, borderRadius: 4,
                  background: `linear-gradient(90deg, ${C.gold}, #E8C96A)`,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 10, color: "#555", textAlign: "right" }}>
                {categories.reduce((s, c) => s + c.docs.filter(d => d.done).length, 0)} of{" "}
                {categories.reduce((s, c) => s + c.docs.length, 0)} documents secured
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: "28px 36px 48px", overflowY: "auto" }}>

        {/* ── 4 Category Cards — 2×2 grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          marginBottom: 32,
          animation: "fadeIn 0.3s ease",
        }}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onToggleDoc={toggleDoc}
              onAddDoc={handleAddDoc}
            />
          ))}
        </div>

        {/* ── Client Success Section ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "rgba(124,154,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Users size={14} color="#7C9AFF" strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{
                margin: 0, fontSize: 14, fontWeight: 700, color: C.ink,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                Client Success
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: C.inkLight }}>
                Rosters, onboarding flows & program curriculum
              </p>
            </div>
            <div style={{
              marginLeft: "auto", padding: "4px 12px", borderRadius: 20,
              background: "rgba(124,154,255,0.10)", border: "1px solid rgba(124,154,255,0.25)",
              fontSize: 10, color: "#7C9AFF", fontWeight: 600, letterSpacing: "0.06em",
            }}>
              COACHING HUB
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {CLIENT_SUCCESS_FOLDERS.map((folder) => {
              const Icon = folder.icon;
              const done = folder.docs.filter((d) => d.done).length;
              const pct  = Math.round((done / folder.docs.length) * 100);
              return (
                <div key={folder.id} style={{
                  background: C.white, borderRadius: 14,
                  border: `1px solid ${C.creamDeep}`,
                  overflow: "hidden",
                }}>
                  {/* Folder header */}
                  <div style={{ padding: "18px 20px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: folder.colorBg,
                        border: `1px solid ${folder.color}33`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={16} color={folder.color} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink }}>{folder.label}</h3>
                        <p style={{ margin: "2px 0 0", fontSize: 10, color: C.inkLight }}>{done} of {folder.docs.length} items</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 3, borderRadius: 3, background: C.creamDeep, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{
                        height: "100%", width: `${pct}%`, borderRadius: 3,
                        background: pct >= 75 ? C.success : folder.color,
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 10, color: C.inkLight }}>{pct}% complete</p>
                  </div>

                  {/* Doc list */}
                  <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.creamDeep}`, paddingTop: 12 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 10, color: C.inkLight, lineHeight: 1.5 }}>{folder.desc}</p>
                    {folder.docs.map((doc) => (
                      <div key={doc.id} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 0", borderBottom: `1px solid ${C.creamDeep}`,
                      }}>
                        {doc.done
                          ? <CheckCircle2 size={12} color={C.success} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                          : <Circle       size={12} color="#CCCCCC"   strokeWidth={1.5} style={{ flexShrink: 0 }} />
                        }
                        <span style={{
                          flex: 1, fontSize: 11, color: doc.done ? C.inkMid : C.inkLight,
                          fontWeight: doc.done ? 500 : 400,
                        }}>
                          {doc.label}
                        </span>
                        {doc.done
                          ? <span style={{ fontSize: 10, color: C.inkLight }}>{doc.date}</span>
                          : <span style={{
                              fontSize: 9, color: C.roseText, background: C.rose,
                              padding: "1px 6px", borderRadius: 6, fontWeight: 600,
                            }}>Missing</span>
                        }
                      </div>
                    ))}
                    <button style={{
                      width: "100%", marginTop: 10, padding: "7px",
                      borderRadius: 8, border: `1px dashed ${C.goldBorder}`,
                      background: "transparent", color: C.gold,
                      fontSize: 11, fontWeight: 500, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}>
                      <Plus size={11} color={C.gold} /> Add File
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Drop Zone ── */}
        <div id="vault-dropzone" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Lock size={13} color={C.gold} strokeWidth={1.5} />
            <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.inkMid, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Secure Upload
            </h2>
            {activeCategory && (
              <>
                <span style={{ fontSize: 11, color: C.inkLight }}>→</span>
                <span style={{
                  fontSize: 10, color: C.gold, background: C.goldLight,
                  padding: "2px 9px", borderRadius: 10, border: `1px solid ${C.goldBorder}`,
                  fontWeight: 600,
                }}>
                  {activeCategory}
                </span>
                <button
                  onClick={() => setActiveCategory(null)}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: C.inkLight, display: "flex", alignItems: "center",
                  }}
                >
                  <X size={12} />
                </button>
              </>
            )}
          </div>

          <DropZone
            activeCategory={activeCategory}
            onFileAccepted={(files, cat) => {
              if (!cat) return;
              // In a real app, wire this to actual file storage
            }}
          />
        </div>

        {/* ── Funding Readiness Guide ── */}
        <div style={{
          padding: "20px 24px", borderRadius: 14,
          background: C.obsidian, border: `1px solid ${C.goldBorder}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shield size={14} color={C.gold} />
            <h2 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Funding Readiness Guide
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {categories.map((cat) => {
              const pct = readiness(cat.docs);
              const ready = pct >= 75;
              return (
                <div key={cat.id} style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: ready ? "rgba(74,124,89,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${ready ? "rgba(74,124,89,0.2)" : "rgba(255,255,255,0.05)"}`,
                }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: ready ? C.success : "#6A6A6A", fontWeight: 600 }}>
                    {cat.label}
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: ready ? C.success : "#4A4A4A" }}>
                    {pct}%
                  </p>
                  <div style={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`, borderRadius: 3,
                      background: ready ? C.success : C.gold,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <p style={{ margin: "5px 0 0", fontSize: 10, color: ready ? C.success : "#555" }}>
                    {ready ? "✓ Ready" : `${4 - cat.docs.filter(d=>d.done).length} needed`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
