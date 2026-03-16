# Pathfinder Hugo Site

This repository contains a standalone Hugo site for Pathfinder Financial Services, LLC.

## Project layout

- `hugo.yaml` - site configuration
- `content/` - page content
- `themes/pathfinder/` - custom Hugo theme
- `static/` - localized static assets
- `public/` - generated build output

## Requirements

- Hugo Extended

## Build

Production-style build:

```bash
hugo --cleanDestinationDir
```

Standard build:

```bash
hugo
```

## Local preview

Run the local development server:

```bash
hugo server
```

Bind to all interfaces if needed:

```bash
hugo server --bind 0.0.0.0
```

## Notes

- `public/` is generated output and should not be edited directly.
- The site currently includes the main page-based content and theme.
- Blog posts are still excluded from this repository.
