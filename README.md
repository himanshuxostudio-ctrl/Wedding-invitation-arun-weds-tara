# Tara weds Arun — Digital Wedding Invitation

A phone-first, interactive wedding invitation for **Tara & Arun · 21 November 2026**.

Experience flow: embossed envelope with an A&T wax seal → envelope opens with a warm light bloom
→ illustrated cover → scratch-to-reveal date → श्री गणेशाय नमः invocation → family invitation
→ the Seven Sacred Steps → celebrations timeline → venue → RSVP → blessings → thank-you page.

## Structure

```
index.html            all invitation content
css/style.css         styling, envelope + opening animation, reveals
js/flora.js           SVG generator for the embossed / watercolour florals, arches, icons
js/main.js            envelope opening, music, scroll reveals, parallax, scratch cards
assets/img/           the three couple illustrations
assets/audio/         background soundtrack (starts when the invitation is opened)
```

No build step — it's plain static HTML/CSS/JS.

## Preview locally

```
python3 -m http.server 8000
# open http://localhost:8000 (use the browser's mobile/device mode for the intended view)
```

## Publish with GitHub Pages

Settings → Pages → Deploy from a branch → choose the branch and `/ (root)`.
