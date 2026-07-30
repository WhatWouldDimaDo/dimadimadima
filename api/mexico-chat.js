// api/mexico-chat.js
// Vercel serverless function — chat backend for the Condesa Days guide assistant.
//
// Stateless by design: this function never writes anything anywhere. When the
// model proposes a change to the guide (add a place, put something on a day,
// mark somewhere visited, leave a note) it comes back as an OpenAI-style
// tool_call in the response, and the browser applies it to its own
// localStorage — see public/mexico/chat.js. The only thing this function
// resolves itself is search_web, because that's a read, not a write.
//
// OPENROUTER_API_KEY lives in Vercel env only. It is never echoed back in a
// response and never logged.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const CHAT_MODEL = "anthropic/claude-sonnet-4.5";

const MAX_MESSAGES = 30;         // trims older turns before they reach the model
const MAX_MESSAGE_CHARS = 4000;  // per-message content cap
const MAX_CONTEXT_CHARS = 30000; // cap on the serialised guide context
const MAX_TOKENS = 900;          // completion cap
const MAX_TOOL_LOOPS = 3;        // internal search_web resolution loops

// ───────────────────────── rate limiting ─────────────────────────
// In-memory, per-IP. This resets on every cold start (Vercel functions are
// not long-lived processes) and is trivially bypassed by anyone rotating IPs
// or hitting a fresh instance. It is a speed bump against casual abuse of an
// unauthenticated endpoint, not real defence — see CHAT-SETUP.md for the
// honest version of that caveat and what real defence would look like.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map(); // ip -> [timestamp, ...]

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Guard against unbounded Map growth on a long-lived instance under a churn
  // of distinct IPs — not expected to matter in practice, cheap to have.
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

// ───────────────────────── tool schemas ─────────────────────────
const CATEGORY_ENUM = ["park", "market", "food", "cafe", "culture", "bike", "outing", "wellness"];
const WHEN_ENUM = ["morning", "comida", "afternoon", "evening"];
const DAY_ENUM = ["wed", "thu", "fri", "sat", "sun", "mon"];
const SLOT_ENUM = ["early", "morning", "comida", "afternoon", "adults"];

