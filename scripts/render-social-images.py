#!/usr/bin/env python3
"""Regenerate local sharing artwork with Hugo and Inkscape (development only)."""

import base64
import os
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile
import textwrap


class PageTitle(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.title = ""

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def image_data(path):
    return "data:image/svg+xml;base64," + base64.b64encode(path.read_bytes()).decode()


def main():
    repo = Path(__file__).resolve().parents[1]
    images = repo / "static/images"
    output = images / "social"
    output.mkdir(exist_ok=True)
    landscape = image_data(images / "windward-landscape.svg")
    logo = image_data(images / "pathfinder-logo.svg")

    with tempfile.TemporaryDirectory(prefix="pathfinder-sharing-") as directory:
        temp = Path(directory)
        subprocess.run(["hugo", "--destination", str(temp / "site")], cwd=repo, check=True)
        for page in sorted((temp / "site").rglob("index.html")):
            parser = PageTitle()
            parser.feed(page.read_text())
            title = parser.title.split(" | ", 1)[0]
            parts = page.relative_to(temp / "site").parts[:-1]
            name = "-".join(parts) or "home"
            lines = textwrap.wrap(title, width=29, break_long_words=False)
            font_size = 52 if len(lines) <= 4 else 42
            text = "\n".join(
                f'<text x="66" y="{246 + i * (font_size + 9)}">{escape(line)}</text>'
                for i, line in enumerate(lines)
            )
            source = temp / f"{name}.svg"
            source.write_text(f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <image href="{landscape}" width="1260" height="630"/>
  <image href="{logo}" x="62" y="45" width="230" height="94"/>
  <g fill="#152e3b" font-family="Source Serif 4, Georgia, serif" font-size="{font_size}">
    {text}
  </g>
</svg>''')
            result = subprocess.run([
                "inkscape", str(source), "--export-type=png",
                f"--export-filename={output / (name + '.png')}",
            ], env={**os.environ, "INKSCAPE_PROFILE_DIR": str(temp / "inkscape")},
                capture_output=True, text=True)
            if result.returncode:
                raise SystemExit(result.stderr or result.stdout)
    print(f"Sharing images written to {output}")


if __name__ == "__main__":
    main()
