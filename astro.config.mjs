import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Collect slugs of project content files marked `listed: false` so their
// public /projects/<slug> routes (still built for direct sharing) are
// excluded from the sitemap. Parsed with a lightweight frontmatter regex
// since gray-matter isn't a project dependency.
function getUnlistedProjectSlugs() {
  const dir = path.resolve('./src/content/projects');
  const slugs = new Set();
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const frontmatter = raw.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatter && /^listed:\s*false\s*$/m.test(frontmatter[1])) {
      slugs.add(file.replace(/\.md$/, ''));
    }
  }
  return slugs;
}

const unlistedSlugs = getUnlistedProjectSlugs();

export default defineConfig({
  site: 'https://dimadimadima.com',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => {
        const match = page.match(/\/projects\/([^/]+)\/?$/);
        if (match && unlistedSlugs.has(match[1])) return false;
        return true;
      },
    }),
  ],
});
