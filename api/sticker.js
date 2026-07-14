// Serverless sticker generation: prompt -> coloring-book line art (base64 PNG).
// OPENROUTER_API_KEY lives in Vercel env, never in the client.

const STYLES = {
  coloring:
    "coloring-book style sticker, thick black outlines, no shading, no gray fill, " +
    "white background, simple friendly shapes a 4-year-old can color in: ",
  story:
    "coloring-book style sticker scene of little kids as the heroes, thick black outlines, " +
    "no shading, white background, playful and friendly: ",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { prompt, mode = "coloring" } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.length > 300) {
    return res.status(400).json({ error: "prompt required (max 300 chars)" });
  }
  const style = STYLES[mode] || STYLES.coloring;
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [{ role: "user", content: style + prompt }],
    }),
  });
  const data = await r.json();
  if (data.error) return res.status(502).json({ error: data.error.message || "upstream" });
  const images = data.choices?.[0]?.message?.images || [];
  if (!images.length) return res.status(502).json({ error: "no image returned" });
  return res.status(200).json({ image: images[0].image_url.url });
}
