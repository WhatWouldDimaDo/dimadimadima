import { readFile, writeFile } from "node:fs/promises";

const pages = [
  {
    path: "public/tiversproposal/index.html",
    transform(html) {
      const linked = html.replaceAll(
        'href="/communication-analytics"',
        'href="/tiversproposal/communication-analytics"',
      );
      return updateProposalContent(linked);
    },
  },
  {
    path: "public/tiversproposal/communication-analytics/index.html",
    transform(html) {
      return html
        .replaceAll('href="/#collaboration"', 'href="/tiversproposal/#collaboration"')
        .replaceAll('href="/"', 'href="/tiversproposal"');
    },
  },
];

for (const page of pages) {
  const source = await readFile(page.path, "utf8");
  let output = source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<link rel="modulepreload"[^>]*>/g, "")
    .replace(
      /<link rel="stylesheet" href="\/assets\/index-CsM5siYj\.css"[^>]*>/g,
      '<link rel="stylesheet" href="/tiversproposal/assets/site.css"/>',
    )
    .replaceAll(
      "https://tivers-ai-strategy.dperkis.chatgpt.site/og-growth-strategy.png",
      "https://dimadimadima.com/tiversproposal/og-growth-strategy.png",
    )
    .replaceAll(
      "https://tivers-ai-strategy.dperkis.chatgpt.site/favicon.svg",
      "/tiversproposal/favicon.svg",
    )
    .replace(
      /src="\/_vinext\/image\?url=%2Flogos%2F([^&"]+)&amp;w=600&amp;q=75"/g,
      'src="/tiversproposal/logos/$1"',
    )
    .replace(/\s+srcSet="[^"]*"/g, "")
    .replace(/\s+sizes="[^"]*"/g, "")
    .replace(
      /(?:<meta name="robots" content="noindex, nofollow, noarchive"\/>)+/g,
      '<meta name="robots" content="noindex, nofollow, noarchive"/>',
    );

  if (!output.includes('<meta name="robots"')) {
    output = output.replace(
      '<meta name="description"',
      '<meta name="robots" content="noindex, nofollow, noarchive"/><meta name="description"',
    );
  }

  output = page.transform(output).replace(
    "</body>",
    '<script src="/tiversproposal/ui.js"></script></body>',
  );

  await writeFile(page.path, output);
}

function updateProposalContent(html) {
  let output = html.replace(
    /<div class="signal">(?:(?!<div class="signal">)[\s\S])*?<strong>1 decision<\/strong><span>what to tackle first<\/span><\/div>/,
    "",
  );

  const start = output.indexOf('<p class="eyebrow">Eric’s time</p>');
  const end = start === -1 ? -1 : output.indexOf("</ul></article>", start);
  if (start === -1 || end === -1) return output;

  const closeLength = "</ul></article>".length;
  let section = output.slice(start, end + closeLength)
    .replaceAll("About 3 hours total", "7–10 hours total")
    .replaceAll(
      "30 minutes for source access and context",
      "2–3 hours for source access, context, and archive walkthrough",
    )
    .replaceAll("30-minute midpoint reaction", "90-minute midpoint working session")
    .replaceAll("60-minute decision session", "90-minute decision session");

  if (!section.includes("asynchronous review and feedback")) {
    const icon = section.match(/<li>(<svg[\s\S]*?<\/svg>)/)?.[1] ?? "";
    section = section.replace(
      "</ul>",
      `<li>${icon}1–3 hours asynchronous review and feedback</li></ul>`,
    );
  }

  return `${output.slice(0, start)}${section}${output.slice(end + closeLength)}`;
}
