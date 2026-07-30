import crypto from "node:crypto";

const EXPECTED_TOKEN = "67d3439d871db1d81d79308a3eaf7d24343316ad440f339653c8e67e503b1284";

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).send("Method not allowed");
  }

  const body =
    typeof request.body === "string"
      ? Object.fromEntries(new URLSearchParams(request.body))
      : request.body ?? {};
  const password = String(body.password ?? "");
  const token = crypto.createHash("sha256").update(`tivers-ai:${password}`).digest("hex");
  const returnTo = safeReturnPath(String(body.returnTo ?? "/tiversproposal"));

  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(EXPECTED_TOKEN))) {
    const loginUrl = `/tivers-login?error=1&returnTo=${encodeURIComponent(returnTo)}`;
    return response.redirect(303, loginUrl);
  }

  response.setHeader(
    "Set-Cookie",
    `tivers_access=${EXPECTED_TOKEN}; Path=/tiversproposal; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
  );
  return response.redirect(303, returnTo);
}

function safeReturnPath(value) {
  if (!value.startsWith("/tiversproposal") || value.startsWith("//")) {
    return "/tiversproposal";
  }
  try {
    const parsed = new URL(value, "https://dimadimadima.com");
    return parsed.origin === "https://dimadimadima.com"
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : "/tiversproposal";
  } catch {
    return "/tiversproposal";
  }
}
