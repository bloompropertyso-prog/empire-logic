import { useState, useEffect } from "react";
import { C, fonts } from "../lib/design";
import { LayoutDashboard, BarChart2, Users, Target, MessageSquare, Star, ChevronRight, Settings } from "lucide-react";
import OnboardingFlow from "./OnboardingFlow";
import Dashboard from "./Dashboard";
import BudgetTracker from "./BudgetTracker";
import LeadLog from "./LeadLog";
import Goals from "./Goals";
import CoPilotChat from "./CoPilotChat";

const NAV = [
  { id: "dashboard", label: "Dashboard",      icon: LayoutDashboard },
  { id: "budget",    label: "Budget Tracker",  icon: BarChart2 },
  { id: "leads",     label: "Lead Log",        icon: Users },
  { id: "goals",     label: "Goals",           icon: Target },
  { id: "copilot",   label: "Co-Pilot Chat",   icon: MessageSquare },
];

function Sidebar({ active, setActive, profile }) {
  return (
    <aside style={{
      width: 240, minHeight: "100vh", background: C.sidebar,
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(201,168,76,0.15)",
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={15} color={C.gold} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ color: "#ffffff", fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: "0.06em", fontFamily: fonts.body }}>EMPIRE LOGIC</p>
            {profile && <p style={{ color: "rgba(201,168,76,0.7)", fontSize: 10, margin: 0, fontFamily: fonts.mono, letterSpacing: "0.08em" }}>{profile.name?.toUpperCase()}</p>}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: fonts.mono, letterSpacing: "0.12em", padding: "0 10px 10px", margin: 0 }}>NAVIGATION</p>
        {NAV.map(({ id, label, icon: Icon }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => setActive(id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2,
              background: on ? "rgba(201,168,76,0.10)" : "transparent",
              borderLeft: on ? `2px solid ${C.gold}` : "2px solid transparent",
            }}>
              <Icon size={15} color={on ? C.gold : "rgba(255,255,255,0.35)"} strokeWidth={1.5} />
              <span style={{ color: on ? C.gold : "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: on ? 500 : 400, fontFamily: fonts.body }}>
                {label}
              </span>
              {on && <ChevronRight size={11} color={C.gold} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </nav>

      {/* Profile pill */}
      {profile && (
        <div style={{ padding: "12px 12px 20px", flexShrink: 0 }}>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: fonts.body }}>{profile.name}</p>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: fonts.mono }}>{profile.coachType}</p>
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 8 }} />
            <p style={{ margin: 0, fontSize: 10, color: C.gold, fontFamily: fonts.mono, letterSpacing: "0.04em" }}>
              GOAL: ${Number(profile.revenueGoal).toLocaleString()}/mo
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function EmpireLogicShell() {
  const [activeNav, setActiveNav]   = useState("dashboard");
  const [profile, setProfile]       = useState(null);
  const [showOnboarding, setOnboard] = useState(false);
  const [leads, setLeads]           = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("el_profile_v2");
    const savedLeads = localStorage.getItem("el_leads");
    if (saved) setProfile(JSON.parse(saved));
    else setOnboard(true);
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  }, []);

  const handleLeadsChange = (updated) => {
    setLeads(updated);
    localStorage.setItem("el_leads", JSON.stringify(updated));
  };

  const handleProfileSave = (p) => {
    localStorage.setItem("el_profile_v2", JSON.stringify(p));
    setProfile(p);
    setOnboard(false);
    // reload leads in case onboarding set some
    const savedLeads = localStorage.getItem("el_leads");
    if (savedLeads) setLeads(JSON.parse(savedLeads));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: fonts.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        textarea { font-family: inherit; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {showOnboarding && <OnboardingFlow onComplete={handleProfileSave} />}

      <Sidebar active={activeNav} setActive={setActiveNav} profile={profile} />

      <main style={{ marginLeft: 240, flex: 1, minHeight: "100vh" }}>
        {activeNav === "dashboard" && (
          <Dashboard
            profile={profile}
            leads={leads}
            onOpenSettings={() => setOnboard(true)}
          />
        )}
        {activeNav === "budget" && <BudgetTracker profile={profile} />}
        {activeNav === "leads"  && <LeadLog profile={profile} leads={leads} onChange={handleLeadsChange} />}
        {activeNav === "goals"  && <Goals profile={profile} leads={leads} />}
        {activeNav === "copilot" && <CoPilotChat profile={profile} leads={leads} />}
      </main>
    </div>
  );
}