const TOOLS = [
  {
    type: "function",
    function: {
      name: "add_place",
      description:
        "Add a new place to the user's guide. Only real, checkable places — never invent an address, " +
        "phone number or business. If you are not confident in the coordinates, still provide your best " +
        "estimate but set coords_unconfirmed to true so the app can flag it for the user to verify.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The place's name." },
          category: { type: "string", enum: CATEGORY_ENUM },
          colonia: { type: "string", description: "Neighbourhood, e.g. Condesa, Roma Norte." },
          address: { type: "string" },
          lat: { type: "number", description: "Decimal degrees, WGS84." },
          lng: { type: "number", description: "Decimal degrees, WGS84." },
          coords_unconfirmed: {
            type: "boolean",
            description: "true if lat/lng are an estimate rather than a confirmed source — set this honestly."
          },
          blurb: { type: "string", description: "A short, plain description of the place." },
          why_it_works: { type: "string", description: "Why it fits this family's constraints, or leave out if it doesn't clearly fit." },
          when: { type: "array", items: { type: "string", enum: WHEN_ENUM } },
          cost: { type: "string" },
          hours: { type: "string", description: "If unknown, say so explicitly rather than guessing — e.g. \"not confirmed\"." },
          link: { type: "string" },
          tags: { type: "array", items: { type: "string" } }
        },
        required: ["name", "category"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_to_itinerary",
      description: "Put a place into a specific day and time block of the itinerary.",
      parameters: {
        type: "object",
        properties: {
          place_id: { type: "string", description: "Preferred if you know it." },
          place_name: { type: "string", description: "Used to look the place up if place_id is not known." },
          day: { type: "string", enum: DAY_ENUM },
          slot: { type: "string", enum: SLOT_ENUM },
          note: { type: "string" }
        },
        required: ["day", "slot"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "mark_visited",
      description: "Mark a place as visited.",
      parameters: {
        type: "object",
        properties: {
          place_id: { type: "string" },
          place_name: { type: "string" },
          date: { type: "string", description: "ISO date (YYYY-MM-DD). Omit to use today." },
          note: { type: "string" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_note",
      description: "Attach a free-text note to a place, without marking it visited or scheduling it.",
      parameters: {
        type: "object",
        properties: {
          place_id: { type: "string" },
          place_name: { type: "string" },
          note: { type: "string" }
        },
        required: ["note"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_web",
      description:
        "Look something up on the current web — opening hours, whether a place still exists, prices, " +
        "an address you don't have. Call this on its own, not combined with other tool calls in the same " +
        "reply, since you need the result back before acting on it.",
      parameters: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"]
      }
    }
  }
];

// ───────────────────────── system prompt ─────────────────────────
function systemPrompt(context) {
  let ctxStr = "";
  try { ctxStr = JSON.stringify(context); } catch (e) { ctxStr = "{}"; }
  if (ctxStr.length > MAX_CONTEXT_CHARS) {
    ctxStr = ctxStr.slice(0, MAX_CONTEXT_CHARS) + '..."[truncated]"';
  }

  return [
    "You are the in-page assistant for Condesa Days, a working travel guide to Mexico City for a family ",
    "with young children, based in Hipódromo/Condesa. You can answer questions about the guide, and you ",
    "can change the user's copy of it using tools: adding places, putting things on the itinerary, marking ",
    "places visited, and attaching notes.\n\n",

    "Household constraints, which the guide is built around and which you must respect when judging whether ",
    "something fits a day:\n",
    "- A nap anchors the late morning (roughly 11:00–13:00). It is the one fixed point in the day — don't ",
    "  schedule anything across it.\n",
    "- The main meal (comida) is early afternoon, roughly 13:00–14:30.\n",
    "- Kids have an early dinner, around 18:00–19:00, then bedtime — anything scheduled 18:00–21:00 is a gamble.\n",
    "- Adults go out only after bedtime (21:00+), and only within a couple of blocks of home — nothing that ",
    "  requires travel time eats into the little time available.\n\n",

    "Rules:\n",
    "- Prefer walkable places over ones that need an Uber, all else equal.\n",
    "- Be honest when something does not fit. Do not make a place sound workable if the timing, distance or ",
    "  crowd doesn't actually suit a toddler and a nap schedule — say plainly that it doesn't fit and why.\n",
    "- Write in British English. Plain, direct language — no marketing copy, no exclamation marks, no ",
    "  '✨ must-see hidden gem' phrasing.\n",
    "- Never invent coordinates, prices or opening hours. If you don't know something, say you don't know and ",
    "  mark it as needing checking, rather than guessing and presenting the guess as fact.\n",
    "- When you add a place with add_place, you must supply real coordinates if you have them, or set ",
    "  coords_unconfirmed to true and say so in your reply — never silently make coordinates up.\n",
    "- Use search_web when you need a fact you don't have (current hours, whether somewhere has closed, a ",
    "  price). Call it alone, not alongside other tools in the same reply — you need the result back first.\n",
    "- If search_web comes back saying it isn't available, say that plainly rather than answering as if you'd ",
    "  found something.\n\n",

    "Current guide data, the user's plan, and their own added places (JSON):\n",
    ctxStr
  ].join("");
}

// ───────────────────────── OpenRouter calls ─────────────────────────
async function callOpenRouter(messages, extra) {
  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://dimadimadima.com/mexico/",
      "X-Title": "Condesa Days chat"
    },
    body: JSON.stringify(
      Object.assign(
        { model: CHAT_MODEL, messages, max_tokens: MAX_TOKENS },
        extra
      )
    )
  });
  let data;
  try {
    data = await r.json();
  } catch (e) {
    throw new Error("Model provider returned an unreadable response");
  }
  if (data.error) {
    throw new Error((data.error && data.error.message) || "Model provider error");
  }
  return data;
}

// search_web is implemented server-side by calling OpenRouter's web plugin.
// If that fails or is unavailable, this returns a clear "not available"
// message rather than fabricating a result — the model is instructed to
// pass that along honestly.
async function searchWeb(query) {
  const q = String(query || "").slice(0, 500);
  if (!q) return "No search query was given.";
  try {
    const data = await callOpenRouter(
      [
        {
          role: "system",
          content:
            "Answer the query using current web results. Be brief and factual, plain British English. " +
            "If you cannot find a reliable answer, say so plainly instead of guessing."
        },
        { role: "user", content: q }
      ],
      { max_tokens: 500, plugins: [{ id: "web", max_results: 5 }] }
    );
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    return text || "Web search returned nothing usable for that query.";
  } catch (e) {
    return "Web search is not available right now (" + e.message + "). Say this plainly rather than guessing at an answer.";
  }
}

// Runs the chat, resolving any search_web-only tool calls server-side by
// looping back to the model with the result. Stops and hands control back to
// the client as soon as the model's reply contains anything it can't resolve
// itself (no tool calls, or any non-search tool call). Returns every message
// generated in the process, in order, so the client can append the whole
// batch to its local history and stay in sync with what the model actually saw.
async function runChat(seedMessages) {
  const messages = seedMessages.slice();
  const startLen = messages.length;

  for (let loop = 0; loop < MAX_TOOL_LOOPS; loop++) {
    const data = await callOpenRouter(messages, { tools: TOOLS });
    const choice = data.choices && data.choices[0];
    const msg = choice && choice.message;
    if (!msg) throw new Error("No response from the model");

    const calls = msg.tool_calls || [];
    const allSearch = calls.length > 0 && calls.every((c) => c.function && c.function.name === "search_web");

    if (!allSearch) {
      messages.push(msg);
      return messages.slice(startLen);
    }

    messages.push(msg);
    for (const call of calls) {
      let args = {};
      try { args = JSON.parse(call.function.arguments || "{}"); } catch (e) {}
      const answer = await searchWeb(args.query);
      messages.push({ role: "tool", tool_call_id: call.id, name: "search_web", content: answer });
    }
    // loop again with the search result(s) folded in
  }

  throw new Error("Took too many steps to answer — try rephrasing");
}

// ───────────────────────── handler ─────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      error: "The chat assistant isn't configured yet — OPENROUTER_API_KEY is missing on the server. See scripts/mexico/CHAT-SETUP.md."
    });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", "600");
    return res.status(429).json({ error: "Too many messages from this connection. Wait a few minutes and try again." });
  }

  const body = req.body || {};
  let messages = Array.isArray(body.messages) ? body.messages : null;
  const context = body.context && typeof body.context === "object" ? body.context : {};

  if (!messages || !messages.length) {
    return res.status(400).json({ error: "messages is required and must be a non-empty array" });
  }

  // Cap message count and per-message size so one call can't run away.
  if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
  messages = messages.map((m) => ({
    role: m && m.role,
    content: typeof (m && m.content) === "string" ? m.content.slice(0, MAX_MESSAGE_CHARS) : (m && m.content) || null,
    tool_calls: m && m.tool_calls,
    tool_call_id: m && m.tool_call_id,
    name: m && m.name
  }));

  const sys = { role: "system", content: systemPrompt(context) };

  try {
    const generated = await runChat([sys, ...messages]);
    return res.status(200).json({ messages: generated });
  } catch (err) {
    // Never leak the raw upstream error verbatim (could theoretically echo
    // request internals); keep it short and generic.
    return res.status(502).json({ error: "Could not get a response from the model provider. Try again in a moment." });
  }
}
