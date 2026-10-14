# Tara weds Arun — Digital Wedding Invitation

A phone-first, interactive wedding invitation for **Tara & Arun · 21 November 2026**.

Experience flow: embossed envelope with an A&T wax seal → envelope opens with a warm light bloom
→ illustrated cover → the date + countdown → श्री गणेशाय नमः invocation → family invitation
→ the Seven Sacred Steps → celebrations timeline → venue → RSVP → blessings → thank-you page.

## Structure

```
index.html            all invitation content
css/style.css         styling, envelope + opening animation, reveals
js/flora.js           SVG generator for the embossed / watercolour florals, arches, icons
js/main.js            envelope opening, music, scroll reveals, parallax, countdown
assets/img/           the three couple illustrations
assets/audio/         background soundtrack (starts when the invitation is opened)
assets/fonts/         Roffelia calligraphy font
```

No build step — it's plain static HTML/CSS/JS.

## Preview locally

```
python3 -m http.server 8000
# open http://localhost:8000 (use the browser's mobile/device mode for the intended view)
```

## Publish with GitHub Pages

Settings → Pages → Deploy from a branch → choose the branch and `/ (root)`.

## Fonts

- **Roffelia** (`assets/fonts/Roffelia.otf`) — names and calligraphic headings. This is the
  free *personal-use* edition; a commercial licence is available from ergibistudio.com.
- **Times New Roman** — dates, days, timings, phone numbers and the countdown
  (Tinos, its metric twin, on Android where Times New Roman isn't installed).
- **Cormorant Garamond** — supporting body copy; **Tiro Devanagari Sanskrit** — the shloka.

## Reviewing the envelope animation

Append `?slow=4` to the URL to play the opening sequence four times slower.
