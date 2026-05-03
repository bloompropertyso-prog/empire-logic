import { useState } from "react";
import { C, fonts, inputSx, labelSx, btnPrimary } from "../lib/design";
import { Star, ArrowRight, ChevronLeft } from "lucide-react";

const COACH_TYPES = [
  "Business Coach", "Life Coach", "Health & Wellness Coach",
  "Marketing Consultant", "Executive Coach", "Sales Coach",
  "Financial Coach", "Brand Strategist", "Other",
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName]           = useState("");
  const [coachType, setCoachType] = useState("");
  const [revenueGoal, setGoal]    = useState("");
  const [offerPrice, setOffer]    = useState("");
  const [offer2, setOffer2]       = useState("");
  const [activeClients, setClients] = useState("");
  const [leads, setLeads] = useState([{ name: "", dealValue: "", status: "New" }]);

  const addLead = () => setLeads([...leads, { name: "", dealValue: "", status: "New" }]);
  const updateLead = (i, k, v) => setLeads(leads.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  const removeLead = (i) => setLeads(leads.filter((_, idx) => idx !== i));

  const handleComplete = () => {
    const profile = {
      name: name || "Founder",
      coachType: coachType || "Coach",
      revenueGoal: parseFloat(revenueGoal) || 10000,
      offerPrice: parseFloat(offerPrice) || 1500,
      offer2: parseFloat(offer2) || 0,
      activeClients: parseInt(activeClients) || 0,
    };
    const initialLeads = leads
      .filter(l => l.name.trim())
      .map((l, i) => ({
        id: Date.now() + i,
        name: l.name,
        dealValue: parseFloat(l.dealValue) || 0,
        status: "New",
        source: "Added at setup",
        offer: "",
        lastFollowUp: new Date().toISOString().split("T")[0],
        notes: "",
      }));
    if (initialLeads.length > 0) {
      localStorage.setItem("el_leads", JSON.stringify(initialLeads));
    }
    onComplete(profile);
  };

  const steps = ["About You", "Revenue Goal", "Your Offer", "Active Leads"];
  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: fonts.body,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ width: "100%", maxWidth: 540, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={17} color={C.gold} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ color: C.ink, fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: "0.06em" }}>EMPIRE LOGIC</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            {steps.map((s, i) => (
              <span key={s} style={{ fontSize: 11, fontFamily: fonts.mono, color: i + 1 === step ? C.gold : i + 1 < step ? C.green : C.inkLight, fontWeight: i + 1 === step ? 600 : 400 }}>
                {i + 1}. {s}
              </span>
            ))}
          </div>
          <div style={{ height: 3, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: C.gold, borderRadius: 3, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "36px 36px 32px" }}>

          {/* STEP 1: About You */}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 500, color: C.ink, margin: "0 0 6px" }}>Let's set up your empire.</h2>
              <p style={{ fontSize: 14, color: C.inkLight, margin: "0 0 28px", lineHeight: 1.65 }}>This takes 2 minutes and makes every number in the app personal to your business.</p>
              <div style={{ marginBottom: 18 }}>
                <label style={labelSx}>Your name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bryttani" style={inputSx} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelSx}>What kind of coach or consultant are you?</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {COACH_TYPES.map(t => (
                    <button key={t} onClick={() => setCoachType(t)} style={{
                      padding: "9px 10px", borderRadius: 8, fontSize: 12, fontFamily: fonts.body, cursor: "pointer", textAlign: "center",
                      border: coachType === t ? `1.5px solid ${C.gold}` : "1px solid rgba(10,10,15,0.12)",
                      background: coachType === t ? C.goldLight : "transparent",
                      color: coachType === t ? C.gold : C.inkMid,
                      fontWeight: coachType === t ? 600 : 400,
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} style={{ ...btnPrimary, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Next <ArrowRight size={14} />
              </button>
            </>
          )}

          {/* STEP 2: Revenue Goal */}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 500, color: C.ink, margin: "0 0 6px" }}>What's your monthly revenue goal?</h2>
              <p style={{ fontSize: 14, color: C.inkLight, margin: "0 0 28px", lineHeight: 1.65 }}>This is the number every calculation in the app will work backwards from.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelSx}>Monthly Revenue Goal ($)</label>
                <input type="number" value={revenueGoal} onChange={e => setGoal(e.target.value)} placeholder="e.g. 10000" style={{ ...inputSx, fontSize: 22, fontFamily: fonts.mono, fontWeight: 600 }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelSx}>Current Active Clients (paying right now)</label>
                <input type="number" value={activeClients} onChange={e => setClients(e.target.value)} placeholder="e.g. 3" style={inputSx} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer", fontFamily: fonts.body }}>
                  <ChevronLeft size={14} /> Back
                </button>
                <button onClick={() => setStep(3)} style={{ ...btnPrimary, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Offer */}
          {step === 3 && (
            <>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 500, color: C.ink, margin: "0 0 6px" }}>What do you sell?</h2>
              <p style={{ fontSize: 14, color: C.inkLight, margin: "0 0 28px", lineHeight: 1.65 }}>Your offer price determines how many sales you need to hit your goal.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={labelSx}>Primary Offer Price ($)</label>
                <input type="number" value={offerPrice} onChange={e => setOffer(e.target.value)} placeholder="e.g. 1500" style={{ ...inputSx, fontSize: 20, fontFamily: fonts.mono, fontWeight: 600 }} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={labelSx}>Secondary Offer Price (optional — e.g. VIP, group)</label>
                <input type="number" value={offer2} onChange={e => setOffer2(e.target.value)} placeholder="e.g. 497" style={inputSx} />
              </div>

              {/* Quick math preview */}
              {offerPrice && revenueGoal && (
                <div style={{ padding: "14px 16px", background: C.goldLight, border: `1px solid ${C.goldBorder}`, borderRadius: 10, marginBottom: 24 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.inkMid, fontFamily: fonts.body }}>
                    At <span style={{ fontFamily: fonts.mono, fontWeight: 600, color: C.ink }}>${Number(offerPrice).toLocaleString()}</span>/client you need{" "}
                    <span style={{ fontFamily: fonts.mono, fontWeight: 700, color: C.gold }}>{Math.ceil(Number(revenueGoal) / Number(offerPrice))} clients</span>{" "}
                    to hit your <span style={{ fontFamily: fonts.mono, fontWeight: 600, color: C.ink }}>${Number(revenueGoal).toLocaleString()}</span> goal.
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer", fontFamily: fonts.body }}>
                  <ChevronLeft size={14} /> Back
                </button>
                <button onClick={() => setStep(4)} style={{ ...btnPrimary, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* STEP 4: Active Leads */}
          {step === 4 && (
            <>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 500, color: C.ink, margin: "0 0 6px" }}>Any active leads right now?</h2>
              <p style={{ fontSize: 14, color: C.inkLight, margin: "0 0 24px", lineHeight: 1.65 }}>Optional — the AI uses these names in your Daily Action Plan. You can add more later.</p>

              {leads.map((lead, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
                  <input value={lead.name} onChange={e => updateLead(i, "name", e.target.value)} placeholder="Lead name" style={{ ...inputSx, flex: 2 }} />
                  <input type="number" value={lead.dealValue} onChange={e => updateLead(i, "dealValue", e.target.value)} placeholder="Deal $" style={{ ...inputSx, flex: 1 }} />
                  {leads.length > 1 && (
                    <button onClick={() => removeLead(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight, padding: 4, flexShrink: 0, fontSize: 18, lineHeight: 1 }}>×</button>
                  )}
                </div>
              ))}
              <button onClick={addLead} style={{ fontSize: 12, color: C.gold, background: "none", border: "none", cursor: "pointer", fontFamily: fonts.body, fontWeight: 600, padding: "4px 0", marginBottom: 28 }}>+ Add Another Lead</button>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(3)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.inkMid, fontSize: 13, cursor: "pointer", fontFamily: fonts.body }}>
                  <ChevronLeft size={14} /> Back
                </button>
                <button onClick={handleComplete} style={{ ...btnPrimary, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Launch My Dashboard →
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: C.inkLight, fontFamily: fonts.mono }}>
          You can edit everything in Settings later.
        </p>
      </div>
    </div>
  );
}
