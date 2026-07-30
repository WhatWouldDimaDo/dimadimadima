/* Generates the Brain vault's Place-Directory.md from data.js, so the guide and
   the site can never drift apart. Run after editing data.js. */
global.window = {};
require(require("path").join(__dirname,"../../public/mexico/data.js"));
const fs = require("fs");
const d = window.CDMX;
const CAT = d.categories, WHEN = d.whenLabels;
const tagLabel = t => (d.filterTags.find(x => x.id === t) || {}).label || t;

const conf = { VERIFIED: "✅ confirmed", LIKELY: "🟡 likely", UNVERIFIED: "🔴 check first" };
const travel = p => p.walk != null ? `${p.walk} min walk`
  : p.uber ? `Uber ~${p.uber.min} min · ${p.uber.mxn} MXN` : "—";

let out = `---
title: Place Directory — CDMX
date: 2026-07-29
type: project
tags: [travel, cdmx, reference]
---

# Place Directory

**Generated from the site's \`data.js\` — do not hand-edit.** Rebuild with
\`node make_directory.cjs\` in \`public/mexico/\`. ${d.places.length} places.

Confidence: ✅ checked against an official or reliable source · 🟡 consistent
across sources but not confirmed with the venue · 🔴 call before you go.

Walking times are measured from the middle of Hipódromo.

`;

Object.keys(CAT).forEach(catId => {
  const list = d.places.filter(p => p.cat === catId);
  if (!list.length) return;
  out += `\n---\n\n## ${CAT[catId].icon} ${CAT[catId].label}\n\n`;
  out += `| Place | Where | Getting there | When | Cost | Confidence |\n|---|---|---|---|---|---|\n`;
  list.forEach(p => {
    out += `| **${p.name}** | ${p.colonia} | ${travel(p)} | ${(p.when||[]).map(w=>WHEN[w]).join(", ")} | ${p.cost} | ${conf[p.confidence]} |\n`;
  });
  out += `\n`;
  list.forEach(p => {
    out += `### ${p.name}\n\n`;
    out += `${p.blurb}\n\n`;
    out += `**Why it works.** ${p.benefit}\n\n`;
    out += `- **Where:** ${p.address || p.colonia} · \`${p.lat}, ${p.lng}\`\n`;
    out += `- **Getting there:** ${travel(p)}\n`;
    out += `- **Hours:** ${p.hours}\n`;
    out += `- **Cost:** ${p.cost}${p.duration ? ` · budget ${p.duration}` : ""}\n`;
    out += `- **Tags:** ${(p.tags||[]).map(tagLabel).join(" · ")}\n`;
    out += `- **If it rains:** ${p.rain === "indoor" ? "indoors, fine" : p.rain === "partial" ? "partly covered" : "outdoors — bail"}\n`;
    if (p.notes) out += `- **Worth knowing:** ${p.notes}\n`;
    out += `- **More:** ${p.link}\n`;
    out += `- **Confidence:** ${conf[p.confidence]}\n\n`;
  });
});

out += `\n---\n\n*Generated ${d.updated} · [[README]] · [[Day-1-Wednesday]]*\n`;

fs.writeFileSync(process.argv[2], out);
console.log("wrote", process.argv[2], out.length, "chars");
