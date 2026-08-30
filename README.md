# ParkNav marketing site

Static marketing website for [ParkNav](https://github.com) — separate from the mobile app repo.

## Pages

| Path | Page |
|---|---|
| `/` | Home |
| `/features.html` | Features |
| `/pricing.html` | Pricing |
| `/about.html` | About |
| `/contact.html` | Contact |
| `/privacy.html` | Privacy Policy |
| `/terms.html` | Terms of Use |
| `/data.html` | Data & open sources |
| `/install.html` | Wi-Fi APK install (optional) |

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment**
3. Source: **Deploy from a branch**
4. Branch: **main** / **/ (root)**
5. Save. The site will be at `https://<username>.github.io/parknav-website/` until you add a custom domain.

`.nojekyll` is included so GitHub Pages serves the static files as-is.

## Custom domain later

When you own `parknav.app`:

1. Add a `CNAME` file with `parknav.app` (or use GitHub Pages custom domain settings).
2. Point DNS `A` / `CNAME` records at GitHub Pages.
3. Update canonical URLs in the HTML if needed.

## Webflow

See `WEBFLOW.md` for recreating this design in Webflow for visual editing.

## App repo

The React Native / Expo app is **not** in this repository. It lives in a separate project. The app only links to public URLs (`parknav.app/privacy`, etc.) — it does not embed this site.
