export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  const { type, context, messages } = req.body || {};

  const SYSTEM = "You are a sharp, direct COO-level business advisor. No fluff, no cheerleading. Give facts and next moves. Return only valid JSON when asked for JSON — no markdown fences, no extra text.";

  let userPrompt = "";
  let isChat = false;

  if (type === "daily_actions") {
    const leads = (context?.leads || [])
      .filter(l => l.status !== "Closed" && l.status !== "Lost")
      .map(l => `${l.name} (${l.status}, $${l.dealValue || "?"}, last contact: ${l.lastFollowUp || "unknown"})`)
      .join(", ") || "no leads in system";

    userPrompt = `Business data:
- Founder: ${context?.name || "the founder"}, ${context?.coachType || "coach/consultant"}
- Revenue goal this month: $${context?.revenueGoal || 10000}
- Income logged so far this month: $${context?.currentIncome || 0}
- Remaining to hit goal: $${Math.max(0, (context?.revenueGoal || 10000) - (context?.currentIncome || 0))}
- Days left in month: ${context?.daysLeft || 15}
- Today's target (remaining ÷ days left): $${context?.todayTarget || 0}
- Primary offer price: $${context?.offerPrice || 1500}
- Active leads: ${leads}

Generate 3 specific daily revenue actions ranked by dollar impact. Use real lead names when referencing follow-ups. Each action must be doable in under 2 hours.

Return ONLY this JSON:
{
  "todayTarget": ${context?.todayTarget || 0},
  "actions": [
    { "rank": 1, "action": "specific task", "impact": 3000, "type": "follow_up" },
    { "rank": 2, "action": "specific task", "impact": 1500, "type": "content" },
    { "rank": 3, "action": "specific task", "impact": 500, "type": "outreach" }
  ],
  "topAction": "single most important action in 8 words or less"
}`;

  } else if (type === "budget_insight") {
    userPrompt = `Analyze this founder's financial data and give one sharp, specific insight.

Month: ${context?.month}
Total income: $${context?.totalIncome || 0}
Total expenses: $${context?.totalExpenses || 0}
Net profit: $${context?.netProfit || 0}
Profit margin: ${context?.margin || 0}%
Largest expense category: ${context?.topExpense || "unknown"}
Revenue goal: $${context?.revenueGoal || 10000}
Days elapsed in month: ${context?.daysElapsed || 15}
Expected income by now (pro-rated): $${context?.expectedByNow || 0}

Return ONLY this JSON:
{
  "insight": "one or two sharp sentences with a specific observation and a concrete recommendation"
}`;

  } else if (type === "lead_alerts") {
    const leads = context?.leads || [];
    const now = new Date();
    const stale = leads.filter(l => {
      if (!l.lastFollowUp || l.status === "Closed" || l.status === "Lost") return false;
      const last = new Date(l.lastFollowUp);
      const days = Math.floor((now - last) / 86400000);
      return days >= 3;
    }).map(l => {
      const days = Math.floor((now - new Date(l.lastFollowUp)) / 86400000);
      return `${l.name} (${l.status}, ${days} days since contact, $${l.dealValue || "?"})`;
    });

    if (stale.length === 0) {
      return res.json({ alerts: [] });
    }

    userPrompt = `These leads haven't been contacted recently. Generate short, direct follow-up alerts (1 sentence each, COO tone).

Stale leads: ${stale.join(" | ")}

Return ONLY this JSON:
{
  "alerts": [
    { "name": "lead name", "message": "direct one-sentence alert about this specific lead" }
  ]
}`;

  } else if (type === "copilot_chat") {
    isChat = true;
    // messages is an array of {role, content} — pass directly
  } else {
    return res.status(400).json({ error: "Unknown type" });
  }

  try {
    const body = isChat
      ? { model: "claude-sonnet-4-6", max_tokens: 1024, system: SYSTEM, messages: messages || [] }
      : { model: "claude-sonnet-4-6", max_tokens: 1024, system: SYSTEM, messages: [{ role: "user", content: userPrompt }] };

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify(body),
    });

    if (!r.ok) return res.status(502).json({ error: await r.text() });

    const data = await r.json();
    const text = (data.content?.[0]?.text || "").trim();

    if (isChat) return res.json({ reply: text });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "No JSON in response", raw: text });
    return res.json(JSON.parse(match[0]));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
