# ELDAR — Personal Engineering Archive (Vol.01)

Two-page personal website: `index.html` (the person / the mind) + `work.html` (the work / archive).

- No frameworks, no build step. Open `index.html` directly or serve statically.
- Palette: ivory paper / graphite / olive / muted copper. Light theme on About, dark bench theme on Work.
- Type: Space Grotesk (display) / Inter (body) / IBM Plex Mono (metadata) via Google Fonts.
- Photos: Unsplash CDN working references — replace with own bench photos as entries mature. Gaps are labelled `[to attach]` / placeholder on purpose; no invented specs.
- Interactions: IntersectionObserver reveals, subtle parallax, wipe page transition, drag h-scroll, progress hairline. Reduced-motion respected.

## Structure

```
eldarH/
  index.html
  work.html
  assets/css/style.css
  assets/js/main.js
```

## Local preview

```powershell
cd eldarH
python -m http.server 8000
# → http://localhost:8000
```

## Replace later

- Email placeholder: `hello@eldar-archive.dev`
- GitHub link placeholder: footer / contact band
- Project measurements, BOMs, photos marked PLACEHOLDER
