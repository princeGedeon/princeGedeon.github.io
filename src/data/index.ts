import { z } from 'astro/zod';

import awardsRaw from './awards.json';
import certificationsRaw from './certifications.json';
import newsRaw from './news.json';
import profileRaw from './profile.json';
import projectsRaw from './projects.json';
import skillsRaw from './skills.json';
import talksRaw from './talks.json';
import teachingRaw from './teaching.json';

/** A string translated in every supported language. */
const L = z.object({ en: z.string(), fr: z.string() });
const LList = z.object({ en: z.array(z.string()), fr: z.array(z.string()) });
/** YYYY-MM or YYYY-MM-DD */
const Month = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'date must be YYYY-MM');

const SocialId = z.enum([
  'email',
  'googlescholar',
  'github',
  'linkedin',
  'orcid',
  'arxiv',
  'x',
  'instagram',
]);

const Interest = L.extend({ children: z.array(L).optional() });

const profileSchema = z.object({
  name: z.string(),
  shortName: z.string(),
  headline: L,
  affiliation: L,
  location: L,
  photo: z.string(),
  email: z.object({ user: z.string(), domain: z.string() }),
  seeking: L,
  cv: L,
  socials: z.array(
    z.object({ id: SocialId, label: z.string(), url: z.string(), enabled: z.boolean() }),
  ),
  bio: LList,
  pillars: z.array(L),
  researchInterests: z.array(Interest),
  education: z.array(
    z.object({ period: z.string(), degree: L, institution: z.string(), details: LList }),
  ),
  experience: z.array(
    z.object({
      period: z.string(),
      role: L,
      organization: z.string(),
      location: z.string(),
      details: LList,
    }),
  ),
  volunteering: z.array(z.object({ organization: z.string(), details: L })),
  languages: z.array(L),
  references: L,
  /** Show the References section on the CV page. */
  showReferences: z.boolean().default(false),
  /** Home layout: 'sidebar' (classic, photo on the side) or 'hero' (large photo on top). Preview the other with ?dev=1. */
  homeLayout: z.enum(['sidebar', 'hero']).default('sidebar'),
  seo: z
    .object({
      /** Search keywords for <meta name="keywords">. */
      keywords: z.array(z.string()).default([]),
      /** Google Search Console verification code (leave empty to disable). */
      googleVerification: z.string().default(''),
      alumniOf: z.array(z.string()).default([]),
    })
    .default({ keywords: [], googleVerification: '', alumniOf: [] }),
});

const newsSchema = z.array(z.object({ date: Month, en: z.string(), fr: z.string() }));

const projectsSchema = z.array(
  z.object({
    id: z.string(),
    featured: z.boolean().default(false),
    period: z.string(),
    title: L,
    context: L,
    summary: L,
    highlights: LList,
    tags: z.array(z.string()),
    repo: z.string().default(''),
    paper: z.string().optional(),
    /** Local path or URL to a PDF (thesis, report). */
    pdf: z.string().default(''),
    figure: z.string().default(''),
    video: z.string().default(''),
  }),
);

const skillsSchema = z.array(z.object({ category: L, items: z.array(z.string()) }));

const certificationsSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    issuer: z.string(),
    date: Month,
    credentialId: z.string().default(''),
    verifyUrl: z.string().default(''),
    pdf: z.string().default(''),
    thumbnail: z.string().default(''),
    skills: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
);

const teachingSchema = z.array(
  z.object({
    id: z.string(),
    title: L,
    institution: z.string(),
    role: L,
    date: Month,
    hours: z.number().optional(),
    level: L,
    /** Language(s) the course was taught in, e.g. ["fr"] or ["en"]. */
    language: z.array(z.enum(['en', 'fr'])).default([]),
    summary: L,
    syllabus: LList,
    materials: z.array(z.object({ label: L, url: z.string() })),
  }),
);

const talksSchema = z.array(
  z.object({
    id: z.string(),
    date: Month,
    title: L,
    event: L,
    location: z.string(),
    type: L,
    slides: z.string().default(''),
    video: z.string().default(''),
    draft: z.boolean().default(false),
  }),
);

const awardsSchema = z.array(z.object({ date: Month, title: L, issuer: z.string(), details: L }));

function parse<T extends z.ZodTypeAny>(name: string, schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`[data] src/data/${name}.json is invalid:\n${result.error.message}`);
  }
  return result.data;
}

const byDateDesc = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

export const profile = parse('profile', profileSchema, profileRaw);
export const news = parse('news', newsSchema, newsRaw).sort(byDateDesc);
export const projects = parse('projects', projectsSchema, projectsRaw);
export const skills = parse('skills', skillsSchema, skillsRaw);
export const certifications = parse('certifications', certificationsSchema, certificationsRaw).sort(
  byDateDesc,
);
export const teaching = parse('teaching', teachingSchema, teachingRaw).sort(byDateDesc);
export const talks = parse('talks', talksSchema, talksRaw)
  .filter((t) => !t.draft)
  .sort(byDateDesc);
export const awards = parse('awards', awardsSchema, awardsRaw).sort(byDateDesc);

export type Profile = typeof profile;
export type Project = (typeof projects)[number];
export type SocialLink = Profile['socials'][number];
