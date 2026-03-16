import json
import os
import re
from html import unescape
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup, Comment


ROOT = Path(__file__).resolve().parents[1]
PAGES_JSON = ROOT / "pages.json"
CONTENT_DIR = ROOT / "content"
STATIC_IMAGES = ROOT / "static" / "images"

SITE_URL = "https://pathfinderfs.com"

PAGE_META = {
    "home": {"path": "_index.md", "weight": 10, "kind": "home"},
    "investment-strategy": {"path": "investment-strategy.md", "weight": 20},
    "services": {"path": "services/_index.md", "weight": 30},
    "summary": {"path": "services/summary.md", "weight": 10},
    "discoverdecidedo": {"path": "services/discoverdecidedo.md", "weight": 20},
    "investment-supervision-only": {
        "path": "services/investment-supervision-only.md",
        "weight": 30,
    },
    "resources": {"path": "resources/_index.md", "weight": 40},
    "executor-checklist": {"path": "resources/executor-checklist.md", "weight": 10},
    "evaluating-startup-isos": {
        "path": "resources/evaluating-startup-isos.md",
        "weight": 20,
    },
    "restricted-stock-stock-options": {
        "path": "resources/restricted-stock-stock-options.md",
        "weight": 30,
    },
    "identifying-a-worthy-planner": {
        "path": "resources/identifying-a-worthy-planner.md",
        "weight": 40,
    },
    "books": {"path": "resources/books.md", "weight": 50},
    "external-links": {"path": "resources/external-links.md", "weight": 60},
    "about": {"path": "about/_index.md", "weight": 50},
    "david-jacobs-ph-d-cfp": {"path": "about/david-jacobs-ph-d-cfp.md", "weight": 10},
    "katherine-jacobs": {"path": "about/katherine-jacobs.md", "weight": 20},
    "fee-only": {"path": "about/fee-only.md", "weight": 30},
    "fiduciary": {"path": "about/fiduciary.md", "weight": 40},
    "privacy-policy": {"path": "about/privacy-policy.md", "weight": 50},
    "proxy-voting-policy": {"path": "about/proxy-voting-policy.md", "weight": 60},
    "contact-us": {"path": "contact-us.md", "weight": 60},
}

SUMMARY_OVERRIDES = {
    "services": "Pathfinder offers two core engagements for ongoing planning and investment oversight.",
    "summary": "A quick comparison of Pathfinder's two service options.",
    "resources": "Self-directed resources, checklists, and guides for thoughtful financial decisions.",
    "about": "Learn more about Pathfinder Financial Services and the people behind the practice.",
    "contact-us": "Reach Pathfinder Financial Services by phone, email, or mail from anywhere in the country.",
    "books": "A short Pathfinder reading list on behavior, investing, and money psychology.",
}

IMAGE_MAP = {
    f"{SITE_URL}/wp-content/uploads/2022/06/Katherine_bio.jpg": "images/katherine-bio.jpg",
    f"{SITE_URL}/wp-content/uploads/2022/06/Katherine_bio-214x300.jpg": "images/katherine-bio.jpg",
    f"{SITE_URL}/wp-content/uploads/2022/06/Katherine_bio-731x1024.jpg": "images/katherine-bio.jpg",
    f"{SITE_URL}/wp-content/uploads/2022/06/Katherine_bio-768x1075.jpg": "images/katherine-bio.jpg",
    f"{SITE_URL}/wp-content/uploads/2022/06/Katherine_bio-1097x1536.jpg": "images/katherine-bio.jpg",
    f"{SITE_URL}/wp-content/uploads/2010/08/ddd-cycle1.png": "images/ddd-cycle.png",
    f"{SITE_URL}/wp-content/uploads/2010/08/ddd-cycle-300x165.png": "images/ddd-cycle.png",
    f"{SITE_URL}/David_mtn.jpg": "images/david-mtn.jpg",
    "http://ecx.images-amazon.com/images/I/416ie48vq-L._SL160_.jpg": "images/books/stumbling-on-happiness.jpg",
    "http://ecx.images-amazon.com/images/I/51JNxbOk6KL._SL160_.jpg": "images/books/your-money-and-your-brain.jpg",
    "http://ecx.images-amazon.com/images/I/5106QPDYQFL._SL160_.jpg": "images/books/four-pillars-of-investing.jpg",
    "http://ecx.images-amazon.com/images/I/711EBTAD60L._SL160_.gif": "images/books/seven-stages-of-money-maturity.gif",
    "http://ecx.images-amazon.com/images/I/514Colm6rjL._SL160_.jpg": "images/books/your-money-or-your-life.jpg",
}

