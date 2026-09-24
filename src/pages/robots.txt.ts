import type { APIRoute } from 'astro';

import { localizePath } from '../i18n/utils';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(localizePath('/sitemap.xml', 'en'), site ?? 'http://localhost').href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
