import { useState } from "react";
import {
  Zap,
  Sparkles,
  Copy,
  RefreshCw,
  Scissors,
  MessageCircle,
  ChevronRight,
  Check,
  Video,
  BookOpen,
  Repeat2,
  Image,
  Flame,
  TrendingUp,
  Pencil,
  Send,
} from "lucide-react";

/* ─── Design Tokens (mirrored from shell) ────────────────────────── */
const C = {
  obsidian:      "#0A0A0A",
  obsidianSurf:  "#1C1C1C",
  gold:          "#C9A84C",
  goldLight:     "rgba(201,168,76,0.12)",
  goldBorder:    "rgba(201,168,76,0.28)",
  goldGlow:      "0 0 0 3px rgba(201,168,76,0.18), 0 0 14px rgba(201,168,76,0.28)",
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
};

/* ─── Tone Options ───────────────────────────────────────────────── */
const TONES = [
  {
    id: "authority",
    label: "Authority",
    emoji: "👑",
    desc: "Expert positioning",
  },
  {
    id: "relatable",
    label: "Relatable",
    emoji: "🤝",
    desc: "Behind-the-scenes",
  },
  {
    id: "empowering",
    label: "Empowering",
    emoji: "✨",
    desc: "Lift your audience",
  },
  {
    id: "direct",
    label: "Direct",
    emoji: "⚡",
    desc: "No fluff, just facts",
  },
];

/* ─── Content Goals ──────────────────────────────────────────────── */
const GOALS = [
  { id: "teach",  label: "Teach",       icon: BookOpen   },
  { id: "sell",   label: "Sell",        icon: TrendingUp },
  { id: "win",    label: "Share a Win", icon: Flame      },
];

/* ─── AI Draft Library ───────────────────────────────────────────── */
/*
  12 pre-written drafts indexed by tone_goal. These stand in for real
  AI generation — swap with your API call when you wire up the backend.
*/
const DRAFTS = {
  authority_teach: `Most founders treat content like a checklist.
Post Monday. Post Wednesday. Post Friday. Repeat.

But here's what nobody tells you: consistency without strategy is just noise.

The founders building real audience? They post with intention.

Every piece of content should do ONE of three things:
→ Position you as the expert
→ Pull your ideal client closer
→ Move someone to take action

Start there. The algorithm rewards clarity.

Which of these does your last post do? Drop it below — I'll tell you.`,

  authority_sell: `Your pricing problem isn't about what you charge.
It's about what you've taught people to expect.

If prospects are ghosting after your proposal — that's a positioning problem, not a price problem.

The Empire Logic framework helps founders rebuild their pricing foundation in 3 sessions, so you stop explaining your value and start collecting it.

DM me "PRICING" and I'll share how it works.`,

  authority_win: `6 months ago I was charging $500 for a service I now charge $3,500 for.

Same service. Different client. Different positioning.

The only thing that changed?

I stopped selling my time and started selling the outcome.

Scope of work stayed the same. My revenue tripled.

If you're undercharging right now, I need you to hear this — it's not imposter syndrome. It's strategy.

Drop a 🔥 if you've made a pricing shift recently.`,

  relatable_teach: `Okay real talk — I used to write captions at 11pm half-asleep and wonder why my engagement was garbage 😅

Until I built a 20-minute content system.

Here's the exact process I now use every week:

1. Pick ONE thing I learned or observed
2. Write it as if I'm texting a friend
3. End with a real question — not "what do you think?" but something specific

That's it. No content calendar. No viral hook formula. Just honest, consistent, real.

Save this. Try it once. Tell me what happens.`,

  relatable_sell: `I'm going to be honest with you for a second.

I used to be embarrassed to talk about money. To say "I charge this." To own what I do.

Then I hired a mentor who told me something that changed everything:

"If you don't believe your price, neither will they."

That's the work. That's what I help founders do inside Empire Logic — not just the strategy, but the confidence to back it.

First call is free. Link in bio. No pressure, ever.`,

  relatable_win: `Today I hit something I've been working toward for a while 🥂

I'm not going to say the number because this isn't about the number.

It's about the version of me who almost quit 8 months ago. Who cried in her car after a client said no. Who wondered if this whole "running a business" thing was a mistake.

To that version of me: she was wrong.

If you're in the hard middle right now — the in-between phase where it hasn't clicked yet — please stay. The other side is worth it.`,

  empowering_teach: `You are already qualified.

I need you to read that again.

The reason you keep waiting — for the certification, the website rebrand, the "right time" — is not strategy. It's fear wearing a productivity costume.

Your lived experience IS the curriculum. Your journey IS the case study. You don't need permission.

Three things you can do TODAY to start showing up:
→ Share one thing you know that took you years to learn
→ Document a mistake and what it taught you
→ Answer a question someone asked you this week — publicly

The world needs what you know. Start now.`,

  empowering_sell: `What if the offer you've been sitting on is exactly what someone is praying for right now?

That thing you've been "almost ready" to launch. The program. The service. The session package.

Someone out there is googling the problem you solve. They want to pay someone who gets it.

You get it.

I built Empire Logic to help founders like you get out of their own way and into revenue. If you're ready to stop sitting on your genius — I'd love to work with you.

Comment "READY" and let's talk.`,

  empowering_win: `To every person who DMed me asking if it gets easier —

Yes. It gets easier.

Not because the work gets lighter. Because YOU get stronger.

This week something clicked for me that I've been working toward for months. And the only reason it happened is because I didn't stop when it was hard.

You're building something real. Keep building.

Tag a founder who needs to hear this today 💛`,

  direct_teach: `Content that converts follows a formula. Here it is:

Hook → Problem → Insight → Proof → CTA

Most people skip the proof and wonder why nobody buys.

Proof doesn't mean testimonials (though those help). It means: show me you've lived this.

Your story is your proof. Use it.`,

  direct_sell: `I have 2 spots open for 1:1 strategy sessions this month.

Here's who this is for:
✓ You're making money but not enough
✓ You know you're undercharging
✓ You want a clear 90-day revenue plan

Here's who this is NOT for:
✗ You want to "pick my brain" for free
✗ You're not ready to invest in growth
✗ You're looking for a cheerleader, not a strategist

If that first list sounds like you — DM me "90 DAYS" and let's make it happen.`,

  direct_win: `Revenue update: best month yet.

What worked:
→ Raised prices without explanation
→ Said no to 3 clients who weren't a fit
→ Focused on 1 offer instead of 5

What didn't:
→ Posting every day hoping something would land
→ Discounting to close

The results were direct. The strategy should be too.`,
};

