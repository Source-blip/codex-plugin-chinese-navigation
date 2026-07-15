from __future__ import annotations

import base64
import hashlib
import io
import json
import re
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "index.html"
PUBLIC = ROOT / "public"
OUTPUT = PUBLIC / "catalog.html"
REPORT = PUBLIC / "sites-assets-report.json"
ASSET_PREFIX = "catalog-asset-"
DATA_IMAGE = re.compile(
    r"data:image/(?P<type>[a-zA-Z0-9.+-]+);base64,(?P<data>[A-Za-z0-9+/=]+)"
)


def optimized_image(raw: bytes, media_type: str) -> tuple[bytes, str]:
    if media_type in {"svg+xml", "svg"}:
        return raw, "svg"

    try:
        with Image.open(io.BytesIO(raw)) as image:
            if getattr(image, "n_frames", 1) > 1:
                extension = "gif" if media_type == "gif" else media_type.replace("jpeg", "jpg")
                return raw, extension

            image.load()
            if max(image.size) > 256:
                image.thumbnail((256, 256), Image.Resampling.LANCZOS)

            has_alpha = "A" in image.getbands() or "transparency" in image.info
            converted = image.convert("RGBA" if has_alpha else "RGB")
            target = io.BytesIO()
            converted.save(
                target,
                format="WEBP",
                lossless=has_alpha,
                quality=88,
                method=6,
            )
            webp = target.getvalue()
            if len(webp) < len(raw):
                return webp, "webp"
    except Exception:
        pass

    extension = media_type.replace("jpeg", "jpg").replace("svg+xml", "svg")
    return raw, extension


def main() -> None:
    html = SOURCE.read_text(encoding="utf-8")
    old_asset_directory = PUBLIC / "site-assets"
    if old_asset_directory.exists():
        shutil.rmtree(old_asset_directory)
    for old in PUBLIC.glob(f"{ASSET_PREFIX}*"):
        if old.is_file():
            old.unlink()

    replacements: dict[str, str] = {}
    written: dict[str, int] = {}
    original_bytes = 0
    favicon_source: bytes | None = None

    for match in DATA_IMAGE.finditer(html):
        uri = match.group(0)
        if uri in replacements:
            continue
        raw = base64.b64decode(match.group("data"))
        if favicon_source is None:
            favicon_source = raw
        original_bytes += len(raw)
        output, extension = optimized_image(raw, match.group("type").lower())
        digest = hashlib.sha256(output).hexdigest()[:24]
        filename = f"{ASSET_PREFIX}{digest}.{extension}"
        target = PUBLIC / filename
        if not target.exists():
            target.write_bytes(output)
            written[filename] = len(output)
        replacements[uri] = f"/{filename}"

    for uri, path in replacements.items():
        html = html.replace(uri, path)

    if favicon_source is not None:
        with Image.open(io.BytesIO(favicon_source)) as icon:
            icon.thumbnail((64, 64), Image.Resampling.LANCZOS)
            icon.convert("RGBA").save(PUBLIC / "favicon.png", format="PNG", optimize=True)
        html = html.replace("</head>", '<link rel="icon" href="/favicon.png">\n</head>', 1)

    OUTPUT.write_text(html, encoding="utf-8")
    preview = ROOT / "assets" / "codex-plugin-navigation-preview.png"
    if preview.exists():
        shutil.copy2(preview, PUBLIC / "og.png")

    report = {
        "source": SOURCE.name,
        "output": OUTPUT.name,
        "uniqueDataImages": len(replacements),
        "writtenAssets": len(written),
        "originalImageBytes": original_bytes,
        "optimizedImageBytes": sum(written.values()),
        "catalogBytes": OUTPUT.stat().st_size,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
