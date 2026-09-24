import bibRaw from '../../_bibliography/papers.bib?raw';
import { available } from '../i18n/utils';
import { getCleanBibtex, getTitle, getVenue, getYear, parseBibtex } from '../utils/bibtex';

/** Last name used to bold the site owner in author lists. */
export const SELF_LAST_NAME = 'guedje';

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f{}\\'"`^~]/g, '')
    .toLowerCase();

export interface Publication {
  key: string;
  title: string;
  authors: { name: string; self: boolean }[];
  venue: string;
  abbr: string;
  year: number;
  abstract: string;
  selected: boolean;
  links: { kind: 'pdf' | 'code' | 'website' | 'slides'; url: string }[];
  bibtex: string;
}

function splitAuthors(raw: string) {
  return raw
    .split(/\s+and\s+/i)
    .map((a) => a.trim())
    .filter(Boolean)
    .map((a) => {
      if (a.toLowerCase() === 'others') return { name: 'et al.', self: false };
      const name = a.includes(',')
        ? a
            .split(',')
            .map((p) => p.trim())
            .reverse()
            .join(' ')
        : a;
      const clean = name.replace(/[{}]/g, '');
      return { name: clean, self: norm(clean).split(/\s+/).includes(SELF_LAST_NAME) };
    });
}

export const publications: Publication[] = parseBibtex(bibRaw)
  .map((e) => ({
    key: e.key,
    title: getTitle(e),
    authors: splitAuthors(e.fields.author ?? ''),
    venue: getVenue(e).replace(/[{}]/g, ''),
    abbr: e.fields.abbr ?? '',
    year: getYear(e),
    abstract: (e.fields.abstract ?? '').replace(/[{}]/g, ''),
    selected: e.fields.selected?.toLowerCase() === 'true',
    links: (['pdf', 'code', 'website', 'slides'] as const)
      .map((kind) => ({ kind, url: e.fields[kind] ?? '' }))
      .filter((l) => available(l.url)),
    bibtex: getCleanBibtex(e),
  }))
  .sort((a, b) => b.year - a.year);

export const publicationsByKey = new Map(publications.map((p) => [p.key, p]));
