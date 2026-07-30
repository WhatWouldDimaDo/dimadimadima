import { readFile, writeFile } from "node:fs/promises";

const pages = [
  {
    path: "public/tiversproposal/index.html",
    transform(html) {
      return html.replaceAll(
        'href="/communication-analytics"',
        'href="/tiversproposal/communication-analytics"',
      );
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
      /<link rel="stylesheet" href="\/assets\/index-[^"]+\.css"[^>]*>/g,
      '<link rel="stylesheet" href="/tiversproposal/assets/site.css"/>',
    )
    .replace(
      /https:\/\/[^"]+\/og-growth-strategy\.png/g,
      "https://dimadimadima.com/tiversproposal/og-growth-strategy.png",
    )
    .replace(
      /https:\/\/[^"]+\/favicon\.svg/g,
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
