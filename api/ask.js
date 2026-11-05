// Vercel serverless function: the app's AI requests go through here,
// so the Anthropic API key stays on the server (env var ANTHROPIC_API_KEY).
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in Vercel" });

  const { input, images = [] } = req.body || {};
  if (!input) return res.status(400).json({ error: "input is required" });
  if (images.length > 2) return res.status(400).json({ error: "too many images" });

  // input is either a prompt string or [{role, content}] turns ending on a user turn
  const turns = typeof input === "string" ? [{ role: "user", content: input }] : input.slice(-20);
  const messages = turns.map((t, i) => {
    const last = i === turns.length - 1;
    if (!last || !images.length) return { role: t.role, content: String(t.content).slice(0, 12000) };
    return {
      role: "user",
      content: [
        ...images.map(im => ({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } })),
        { type: "text", text: String(t.content).slice(0, 12000) },
      ],
    };
  });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 2048, messages }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status === 429 ? 429 : 502).json({ error: data?.error?.message || "AI error" });
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    return res.status(200).json({ text, truncated: data.stop_reason === "max_tokens" });
  } catch (e) {
    return res.status(502).json({ error: "Could not reach the AI service" });
  }
}

