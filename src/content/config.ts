import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    tags:        z.array(z.string()),
    url:         z.string().optional(),
    github:      z.string().optional(),
    image:       z.string().optional(),
    featured:    z.boolean().default(false),
    order:       z.number().default(99),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    type:     z.enum(['song', 'image', 'project', 'note']),
    tags:     z.array(z.string()),
    date:     z.date(),
    youtube:  z.string().optional(),
    image:    z.string().optional(),
    caption:  z.string().optional(),
    draft:    z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
