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
assets/fonts/         (add the licensed 'Sephora & Hayden' calligraphy font here)
```

No build step — it's plain static HTML/CSS/JS.

## Preview locally

```
python3 -m http.server 8000
# open http://localhost:8000 (use the browser's mobile/device mode for the intended view)
```

## Publish with GitHub Pages

Settings → Pages → Deploy from a branch → choose the branch and `/ (root)`.

## Calligraphy font

Headings and names use **Sephora & Hayden**, a licensed font that can't be bundled here.
Copy the font file to `assets/fonts/` (e.g. `SephoraHayden.woff2`) and uncomment the matching
`url()` line in the `@font-face` rule at the top of `css/style.css`. Until then the page falls
back to Pinyon Script. Dates, days, timings and phone numbers use Times New Roman
(Tinos — its metric twin — on Android).

## Reviewing the envelope animation

Append `?slow=4` to the URL to play the opening sequence four times slower.
