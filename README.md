# Prince Gédéon GUEDJE — academic website

Astro + Tailwind CSS, static HTML, bilingual (English at `/`, French at `/fr/`).

## Update content (no HTML needed)

| What | File |
| --- | --- |
| Bio, headline, socials, education, experience, research interests | `src/data/profile.json` |
| News | `src/data/news.json` |
| Publications | `_bibliography/papers.bib` |
| Projects | `src/data/projects.json` |
| Talks | `src/data/talks.json` (`"draft": true` hides an entry) |
| Awards | `src/data/awards.json` |
| Certifications | `src/data/certifications.json` |
| Teaching (one page per course) | `src/data/teaching.json` |
| Skills | `src/data/skills.json` |
| UI labels (EN/FR) | `src/i18n/ui.ts` |

Every text has an `en` and a `fr` version. Dates use `YYYY-MM`. Lists are sorted automatically.
A malformed JSON file makes the build fail with a clear message.

### Files (PDF, images)

Drop files in `public/` (`img/`, `cv/`, `certificates/`, `teaching/<course-id>/`, `talks/`, `papers/`, `projects/`).
A badge such as `[PDF]` or `[Slides]` only appears once the referenced file exists.

### Socials

`profile.json → socials`: set `url` and `"enabled": true`. Supported ids:
`email, googlescholar, github, linkedin, orcid, arxiv, x, instagram`.
The email is stored as `user` + `domain` and never appears in clear text in the HTML.

### Publications

In `papers.bib`, your name is bolded automatically. Extra display fields:
`abbr`, `abstract`, `pdf`, `code`, `website`, `slides`, `selected = {true}` (shown on the home page).

## Commands

```bash
corepack yarn install
corepack yarn dev      # http://localhost:4321
corepack yarn build    # astro check (types) + static build into dist/
```

## Deployment

Push to `main`. `.github/workflows/deploy.yml` builds and publishes to GitHub Pages
(Settings → Pages → Source: **GitHub Actions**). The repository should be named
`princeGedeon.github.io`; otherwise set the repository variable `ASTRO_BASE=/repo-name`.
