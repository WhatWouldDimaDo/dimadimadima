import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: "Dima Perkis",
    description: "Creative feed — songs, images, projects, and notes from Dima Perkis.",
    site: context.site!.toString(),
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.caption ?? '',
      link: `/feed/#${post.slug}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
