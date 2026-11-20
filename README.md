# Rainbow Star Transport Ltd. — Website

Static 4-page website. No build step. Upload the folder to any host (Netlify, Vercel, cPanel, GitHub Pages…).

| Page | File |
|------|------|
| Home | `index.html` |
| Services | `services.html` |
| About Us | `about.html` |
| Contact / Quote | `contact.html` |

```
assets/
  css/styles.css     – full design system (colours, type, layout, responsive)
  js/icons.js        – inline SVG icon set (Lucide, ISC licence)
  js/main.js         – header, mobile menu, scroll animations, counters, quote form
  img/               – logo variants, favicon, og-image
  img/photos/        – 35 real photos (WebP, optimised)
```

## Business details used
- **Business:** Rainbow Star Transport Ltd.
- **Owner:** Gursewak Singh
- **Phone:** 709-699-1377
- **Email:** info@rainbowstartransport.ca  ← created for the site; register the domain + mailbox
  (or find/replace `info@rainbowstartransport.ca` across the 4 HTML files with the real one)

## Please confirm with the client before launch
- **24/7 dispatch** — shown in the top bar, stats, contact page and FAQ.
- **Founder quote** on the About page is draft wording for Gursewak Singh to approve.
- **Industries** listed (seafood, food & bev, retail, construction, manufacturing, agriculture).
- No street address was provided, so none is shown. Add one to the contact cards + footer if wanted.

## Quote form
The site is static, so the form opens the visitor's email app with all fields pre-filled
(addressed to the email in `data-to` on the `<form>` in `contact.html`).
To receive submissions directly instead, point the form at a service such as Formspree,
Netlify Forms or Web3Forms.

Service buttons on the Services page pre-select the matching service in the form
(e.g. `contact.html?service=ltl`).

## Photos
All photos are real photographs from **Unsplash** (free for commercial use, no attribution required —
https://unsplash.com/license). None are AI-generated. Source links: `PHOTO-CREDITS.txt`.

## Updating CSS/JS
Asset links carry `?v=1.0`. Bump the number after editing `styles.css` / `main.js`
so returning visitors get the new version.