DOWNLOADS = {
    f"{SITE_URL}/wp-content/uploads/2020/02/Pathfinder-Heading.png": STATIC_IMAGES
    / "pathfinder-heading.png",
    f"{SITE_URL}/David_mtn.jpg": STATIC_IMAGES / "david-mtn.jpg",
    f"{SITE_URL}/wp-content/uploads/2022/06/Katherine_bio.jpg": STATIC_IMAGES
    / "katherine-bio.jpg",
    f"{SITE_URL}/wp-content/uploads/2010/08/ddd-cycle1.png": STATIC_IMAGES
    / "ddd-cycle.png",
    "http://ecx.images-amazon.com/images/I/416ie48vq-L._SL160_.jpg": STATIC_IMAGES
    / "books"
    / "stumbling-on-happiness.jpg",
    "http://ecx.images-amazon.com/images/I/51JNxbOk6KL._SL160_.jpg": STATIC_IMAGES
    / "books"
    / "your-money-and-your-brain.jpg",
    "http://ecx.images-amazon.com/images/I/5106QPDYQFL._SL160_.jpg": STATIC_IMAGES
    / "books"
    / "four-pillars-of-investing.jpg",
    "http://ecx.images-amazon.com/images/I/711EBTAD60L._SL160_.gif": STATIC_IMAGES
    / "books"
    / "seven-stages-of-money-maturity.gif",
    "http://ecx.images-amazon.com/images/I/514Colm6rjL._SL160_.jpg": STATIC_IMAGES
    / "books"
    / "your-money-or-your-life.jpg",
}