/* ─── Quick Tweak Functions ──────────────────────────────────────── */
const TWEAKS = {
  punchier: (text) => {
    const lines = text.split("\n").filter((l) => l.trim());
    const first = lines[0] || "";
    const punchy = first.replace(/\./g, "!").toUpperCase();
    return [punchy, "", ...lines.slice(1)].join("\n");
  },

  cta: (text) => {
    const ctas = [
      "\n\n→ DM me if this hit home. Let's talk.",
      "\n\n💬 Save this. Share it with a founder who needs it.",
      "\n\n🔗 Link in bio — first step is free.",
      "\n\n↩️ Repost if this resonated. Someone in your network needs this today.",
    ];
    const pick = ctas[Math.floor(Math.random() * ctas.length)];
    return text + pick;
  },

  threads: (text) => {
    const sentences = text
      .replace(/\n+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 10)
      .slice(0, 5);
    return sentences
      .map((s, i) => `${i + 1}/ ${s.trim()}`)
      .join("\n\n") + "\n\n🧵 (thread continues)";
  },
};

/* ─── Energy Suggestions ─────────────────────────────────────────── */
const ENERGY_SUGGESTIONS = {
  maintenance: [
    { icon: Repeat2,    label: "Repost a memory",        desc: "Share a post from 6–12 months ago that still resonates. Zero writing required." },
    { icon: Image,      label: "Low-lift Story idea",     desc: "Post a photo with 1 sentence. Authentic > polished when you're low energy." },
    { icon: MessageCircle, label: "Reply tour",           desc: "Spend 15 min replying to comments & DMs. Builds trust without creating content." },
  ],
  steady: [
    { icon: Pencil,     label: "Carousel post",           desc: "5-slide teach post on something you know cold. Steady output, strong authority." },
    { icon: BookOpen,   label: "Value thread",             desc: "3-tweet thread: one insight, one story, one question. Reliable engagement driver." },
    { icon: Flame,      label: "Share a client result",   desc: "One before → after. Keep it specific, keep it real." },
  ],
  empire: [
    { icon: Video,      label: "Record a 3-part Series",  desc: "Batch 3 Reels today on a single topic. Maximum impact, maximum authority." },
    { icon: BookOpen,   label: "Write a Long-form Article",desc: "1,200+ words on your methodology. Positions you for press, speaking, partnerships." },
    { icon: TrendingUp, label: "Launch a Visibility Push", desc: "Post 3× today across platforms + pitch 1 podcast or collab. CEO energy move." },
  ],
};

