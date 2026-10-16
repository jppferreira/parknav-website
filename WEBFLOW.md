# ParkNav website → Webflow

Static HTML in this folder is the source of truth. Recreate it in Webflow so you can host and edit visually. Do not paste the whole site into a custom-code embed — rebuild with native Webflow elements.

## Pages

| File | Webflow page slug |
|---|---|
| `index.html` | `/` Home |
| `features.html` | `/features` |
| `pricing.html` | `/pricing` |
| `about.html` | `/about` |
| `contact.html` | `/contact` |
| `privacy.html` | `/privacy` |
| `terms.html` | `/terms` |
| `data.html` | `/data` |

App Store / Play require public HTTPS URLs for Privacy and Terms. After publish, set those URLs in `src/legal/content.ts`.

## Designer setup

1. Create a Webflow site. Project settings → Fonts: **Syne** (600, 700) and **DM Sans** (400, 500, 700).
2. Add Swatches / Variables from `:root` in `css/site.css` (`--ink`, `--green`, `--bg`, etc.).
3. Upload everything in `images/` to Assets.
4. Recreate **Navbar** and **Footer** as Symbols. Bind links to the pages above.
5. Home: full-bleed `hero-street.jpg` background, brand word, one headline, one sentence, two buttons. No floating badges on the image.
6. Contact: native Webflow Form (Name, Email, Topic, Message). Do not print a support address on the page. Remove the static form script.
7. Legal pages: either static pages or a CMS Collection (`title`, `updated`, `body` rich text) with a template.

## Hosting

Publish on Webflow hosting and attach `parknav.app`. Add 301s if you later change slugs (`/privacy`, `/terms` should stay stable).

## Editing later

Copy, colour, and images are all Webflow-native after the rebuild. Keep class names from `site.css` (`hero`, `split`, `plan`, `nav-brand`) so the layout stays aligned with this preview.
