# Hozeh — website

Static site exported from Claude Design. No build step: plain HTML pages (`*.dc.html`) rendered by `support.js`, with shared effects in `hz-fx.js`.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080/Home.dc.html
```

## Deploy (Vercel)

Import this repo at vercel.com/new → Framework preset **Other**, no build command, output directory `.`.
`vercel.json` maps `/` to the home page and gives clean routes (`/about`, `/work`, …).

## Assets you need to add

These binary files aren't in the repo yet — add them at these paths:

- `assets/team/nirmal.jpg`, `assets/team/allan.jpg`, `assets/team/ludo.png` (team photos)
- `assets/og-image.png` (social share image, 1200×630)

Videos are self-hosted in `assets/video/` (compressed, ~3.5 MB total) with matching stills in `assets/posters/`, picked up automatically by `BgVideo`.

## Before launch

- Wire the contact form (`Contact.dc.html` → `submitContact`) and the newsletter form (`Insights.dc.html`).
- Swap the Instagram / LinkedIn / GitHub links for Hozeh's real profiles.
- Confirm `hello@hozeh.com` and the response-time line on the contact page.
