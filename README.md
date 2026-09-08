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

## Visual assets

The refined logo retains the original blue vector lettering and route-shaped P,
with a warm-gray pillar, three light grooves, and a softer gray subtitle. Use
this version on light surfaces, the reversed version on navy or teal, and the
monochrome version for single-color reproduction. Its grooves are transparent
knockouts so the monochrome asset works on different backgrounds. Keep clear space around
the mark at least equal to the height of the "Financial Services" lettering.
Use the icon at small sizes; do not compress the full wordmark into a square.
The original logo is preserved in `Pathfinder-Heading-Final.svg`.

The Windward landscape is an original vector illustration inspired by the
windward Koolau Range, with a stylized ocean foreground. The desktop and mobile
assets share the same cliff silhouette and ravine geometry. The right-hand ridge
in the [reference photograph](https://images.unsplash.com/photo-1684450313847-d7425d81d1c7)
informed the continuous rise from left to right and the flutes descending toward
the lower left. Tapered shadowed gullies and narrow highlights define the ridges
above one continuous lower slope. No photographic content is embedded in the
artwork. The mobile composition reserves the artwork for the space below the
homepage copy. The route motif and diagrams share navy, Pathfinder blue, teal,
and a restrained gold accent.

The existing photographs are unaltered. David's source is 148 x 200 pixels;
keep portrait placements close to that size until a larger authentic photograph
is available. Both portraits use the same proportions and CSS framing.

Sharing PNGs are intentional site assets. Regenerate them after changing titles
or artwork with `python3 scripts/render-social-images.py` from the repository.
This development script needs Hugo, Inkscape, and Source Serif 4 installed.
The normal Hugo build uses the checked-in PNGs and needs no image-generation tool.
Build production with the deployment's absolute Hugo baseURL so sharing metadata
contains public absolute URLs.
