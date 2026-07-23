import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description:      z.string(),
    shortDescription: z.string().optional(),
    tags:             z.array(z.string()),
    date:        z.date().optional(),
    url:         z.string().optional(),
    image:       z.string().optional(),
    images:      z.array(z.string()).optional(),
    featured:    z.boolean().default(false),
    listed:      z.boolean().default(true),
    order:       z.number().default(99),
    status:      z.string().optional(),
    caseStudy:   z.boolean().default(false),
    ctaLabel:    z.string().optional(),
    proof:       z.array(z.string()).optional(),
    buildTools:  z.array(z.object({
      name:   z.string(),
      detail: z.string(),
    })).optional(),
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
    embed:    z.string().optional(),
    image:    z.string().optional(),
    caption:  z.string().optional(),
    draft:    z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
