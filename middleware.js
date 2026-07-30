import { next, rewrite } from "@vercel/functions";

const EXPECTED_TOKEN = "67d3439d871db1d81d79308a3eaf7d24343316ad440f339653c8e67e503b1284";

export default function middleware(request) {
  const suppliedToken = readCookie(request.headers.get("cookie"), "tivers_access");
  if (suppliedToken === EXPECTED_TOKEN) return next();

  const requestedUrl = new URL(request.url);
  const loginUrl = new URL("/tivers-login", requestedUrl);
  loginUrl.searchParams.set(
    "returnTo",
    `${requestedUrl.pathname}${requestedUrl.search}${requestedUrl.hash}`,
  );
  return rewrite(loginUrl);
}

export const config = {
  matcher: ["/tiversproposal", "/tiversproposal/:path*"],
};

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  for (const entry of cookieHeader.split(";")) {
    const [key, ...value] = entry.trim().split("=");
    if (key === name) return value.join("=");
  }
  return null;
}
