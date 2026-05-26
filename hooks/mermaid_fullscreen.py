"""
MkDocs hook: inject a Fullscreen button after every Mermaid diagram.

Runs at build time — the button is part of the static HTML,
no JavaScript DOM injection needed.
"""

import re


BUTTON_HTML = (
    '<button class="mermaid-expand-btn" onclick="openMermaidFullscreen(this)">'
    "&#x2922; Fullscreen"
    "</button>"
)

# Matches the closing </pre> of a Mermaid code block (before Mermaid.js replaces it)
# and also a closing </div> in case MkDocs already wraps it differently.
MERMAID_CLOSE_RE = re.compile(r"(</pre>\s*</div>|</pre>)(\s*)", flags=re.IGNORECASE)


def on_page_content(html: str, page, config, files) -> str:
    """Insert a fullscreen button after each Mermaid diagram block."""
    # Only process pages that contain mermaid diagrams
    if 'class="mermaid"' not in html:
        return html

    # Find all mermaid pre blocks and insert button after each
    parts = []
    last_end = 0
    in_mermaid = False

    for match in re.finditer(r'<pre class="mermaid"', html):
        in_mermaid = True
        # Find the closing </pre> after this opening
        close = MERMAID_CLOSE_RE.search(html, match.start())
        if close:
            end_pos = close.end()
            parts.append(html[last_end:end_pos])
            parts.append("\n" + BUTTON_HTML + "\n")
            last_end = end_pos
            in_mermaid = False

    if last_end > 0:
        parts.append(html[last_end:])
        return "".join(parts)

    return html
