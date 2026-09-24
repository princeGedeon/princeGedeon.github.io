import type { APIRoute } from 'astro';

import { teaching } from '../data';
import { type Lang, languages, routes } from '../i18n/ui';
import { localizePath } from '../i18n/utils';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost');
  const paths = [...routes.map((r) => r.path), ...teaching.map((c) => `/teaching/${c.id}/`)];
  const langs = Object.keys(languages) as Lang[];

  const urls = paths.flatMap((p) =>
    langs.map((lang) => {
      const alt = langs
        .map(
          (l) =>
            `<xhtml:link rel="alternate" hreflang="${l}" href="${new URL(localizePath(p, l), origin).href}"/>`,
        )
        .join('');
      return `<url><loc>${new URL(localizePath(p, lang), origin).href}</loc>${alt}</url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
