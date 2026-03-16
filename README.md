# Pathfinder Hugo Migration

This workspace contains a Hugo version of the page-based content from `https://pathfinderfs.com`.

## Included

- Custom theme in `themes/pathfinder/`
- Migrated non-post pages in `content/`
- Localized images in `static/images/`
- Import helper in `scripts/import_pages.py`

## Build

```bash
hugo --cleanDestinationDir
```

## Local preview

```bash
hugo server
```

## Notes

- WordPress posts are intentionally excluded for now.
- The contact email is rendered as plain visible text.
- `scripts/import_pages.py` regenerates the migrated page content from `pages.json` and re-downloads the required assets if they are missing.
