# AGENTS.md

This repository contains a standalone Hugo site for Pathfinder Financial Services, LLC.
It is a small static site with Hugo templates, Markdown/HTML content, localized assets, and one vanilla JS behavior file.

Use this document as the default operating guide for coding agents working in this repo.

## Project Shape

- Site config lives in `hugo.yaml`.
- Theme files live in `themes/pathfinder/`.
- Page content lives in `content/`.
- Local static assets live in `static/`.
- Generated output lives in `public/` and is ignored by git.

## Repository-Specific Rules

- No Cursor rules were found in `.cursor/rules/`.
- No `.cursorrules` file was found.
- No Copilot instructions were found in `.github/copilot-instructions.md`.
- If any of those files are added later, merge their guidance into this file and follow the more specific rule.

## Primary Commands

### Build

- Full production-style build:

```bash
hugo --cleanDestinationDir
```

- Standard build:

```bash
hugo
```

### Local Preview

- Start the local dev server:

```bash
hugo server
```

- Start the dev server and bind to all interfaces if needed:

```bash
hugo server --bind 0.0.0.0
```

### Lint / Validation

There is no dedicated lint command configured in this repository.

Use this check instead:

```bash
hugo --cleanDestinationDir
```

### Tests

There is no automated test suite configured yet.

The effective verification flow is:

```bash
hugo --cleanDestinationDir
```

Then inspect affected pages with `hugo server` when layout, navigation, or responsive behavior changes.

### Running a Single Test

There is no single-test runner because there is no test framework configured.

Closest equivalent:

```bash
hugo
```

Use that when you want a quick render check without a clean rebuild.

## Working Agreements

- Prefer small, targeted edits.
- Preserve the existing Hugo structure unless a broader reorganization is required.
- Keep page URLs stable unless the task explicitly calls for URL changes.
- Treat `content/` as the source of the site and `public/` as disposable output.
- Do not hand-edit `public/`; rebuild it.
- Blog posts are intentionally excluded right now; avoid adding post features unless requested.

## Code Style

### General

- Match the surrounding style in each file.
- Favor readability over cleverness.
- Keep dependencies minimal.
- Avoid introducing frameworks or build tools unless explicitly requested.

### Formatting

- Use ASCII by default unless the file already contains non-ASCII text that should be preserved.
- Preserve existing indentation style by language:
  - JavaScript: 2 spaces
  - Hugo/HTML templates: 2 spaces
  - YAML: 2 spaces
  - Markdown: keep readable source, not mechanically wrapped paragraphs
- Keep lines reasonably compact, but prioritize readability for templates and content.

### Imports and Script Organization

- The repo currently uses one browser-side JS file: `themes/pathfinder/static/js/site.js`.
- Use modern browser APIs and keep the script dependency-free.
- Prefer small helper functions over deeply nested event logic.
- Remove unused variables and dead branches when editing JS.

### JavaScript Conventions

- Use modern vanilla JS only.
- Use `const` by default and `let` only when reassignment is required.
- Use `camelCase` for variables and functions.
- Keep DOM behavior progressive and lightweight.
- Prefer event listeners over inline handlers.
- Keep accessibility attributes such as `aria-*`, `hidden`, and expanded/collapsed states in sync with UI behavior.

### Hugo / Template Conventions

- Reuse partials for shared header, footer, and navigation structure.
- Keep template logic simple and readable.
- Use Hugo menu/page APIs consistently with existing patterns.
- Prefer `relURL` and `RelPermalink` over hardcoded local paths in templates.
- Preserve current content hierarchy:
  - section `_index.md` files for section landing pages
  - leaf pages for detail pages
- Avoid pushing complex business logic into templates.

### YAML Conventions

- Keep `hugo.yaml` readable and ordered logically.
- Use 2-space indentation.
- Match the existing quoting style when editing nearby entries.
- Preserve menu weights and identifiers unless the task explicitly changes site structure.

### Content Conventions

- Preserve Pathfinder's information architecture and voice unless asked to rewrite content.
- Keep existing slugs and page paths stable.
- Preserve legal/compliance-style page language unless changes are explicitly requested.
- If you touch embedded HTML inside Markdown, keep it valid and easy to scan.
- Prefer local asset references under `static/` instead of remote URLs.

### CSS Conventions

- Keep styles in `themes/pathfinder/static/css/style.css` unless there is a strong reason to split files.
- Reuse existing custom properties before adding new ones.
- Preserve the site's established visual direction unless a redesign is requested.
- Ensure changes work on both desktop and mobile breakpoints.
- Be careful with hover-only interactions; provide keyboard and touch-friendly behavior too.

### Naming

- Use descriptive, low-surprise names.
- Match existing naming schemes in each area:
  - content files mirror page slugs
  - image filenames are lowercase and hyphenated
  - Hugo partial/template names are short and literal
  - CSS classes are descriptive and component-oriented

### Error Handling

- Fail clearly rather than silently hiding problems.
- In JS, prefer guard clauses for missing DOM elements when behavior is optional.
- Do not swallow errors without a clear reason.
- If you add fallback behavior, keep it obvious and maintainable.

### Comments

- Add comments only when the intent is not obvious from the code.
- Avoid repeating what the code already states.
- Prefer expressive names and small helpers over explanatory comment blocks.

## Verification Expectations

After meaningful changes:

- Run `hugo --cleanDestinationDir`.
- If templates, CSS, JS, navigation, or responsive behavior changed, also run `hugo server` and inspect the affected pages manually.
- If content changed, verify the changed pages render correctly and local links still work.

## Agent Notes

- Do not add generated build output to git.
- Preserve contact details and page metadata unless the task explicitly changes them.
- Preserve current menu structure and URL hierarchy unless instructed otherwise.
- Keep the repo focused on what Hugo needs to build and serve the site.