/* ─── Component ──────────────────────────────────────────────────── */
export default function SocialStudio({ energyLevel }) {
  const [tone,         setTone]         = useState("authority");
  const [goal,         setGoal]         = useState("teach");
  const [draft,        setDraft]        = useState("");
  const [generating,   setGenerating]   = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [activeTab,    setActiveTab]    = useState("write"); // "write" | "suggestions"

  /* Derive energy mode */
  const energyMode =
    energyLevel <= 2 ? "maintenance" :
    energyLevel <= 3 ? "steady"      : "empire";

  const energyMeta = {
    maintenance: { label: "Rest Mode",   color: C.success,   bg: C.successLight   },
    steady:      { label: "Steady Mode", color: "#9A7A2A",   bg: C.goldLight      },
    empire:      { label: "Empire Mode", color: "#A05A5A",   bg: "rgba(160,90,90,0.1)" },
  }[energyMode];

  /* Simulate AI generation with a brief loading state */
  const handleGenerate = () => {
    if (generating) return;
    setGenerating(true);
    setDraft("");
    setTimeout(() => {
      const key = `${tone}_${goal}`;
      const raw = DRAFTS[key] || DRAFTS["authority_teach"];
      setDraft(raw);
      setGenerating(false);
    }, 900);
  };

  const handleTweak = (tweakKey) => {
    if (!draft) return;
    setDraft(TWEAKS[tweakKey](draft));
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const suggestions = ENERGY_SUGGESTIONS[energyMode];
  const wordCount   = draft ? draft.trim().split(/\s+/).length : 0;
  const charCount   = draft.length;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.cream, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        textarea { font-family: inherit; resize: none; outline: none; }
        textarea::placeholder { color: #AAAAAA; }
        @keyframes shimmer {
          0%   { opacity: 0.5; }
          50%  { opacity: 1;   }
          100% { opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{
        background: C.obsidian,
        padding: "28px 36px 24px",
        borderBottom: `1px solid rgba(201,168,76,0.2)`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 10, color: C.gold, letterSpacing: "0.12em" }}>EMPIRE LOGIC</p>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 30, fontWeight: 500, color: C.white,
            margin: "0 0 6px", lineHeight: 1.15,
          }}>
            Social Studio
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#6A6A6A" }}>What are we building today?</p>
        </div>

        {/* Energy badge + tab switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            padding: "6px 14px", borderRadius: 20,
            background: energyMeta.bg,
            border: `1px solid ${energyMeta.color}44`,
            fontSize: 12, color: energyMeta.color, fontWeight: 500,
          }}>
            ⚡ {energyMeta.label}
          </div>

          {/* Tab switcher */}
          <div style={{
            display: "flex", borderRadius: 8, overflow: "hidden",
            border: `1px solid rgba(201,168,76,0.25)`,
          }}>
            {["write", "suggestions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "7px 16px", border: "none", fontSize: 12,
                  background: activeTab === tab ? C.goldLight : "transparent",
                  color: activeTab === tab ? C.gold : "#666",
                  fontWeight: activeTab === tab ? 500 : 400,
                  letterSpacing: "0.02em",
                  transition: "all 0.15s",
                }}
              >
                {tab === "write" ? "✍️ Write" : "💡 Suggestions"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Body ── */}
      {activeTab === "write" ? (
        <div style={{
          flex: 1, display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 0,
          minHeight: 0,
        }}>

          {/* ── LEFT: Input Panel ── */}
          <div style={{
            borderRight: `1px solid ${C.creamDeep}`,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            overflowY: "auto",
            background: C.white,
          }}>

            {/* Tone Selector */}
            <div>
              <Label text="Brand Voice" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {TONES.map((t) => {
                  const active = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      style={{
                        padding: "12px 10px",
                        borderRadius: 10,
                        border: active ? `1.5px solid ${C.gold}` : `1px solid ${C.creamDeep}`,
                        background: active ? C.goldLight : "transparent",
                        boxShadow: active ? C.goldGlow : "none",
                        textAlign: "left",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <div style={{ fontSize: 16, marginBottom: 4 }}>{t.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: active ? "#7A5E1A" : C.ink }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: 10, color: C.inkLight, marginTop: 2 }}>{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Goal */}
            <div>
              <Label text="Content Goal" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {GOALS.map(({ id, label, icon: Icon }) => {
                  const active = goal === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setGoal(id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "11px 14px",
                        borderRadius: 10,
                        border: active ? `1.5px solid ${C.gold}` : `1px solid ${C.creamDeep}`,
                        background: active ? C.goldLight : "transparent",
                        boxShadow: active ? C.goldGlow : "none",
                        textAlign: "left",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <Icon
                        size={15}
                        color={active ? C.gold : C.inkLight}
                        strokeWidth={1.5}
                      />
                      <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? "#7A5E1A" : C.ink }}>
                        {label}
                      </span>
                      {active && (
                        <ChevronRight size={12} color={C.gold} style={{ marginLeft: "auto" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 12,
                border: `1px solid ${C.goldBorder}`,
                background: generating
                  ? "rgba(201,168,76,0.15)"
                  : `linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)`,
                backgroundSize: "200% 200%",
                color: generating ? C.gold : C.obsidian,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: generating ? "wait" : "pointer",
                boxShadow: generating ? "none" : `0 2px 16px rgba(201,168,76,0.35)`,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                animation: generating ? "shimmer 1s infinite" : "none",
              }}
            >
              {generating ? (
                <>
                  <RefreshCw size={15} style={{ animation: "spin 0.8s linear infinite" }} />
                  <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                  Drafting…
                </>
              ) : (
                <>
                  <Zap size={15} />
                  ✦ Generate Post
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: C.creamDeep }} />

            {/* Energy context note */}
            <div style={{
              padding: "12px 14px", borderRadius: 10,
              background: C.lavender, border: `1px solid ${C.lavenderBorder}`,
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, color: C.lavenderText, fontWeight: 600, letterSpacing: "0.08em" }}>
                ENERGY CONTEXT
              </p>
              <p style={{ margin: 0, fontSize: 12, color: C.lavenderText, lineHeight: 1.5 }}>
                {energyMode === "maintenance"
                  ? "You're in rest mode — generated drafts will be shorter and easier to post with minimal editing."
                  : energyMode === "steady"
                  ? "You're in steady mode — balanced drafts built for consistent, trustworthy output."
                  : "You're in empire mode — drafts are high-impact and built for maximum reach and authority."
                }
              </p>
            </div>
          </div>

          {/* ── RIGHT: Drafting Room ── */}
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

            {/* Drafting Room header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pencil size={14} color={C.gold} strokeWidth={1.5} />
                <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.inkMid, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Drafting Room
                </h2>
              </div>
              {draft && (
                <span style={{ fontSize: 11, color: C.inkLight }}>
                  {wordCount} words · {charCount} chars
                </span>
              )}
            </div>

            {/* Text Area */}
            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  generating
                    ? "Your post is being drafted…"
                    : "Select your tone and goal, then hit ✦ Generate Post.\n\nYour draft will appear here — edit freely."
                }
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 340,
                  padding: "20px 22px",
                  borderRadius: 14,
                  border: `1px solid ${C.creamDeep}`,
                  background: C.white,
                  fontSize: 14,
                  color: C.ink,
                  lineHeight: 1.75,
                  animation: draft ? "fadeIn 0.3s ease" : "none",
                }}
              />
              {generating && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", background: "rgba(249,248,243,0.7)",
                  borderRadius: 14, animation: "shimmer 1s infinite",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>✦</div>
                    <p style={{ color: C.gold, fontSize: 13, fontWeight: 500 }}>Drafting your post…</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tweaks */}
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 10, color: C.inkLight, letterSpacing: "0.08em", fontWeight: 600 }}>
                QUICK TWEAKS
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <TweakButton
                  icon={Flame}
                  label="Make it Punchier"
                  onClick={() => handleTweak("punchier")}
                  disabled={!draft}
                />
                <TweakButton
                  icon={Send}
                  label="Add CTA"
                  onClick={() => handleTweak("cta")}
                  disabled={!draft}
                />
                <TweakButton
                  icon={Scissors}
                  label="Shorten for Threads"
                  onClick={() => handleTweak("threads")}
                  disabled={!draft}
                />
              </div>
            </div>

            {/* Action bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 18px", borderRadius: 12,
              background: C.white, border: `1px solid ${C.creamDeep}`,
            }}>
              <button
                onClick={handleCopy}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 18px", borderRadius: 8,
                  border: `1px solid ${C.creamDeep}`,
                  background: copied ? C.successLight : "transparent",
                  color: copied ? C.success : C.inkMid,
                  fontSize: 12, fontWeight: 500,
                  transition: "all 0.15s",
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>

              <button style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 18px", borderRadius: 8,
                border: `1px solid ${C.creamDeep}`,
                background: "transparent", color: C.inkMid,
                fontSize: 12, fontWeight: 500,
              }}>
                <RefreshCw size={13} />
                Regenerate
              </button>

              <div style={{ flex: 1 }} />

              <button
                onClick={handleGenerate}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 20px", borderRadius: 8,
                  border: `1px solid ${C.goldBorder}`,
                  background: C.goldLight, color: "#7A5E1A",
                  fontSize: 12, fontWeight: 600,
                  boxShadow: `0 0 0 0 rgba(201,168,76,0)`,
                  transition: "all 0.15s",
                }}
              >
                <Zap size={13} color={C.gold} />
                New Draft
              </button>
            </div>
          </div>
        </div>

      ) : (
        /* ── SUGGESTIONS TAB ── */
        <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, color: C.inkLight, letterSpacing: "0.1em", margin: "0 0 6px", fontWeight: 600 }}>
              BASED ON YOUR ENERGY LEVEL {energyLevel}
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 500, color: C.ink, margin: 0,
            }}>
              {energyMode === "maintenance"
                ? "Low-lift ideas for a rest day."
                : energyMode === "steady"
                ? "Consistent moves for a steady day."
                : "High-impact plays for an empire day."}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
            {suggestions.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                onClick={() => setActiveTab("write")}
                style={{
                  padding: "24px 20px", borderRadius: 14,
                  border: `1px solid ${C.creamDeep}`,
                  background: C.white,
                  textAlign: "left",
                  transition: "all 0.18s ease",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 12,
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: C.goldLight, border: `1px solid ${C.goldBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color={C.gold} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: C.ink }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.inkMid, lineHeight: 1.55 }}>{desc}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: "auto" }}>
                  <span style={{ fontSize: 11, color: C.gold, fontWeight: 500 }}>Start writing</span>
                  <ChevronRight size={11} color={C.gold} />
                </div>
              </button>
            ))}
          </div>

          {/* All-mode reference */}
          <div style={{
            padding: "20px 24px", borderRadius: 14,
            background: C.obsidian, border: `1px solid rgba(201,168,76,0.2)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Zap size={13} color={C.gold} />
              <p style={{ margin: 0, fontSize: 11, color: C.gold, letterSpacing: "0.08em", fontWeight: 600 }}>
                ENERGY → CONTENT GUIDE
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                { range: "Level 1–2", mode: "Rest Mode",   bg: C.successLight, color: C.success, items: ["Repost a memory", "Story poll", "Reply tour"] },
                { range: "Level 3",   mode: "Steady Mode", bg: C.goldLight,    color: "#9A7A2A", items: ["Carousel post", "Value thread", "Client result"] },
                { range: "Level 4–5", mode: "Empire Mode", bg: "rgba(160,90,90,0.1)", color: "#A05A5A", items: ["3-part Reel series", "Long-form article", "Visibility launch"] },
              ].map(({ range, mode, bg, color, items }) => (
                <div key={range} style={{ padding: "14px 16px", borderRadius: 10, background: bg, border: `1px solid ${color}33` }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, color, fontWeight: 700, letterSpacing: "0.08em" }}>{range}</p>
                  <p style={{ margin: "0 0 10px", fontSize: 12, color, fontWeight: 500 }}>{mode}</p>
                  {items.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Small helpers ──────────────────────────────────────────────── */
function Label({ text }) {
  return (
    <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, color: "#8A8A8A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
      {text}
    </p>
  );
}

function TweakButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 8,
        border: `1px solid ${disabled ? "#E8E4DC" : "#C9A84C44"}`,
        background: disabled ? "transparent" : "rgba(201,168,76,0.06)",
        color: disabled ? "#CCCCCC" : "#7A5E1A",
        fontSize: 12, fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <Icon size={12} color={disabled ? "#CCC" : "#C9A84C"} strokeWidth={1.5} />
      {label}
    </button>
  );
}
