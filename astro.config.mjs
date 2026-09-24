import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import Icons from 'unplugin-icons/vite';

// https://astro.build/config
// For a user page (https://<username>.github.io) keep base '/'.
// For a project page, set ASTRO_BASE='/repo-name'.
export default defineConfig({
  site: process.env.ASTRO_SITE ?? 'https://princegedeon.github.io',
  base: process.env.ASTRO_BASE ?? '/',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    // Icons compile to inline SVG at build time (zero client JS).
    plugins: [tailwindcss(), Icons({ compiler: 'astro' })],
  },
});