def download_assets():
    for source, destination in DOWNLOADS.items():
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists():
            continue
        request = Request(source, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(request) as response, open(destination, "wb") as handle:
            handle.write(response.read())


def clean_html(slug: str, html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")

    if slug == "external-links":
        sections = []
        for category in soup.select("div.LinkLibraryCat"):
            name = category.select_one("span.linklistcatclass")
            rows = category.find_all("tr")
            if not name or not rows:
                continue
            items = []
            for row in rows:
                cells = row.find_all("td")
                if len(cells) < 2:
                    continue
                link = cells[0].find("a")
                if not link or not link.get("href"):
                    continue
                href = str(link["href"]).strip()
                title = link.get_text(" ", strip=True)
                detail = cells[1].get_text(" ", strip=True)
                items.append(
                    f'<tr><td><a href="{href}" rel="noopener noreferrer">{title}</a></td><td>{detail}</td></tr>'
                )
            if items:
                sections.append(
                    "\n".join(
                        [
                            f"<h2>{name.get_text(' ', strip=True)}</h2>",
                            "<table>",
                            "<tbody>",
                            *items,
                            "</tbody>",
                            "</table>",
                        ]
                    )
                )
        return "\n\n".join(sections)

    for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()

    for tag_name in ["meta", "style", "script", "title"]:
        for tag in soup.find_all(tag_name):
            tag.decompose()

    for tag in soup.find_all(True):
        attrs = dict(tag.attrs)
        align_class = None
        if tag.name == "img" and "class" in attrs:
            classes = attrs.get("class")
            if isinstance(classes, list):
                align_class = next(
                    (cls for cls in classes if cls in {"alignleft", "alignright"}), None
                )
        for attr in [
            "class",
            "style",
            "loading",
            "decoding",
            "sizes",
            "srcset",
            "id",
            "target",
        ]:
            attrs.pop(attr, None)
        if tag.name == "img" and "align" in attrs:
            align = str(attrs.pop("align"))
            attrs["class"] = f"align{align}"
        elif tag.name == "img" and align_class:
            attrs["class"] = align_class
        tag.attrs = attrs

    for tag in soup.find_all(["span", "font"]):
        tag.unwrap()

    for heading in soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"]):
        if not heading.get_text(strip=True):
            heading.decompose()

    for link in soup.find_all("a", href=True):
        href = str(link["href"]).strip()
        if href in IMAGE_MAP:
            link["href"] = "/" + IMAGE_MAP[href]
        elif href.startswith(SITE_URL):
            path = urlparse(href).path or "/"
            link["href"] = path
        elif href.startswith("/"):
            link["href"] = href
        elif href.startswith("http://"):
            link["rel"] = "noopener noreferrer"
        elif href.startswith("https://"):
            link["rel"] = "noopener noreferrer"

    for image in soup.find_all("img", src=True):
        src = str(image["src"]).strip()
        image["src"] = "/" + IMAGE_MAP.get(
            src, IMAGE_MAP.get(src.replace("https://", "http://"), src.lstrip("/"))
        )
        if not image.get("alt"):
            image["alt"] = ""

    if slug == "contact-us":
        return """
<p>While we are located in Hawaii, we serve clients nationwide. Due to Hawaii being in an earlier time zone, mainland clients can often reach us during their evening hours.</p>
<p>Please feel free to contact us with any questions, requests, or comments you may have.</p>
<ul>
  <li><strong>Phone:</strong> (808) 728-4396</li>
  <li><strong>Fax:</strong> (808) 728-4396</li>
  <li><strong>Email:</strong> <a href="mailto:support@pathfinderfs.com">support@pathfinderfs.com</a></li>
  <li><strong>Address:</strong><br>Pathfinder Financial Services, LLC<br>555 Paakiki Pl.<br>Kailua, HI 96734</li>
</ul>
""".strip()

    if slug == "home":
        return "<p>Pathfinder delivers concierge-level service grounded in fee-only advice, fiduciary care, and a long-term commitment to helping clients navigate complex financial decisions with confidence.</p>"

    if slug == "about":
        return "<p>Pathfinder Financial Services pairs disciplined analysis with deeply personal planning, helping clients make clear decisions through life transitions, family responsibilities, and long-range investment choices.</p>"

    if slug == "resources":
        return "<p>For those who like to do things themselves, this area compiles useful guides, checklists, and reference material.</p>"

    if slug == "books":
        return (
            "<p>Here are a few books Pathfinder has recommended for readers who want a deeper feel for behavior, investing, and the human side of money.</p>\n"
            + str(soup)
        )

    wrappers = []
    for child in soup.contents:
        if getattr(child, "name", None) or str(child).strip():
            wrappers.append(str(child))

    cleaned = "\n".join(wrappers)
    cleaned = cleaned.replace("\xa0", " ")
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    if slug == "executor-checklist":
        cleaned = re.sub(r"^(<p>\s*(<br/?\s*>\s*)*<\/p>\s*)+", "", cleaned)
        cleaned = re.sub(r"<div>\s*</div>", "", cleaned)
    return cleaned


def make_summary(slug: str, html: str) -> str:
    if slug in SUMMARY_OVERRIDES:
        return SUMMARY_OVERRIDES[slug]
    text = BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
    text = re.sub(r"\s+", " ", text)
    return text[:180].rsplit(" ", 1)[0] + ("..." if len(text) > 180 else "")


def write_markdown(
    path: Path,
    title: str,
    weight: int,
    summary: str,
    body: str,
    extra: dict | None = None,
):
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "---",
        f'title: "{title.replace('"', '\\"')}"',
        f"weight: {weight}",
        f'description: "{summary.replace('"', '\\"')}"',
        f"draft: false",
    ]
    if extra:
        for key, value in extra.items():
            if isinstance(value, str):
                lines.append(f'{key}: "{value.replace('"', '\\"')}"')
            elif isinstance(value, list):
                lines.append(f"{key}:")
                for item in value:
                    lines.append(f'  - "{str(item).replace('"', '\\"')}"')
            else:
                lines.append(f"{key}: {value}")
    lines.extend(["---", "", body.strip(), ""])
    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    download_assets()
    pages = json.loads(PAGES_JSON.read_text(encoding="utf-8"))
    pages_by_slug = {page["slug"]: page for page in pages}

    home_extras = {
        "hero_intro": "Helping clients achieve their most rewarding lives through deeper planning, disciplined investment supervision, and advice centered on their best interests.",
        "founder_intro": "Raised in Hawaii and shaped by a long career in artificial intelligence and computer security, David brings a research-driven mindset to financial planning and portfolio stewardship.",
        "hero_points": [
            "Having clarity on where you want to go",
            "Understanding the impact of the decisions you make",
            "Feeling organized and in control",
            "Avoiding major financial mistakes",
            "Seeing your dreams become reality",
            "Strengthening your ties to family and community",
            "Knowing that your best interests are being safeguarded",
        ],
    }

    for slug, meta in PAGE_META.items():
        page = pages_by_slug[slug]
        body = clean_html(slug, page["content"]["rendered"])
        summary = make_summary(slug, body)
        extras = home_extras if slug == "home" else None
        write_markdown(
            CONTENT_DIR / meta["path"],
            unescape(page["title"]["rendered"]),
            meta["weight"],
            summary,
            body,
            extras,
        )


if __name__ == "__main__":
    main()
