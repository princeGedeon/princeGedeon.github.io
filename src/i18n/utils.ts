import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { defaultLang, type Lang, languages, ui, type UiKey } from './ui';

export function isLang(value: string | undefined): value is Lang {
  return !!value && value in languages;
}

export function useTranslations(lang: Lang) {
  return (key: UiKey): string => ui[lang][key] ?? ui[defaultLang][key];
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an absolute site path with the configured base. External URLs are returned as-is. */
export function asset(path: string): string {
  if (!path || /^(https?:|mailto:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Route path (e.g. '/cv/') → localized URL path (e.g. '/fr/cv/'). */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return asset(lang === defaultLang ? clean : `/${lang}${clean}`);
}

/** Current URL pathname → { lang, route path without base/lang prefix }. */
export function parsePath(pathname: string): { lang: Lang; path: string } {
  let p = pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length) || '/';
  const seg = p.split('/')[1];
  if (isLang(seg) && seg !== defaultLang) {
    return { lang: seg, path: p.slice(seg.length + 1) || '/' };
  }
  return { lang: defaultLang, path: p };
}

/**
 * True when a local file exists in public/ (or when the URL is external).
 * Used to hide [PDF]/[Slides] badges until the file is actually dropped in.
 */
export function available(path: string | undefined): boolean {
  if (!path) return false;
  if (/^(https?:|mailto:)/.test(path)) return true;
  return existsSync(join(process.cwd(), 'public', path));
}

/** 'YYYY-MM' → 'Aug 2026' / 'août 2026'. */
export function formatMonth(date: string, lang: Lang, style: 'short' | 'long' = 'short'): string {
  const [y, m] = date.split('-').map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    month: style,
    year: 'numeric',
    timeZone: 'UTC',
  });
}
