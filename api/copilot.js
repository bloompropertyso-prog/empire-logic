export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { type, context } = req.body || {};

  const leadList = (context?.leads || [])
    .filter((l) => l.name)
    .map((l) => `${l.name} ($${l.dealSize || "?"})`)
    .join(", ") || "no leads entered yet";

  const prompts = {
    revenue_actions: `You are a sharp COO-level business advisor for a founder named ${context?.name || "the founder"}.

Business snapshot:
- Active leads: ${leadList}
- Core offer price: $${context?.offerPrice || 1500}
- Posting frequency: ${context?.postingFreq || 3} posts/week
- Total pipeline value: $${context?.pipelineValue || 0}
- Days since last follow-up logged: ${context?.daysSinceFollowup || 0}
- Monthly revenue goal: $${context?.revenueGoal || 20000}
- Current monthly revenue: $${context?.currentRevenue || 0}

Generate exactly 3 prioritized revenue actions for today, ranked by likely dollar impact. Be SPECIFIC — use lead names if provided. Each action must be executable within 2 hours. The impact number should be a realistic estimate of pipeline value this action could unlock or close.

Return ONLY this JSON (no markdown, no extra text):
{
  "actions": [
    { "rank": 1, "action": "specific executable task using real names if available", "impact": 4800, "why": "one direct sentence explaining why this is the highest leverage move" },
    { "rank": 2, "action": "specific executable task", "impact": 1200, "why": "one direct sentence" },
    { "rank": 3, "action": "specific executable task", "impact": 800, "why": "one direct sentence" }
  ],
  "nonNegotiable": "6 words or less — the single most important thing they must do today"
}`,

    observations: `You are a sharp COO-level business advisor. No cheerleading. Generate 1-2 blunt, data-driven observations this founder needs to hear today.

Business data:
- Days since last follow-up logged: ${context?.daysSinceFollowup ?? 0}
- Posts published this week: ${context?.postsThisWeek ?? 0}
- Of those, posts WITH a CTA: ${context?.postsWithCTA ?? 0}
- Average deal size: $${context?.avgDealSize ?? 0}
- Monthly revenue goal: $${context?.monthlyGoal ?? 20000}
- Current monthly revenue: $${context?.currentRevenue ?? 0}
- Revenue-generating actions logged today: ${context?.actionsToday ?? 0}
- Days since last revenue action (planning mode): ${context?.planningDays ?? 0}

Rules: Be direct. Use their actual numbers. No fluff. COO tone, not motivational speaker.
If data is sparse, give smart default observations about follow-up cadence and content CTAs.

Return ONLY this JSON:
{
  "observations": [
    { "type": "warning", "text": "sharp, specific observation using their data" },
    { "type": "insight", "text": "data-backed observation with a specific recommendation" }
  ]
}`,

    weekly_insight: `Based on these logged business actions, generate one specific insight about what's performing best. Be precise — include percentages or rates if calculable.

Action log: ${JSON.stringify(context?.actionLog || [])}

Return ONLY this JSON:
{
  "insight": "one specific sentence with the key performance finding and a concrete recommendation to do more of it"
}`,
  };

  const prompt = prompts[type];
  if (!prompt) return res.status(400).json({ error: "Invalid type. Must be: revenue_actions, observations, or weekly_insight" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system:
          "You are a sharp COO-level business advisor. Return ONLY valid JSON as specified — no markdown fences, no explanation, no extra keys. Just the raw JSON object.",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Anthropic API error: ${errText}` });
    }

    const data = await response.json();
    const rawText = (data.content?.[0]?.text || "").trim();

    // Extract JSON safely
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ error: "AI response did not contain valid JSON", raw: rawText });
    }

    const parsed = JSON.parse(match[0]);
    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
