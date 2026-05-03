import { useState, useEffect } from "react";
import { C, fonts, inputSx, labelSx, btnPrimary, btnSecondary } from "../lib/design";
import { Plus, X, Flame, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

const INCOME_CATS = ["1:1 Coaching", "Group Program", "Course / Digital Product", "Consulting Retainer", "Speaking / Other"];
const EXPENSE_CATS = ["Software & Tools", "Marketing & Ads", "Coaching & Mentorship", "Education & Courses", "Contractor / VA Help", "Office & Equipment", "Other"];

const fmt = (n) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const mono = { fontFamily: fonts.mono };

function getMonthKey(date) {
  if (!date) { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; }
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
function getMonthLabel(key) {
  const [y, m] = key.split("-");
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function currentMonthKey() { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; }
function allMonthKeys(income, expenses) {
  const keys = new Set();
  [...income, ...expenses].forEach(e => { if (e.date) keys.add(getMonthKey(e.date)); });
  keys.add(currentMonthKey());
  return [...keys].sort().reverse();
}

/* ── Entry Form Modal ── */
function EntryModal({ mode, onSave, onClose }) {
  const [date, setDate]     = useState(new Date().toISOString().split("T")[0]);
  const [cat, setCat]       = useState(mode === "income" ? INCOME_CATS[0] : EXPENSE_CATS[0]);
  const [amount, setAmount] = useState("");
  const [label, setLabel]   = useState("");

  const isIncome = mode === "income";

  const handleSave = () => {
    if (!amount) return;
    onSave({ id: Date.now(), date, category: cat, amount: parseFloat(amount), label: label.trim() });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,10,15,0.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.border}`, padding: "28px", width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.ink, fontFamily: fonts.body }}>
            Log {isIncome ? "Income" : "Expense"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight }}><X size={18} /></button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelSx}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputSx} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelSx}>Category</label>
          <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inputSx, appearance: "none" }}>
            {(isIncome ? INCOME_CATS : EXPENSE_CATS).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelSx}>Amount ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ ...inputSx, ...mono, fontSize: 18, fontWeight: 600 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelSx}>{isIncome ? "Client Name (optional)" : "Description (optional)"}</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder={isIncome ? "e.g. Sarah M." : "e.g. Kajabi subscription"} style={inputSx} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...btnSecondary, flex: 1 }}>Cancel</button>
          <button onClick={handleSave} style={{ ...btnPrimary, flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Plus size={14} /> Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Entries Table ── */
function EntriesTable({ entries, type, onDelete }) {
  const isIncome = type === "income";
  const color = isIncome ? C.green : C.red;
  const bg    = isIncome ? C.greenLight : C.redLight;

  if (entries.length === 0) {
    return (
      <div style={{ padding: "28px", textAlign: "center", background: "#fafaf8", borderRadius: 10, border: `1px solid ${C.border}` }}>
        <p style={{ margin: 0, fontSize: 13, color: C.inkLight }}>{isIncome ? "No income logged yet." : "No expenses logged yet."}</p>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafaf8" }}>
            {["Date", "Category", isIncome ? "Client" : "Description", "Amount", ""].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 9, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
              <td style={{ padding: "11px 14px", fontSize: 12, color: C.inkLight, ...mono, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{e.date}</td>
              <td style={{ padding: "11px 14px", fontSize: 13, color: C.inkMid, borderBottom: `1px solid ${C.border}` }}>{e.category}</td>
              <td style={{ padding: "11px 14px", fontSize: 13, color: C.inkLight, borderBottom: `1px solid ${C.border}` }}>{e.label || "—"}</td>
              <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 600, color, ...mono, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
                {isIncome ? "+" : "−"}{fmt(e.amount)}
              </td>
              <td style={{ padding: "11px 10px", borderBottom: `1px solid ${C.border}` }}>
                <button onClick={() => onDelete(e.id, type)} style={{ background: "none", border: "none", cursor: "pointer", color: C.inkLight, padding: 3 }}><X size={13} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── AI Budget Insight ── */
function BudgetInsight({ income, expenses, goal, selectedMonth }) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const totalIncome   = income.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit     = totalIncome - totalExpenses;
  const margin        = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  // Find top expense category
  const expenseByCat = {};
  expenses.forEach(e => { expenseByCat[e.category] = (expenseByCat[e.category] || 0) + e.amount; });
  const topExpense = Object.entries(expenseByCat).sort((a, b) => b[1] - a[1])[0]?.[0] || "none";

  const now = new Date();
  const daysElapsed = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const expectedByNow = Math.round((goal * daysElapsed) / daysInMonth);

  const fetchInsight = async () => {
    if (totalIncome === 0 && totalExpenses === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "budget_insight", context: { month: getMonthLabel(selectedMonth), totalIncome, totalExpenses, netProfit, margin, topExpense, revenueGoal: goal, daysElapsed, expectedByNow } }),
      });
      const data = await res.json();
      if (data.insight) setInsight(data.insight);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchInsight(); }, [selectedMonth, income.length, expenses.length]);

  if (!insight && !loading) return null;

  return (
    <div style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(100,90,180,0.06)", border: "1px solid rgba(100,90,180,0.15)", display: "flex", gap: 10, alignItems: "flex-start" }}>
      <Flame size={13} color="#6a60a0" style={{ marginTop: 2, flexShrink: 0 }} />
      {loading
        ? <p style={{ margin: 0, fontSize: 13, color: "#6a60a0", fontStyle: "italic" }}>Analyzing your numbers...</p>
        : <p style={{ margin: 0, fontSize: 13, color: "#4a4060", lineHeight: 1.65 }}>"{insight}"</p>
      }
    </div>
  );
}

/* ══════════════════════════════════════
   BUDGET TRACKER ROOT
══════════════════════════════════════ */
export default function BudgetTracker({ profile }) {
  const [income,   setIncome]   = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth]       = useState(currentMonthKey());
  const [modal, setModal]       = useState(null); // "income" | "expense" | null

  useEffect(() => {
    const i = localStorage.getItem("el_income");
    const e = localStorage.getItem("el_expenses");
    if (i) setIncome(JSON.parse(i));
    if (e) setExpenses(JSON.parse(e));
  }, []);

  const persist = (newIncome, newExpenses) => {
    localStorage.setItem("el_income",   JSON.stringify(newIncome));
    localStorage.setItem("el_expenses", JSON.stringify(newExpenses));
    window.dispatchEvent(new Event("el_income_updated"));
  };

  const addEntry = (entry, type) => {
    if (type === "income") {
      const updated = [entry, ...income];
      setIncome(updated);
      persist(updated, expenses);
    } else {
      const updated = [entry, ...expenses];
      setExpenses(updated);
      persist(income, updated);
    }
  };

  const deleteEntry = (id, type) => {
    if (type === "income") {
      const updated = income.filter(e => e.id !== id);
      setIncome(updated);
      persist(updated, expenses);
    } else {
      const updated = expenses.filter(e => e.id !== id);
      setExpenses(updated);
      persist(income, updated);
    }
  };

  // Filter by selected month
  const monthIncome   = income.filter(e => getMonthKey(e.date) === month);
  const monthExpenses = expenses.filter(e => getMonthKey(e.date) === month);
  const totalIncome   = monthIncome.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit     = totalIncome - totalExpenses;
  const margin        = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const months = allMonthKeys(income, expenses);
  const goal = profile?.revenueGoal || 10000;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60 }}>
      {modal && <EntryModal mode={modal} onSave={(e) => addEntry(e, modal)} onClose={() => setModal(null)} />}

      {/* Page header */}
      <div style={{ padding: "24px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 10, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>BUDGET TRACKER</p>
          <h1 style={{ margin: 0, fontFamily: fonts.heading, fontSize: 28, fontWeight: 500, color: C.ink }}>{getMonthLabel(month)}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select value={month} onChange={e => setMonth(e.target.value)} style={{ ...inputSx, width: "auto", fontSize: 12, fontFamily: fonts.mono, padding: "8px 12px" }}>
            {months.map(m => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
          </select>
          <button onClick={() => setModal("income")} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6, padding: "9px 16px" }}>
            <Plus size={13} /> Income
          </button>
          <button onClick={() => setModal("expense")} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.redBorder}`, background: C.redLight, color: C.red, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: fonts.body }}>
            <Plus size={13} /> Expense
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Summary Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "Total Income",   value: fmt(totalIncome),   icon: TrendingUp,   color: C.green, border: C.greenBorder, bg: C.greenLight },
            { label: "Total Expenses", value: fmt(totalExpenses), icon: TrendingDown, color: C.red,   border: C.redBorder,   bg: C.redLight   },
            { label: "Net Profit",     value: fmt(netProfit),     icon: DollarSign,   color: netProfit >= 0 ? C.gold : C.red, border: C.goldBorder, bg: C.goldLight },
            { label: "Profit Margin",  value: `${margin}%`,       icon: Percent,      color: margin >= 50 ? C.green : margin >= 30 ? C.gold : C.red, border: margin >= 50 ? C.greenBorder : C.goldBorder, bg: margin >= 50 ? C.greenLight : C.goldLight },
          ].map(({ label, value, icon: Icon, color, border, bg }) => (
            <div key={label} style={{ background: "#fff", border: `1px solid ${C.border}`, borderLeft: `3px solid ${color}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon size={14} color={color} strokeWidth={1.5} />
                <p style={{ margin: 0, fontSize: 9, fontFamily: fonts.mono, color: C.inkLight, letterSpacing: "0.1em" }}>{label.toUpperCase()}</p>
              </div>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color, fontFamily: fonts.mono }}>{value}</p>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <BudgetInsight income={monthIncome} expenses={monthExpenses} goal={goal} selectedMonth={month} />

        {/* Income Table */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: fonts.mono, letterSpacing: "0.06em" }}>INCOME — {getMonthLabel(month)}</h3>
            <button onClick={() => setModal("income")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 7, border: `1px solid ${C.greenBorder}`, background: C.greenLight, color: C.green, fontSize: 11, cursor: "pointer", fontFamily: fonts.mono, fontWeight: 600 }}>
              <Plus size={11} /> LOG INCOME
            </button>
          </div>
          <EntriesTable entries={monthIncome} type="income" onDelete={deleteEntry} />
        </div>

        {/* Expense Table */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: fonts.mono, letterSpacing: "0.06em" }}>EXPENSES — {getMonthLabel(month)}</h3>
            <button onClick={() => setModal("expense")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 7, border: `1px solid ${C.redBorder}`, background: C.redLight, color: C.red, fontSize: 11, cursor: "pointer", fontFamily: fonts.mono, fontWeight: 600 }}>
              <Plus size={11} /> LOG EXPENSE
            </button>
          </div>
          <EntriesTable entries={monthExpenses} type="expense" onDelete={deleteEntry} />
        </div>
      </div>
    </div>
  );
}
