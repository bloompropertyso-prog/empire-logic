import { useState, useEffect, useRef } from "react";
import { C, fonts } from "../lib/design";
import { Send, Brain, User, RefreshCw } from "lucide-react";

const mono = { fontFamily: fonts.mono };

function buildSystemContext(profile, leads) {
  if (!profile) return "";
  const activeLeads = (leads || []).filter(l => l.status !== "Closed" && l.status !== "Lost");
  return `You are the Co-Pilot for ${profile.name}, a ${profile.coachType}.

Their business context:
- Monthly revenue goal: $${profile.revenueGoal?.toLocaleString()}
- Primary offer price: $${profile.offerPrice?.toLocaleString()}
- Active clients: ${profile.activeClients}
- Active leads in pipeline: ${activeLeads.length} (${activeLeads.map(l => `${l.name} - ${l.status}`).join(", ") || "none"})

Your tone: Sharp, direct, COO-level. No fluff, no cheerleading. Give facts and specific next moves. You know their numbers and you tell them what they need to hear, not what they want to hear. Keep responses concise and actionable — 2-4 short paragraphs max unless they ask for detail.`;
}

const STARTERS = [
  "What should I focus on today to hit my revenue goal?",
  "Review my lead pipeline and tell me what to do first.",
  "How do I raise my prices without losing clients?",
  "I'm behind on my goal. What's the fastest path to close the gap?",
  "Write me a follow-up message for a lead that's gone quiet.",
  "How do I get more inbound leads this month?",
];

export default function CoPilotChat({ profile, leads }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `I'm your Co-Pilot${profile?.name ? `, ${profile.name}` : ""}. I know your numbers, your leads, and your goals. Ask me anything about your business — or just tell me what's on your mind and I'll tell you what to do next.`,
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg = { role: "user", content: userText };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      // Build messages for API — strip assistant intro if needed
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "copilot_chat",
          messages: [
            { role: "user", content: `[CONTEXT]\n${buildSystemContext(profile, leads)}\n\n[USER MESSAGE]\n${userText}` },
          ],
        }),
      });

      const data = await res.json();
      const reply = data.reply || "I couldn't process that. Try again.";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "Something went wrong. Check your connection and try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: `Fresh start. What do you need?`,
    }]);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 10, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>AI ASSISTANT</p>
          <h1 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 28, fontWeight: 500, color: C.ink }}>Co-Pilot Chat</h1>
        </div>
        <button onClick={clearChat} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.inkMid, fontSize: 11, cursor: "pointer", fontFamily: fonts.mono }}>
          <RefreshCw size={11} /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Starter prompts (shown only if 1 message) */}
        {messages.length === 1 && (
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.08em", marginBottom: 10 }}>QUICK STARTS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STARTERS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{
                  padding: "8px 14px", borderRadius: 7, fontSize: 12, border: `1px solid ${C.border}`,
                  background: "#fff", color: C.inkMid, cursor: "pointer", fontFamily: fonts.body, textAlign: "left",
                  maxWidth: 300,
                }}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => {
          const isAI = m.role === "assistant";
          return (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: isAI ? "row" : "row-reverse" }}>
              {/* Avatar */}
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isAI ? C.sidebar : C.goldLight, border: isAI ? "1px solid rgba(201,168,76,0.15)" : `1px solid ${C.goldBorder}` }}>
                {isAI ? <Brain size={14} color={C.gold} strokeWidth={1.5} /> : <User size={14} color={C.gold} strokeWidth={1.5} />}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: "72%",
                padding: "14px 18px",
                borderRadius: isAI ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                background: isAI ? "#fff" : C.sidebar,
                border: isAI ? `1px solid ${C.border}` : "1px solid rgba(201,168,76,0.15)",
                animation: "fadeUp 0.2s ease",
              }}>
                <p style={{ margin: 0, fontSize: 14, color: isAI ? C.ink : "#fff", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: fonts.body }}>
                  {m.content}
                </p>
              </div>
            </div>
          );
        })}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.sidebar, border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Brain size={14} color={C.gold} style={{ animation: "pulse 1.5s ease infinite" }} strokeWidth={1.5} />
            </div>
            <div style={{ padding: "14px 18px", borderRadius: "4px 12px 12px 12px", background: "#fff", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "16px 32px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your business..."
            rows={2}
            style={{
              flex: 1, padding: "12px 16px", border: `1px solid ${C.borderMid}`, borderRadius: 10,
              fontSize: 14, fontFamily: fonts.body, color: C.ink, background: "#fff",
              resize: "none", outline: "none", lineHeight: 1.6,
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44, borderRadius: 10, border: "none", flexShrink: 0,
              background: loading || !input.trim() ? C.border : C.gold,
              cursor: loading || !input.trim() ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            <Send size={16} color={loading || !input.trim() ? C.inkLight : "#0a0a0f"} strokeWidth={1.5} />
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 11, color: C.inkLight, fontFamily: fonts.mono }}>
          Enter to send · Shift+Enter for new line · Context-aware to your profile & leads
        </p>
      </div>
    </div>
  );
}
