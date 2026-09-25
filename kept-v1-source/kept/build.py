"""Build Kept: inline src/css and src/js into dist/index.html (single-file page for publishing).
Usage: python3 build.py"""
import pathlib, re
root = pathlib.Path(__file__).parent
src = root / "src"
html = (src / "index.html").read_text()
def css(m): return "<style>\n" + (src / m.group(1)).read_text() + "\n</style>"
def js(m): return "<script>\n" + (src / m.group(1)).read_text() + "\n</script>"
html = re.sub(r"<!-- build:css (\S+) -->", css, html)
html = re.sub(r"<!-- build:js (\S+) -->", js, html)
out = root / "dist"; out.mkdir(exist_ok=True)
(out / "index.html").write_text(html)
print("dist/index.html", len(html), "bytes")
