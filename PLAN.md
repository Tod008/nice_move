# Logistics Company Website — Planning Doc

## Context
The user is building a marketing/informational website for a Mongolia-based logistics company (working directory: `Nice_move_logistic`, currently empty — greenfield build) that partners with companies in Japan, China, and Russia (and possibly more in future). The site's purpose is to present the company to prospective and existing partner companies. Framework is fixed as Next.js; the site should work well on both mobile and desktop browsers.

**Revision note**: the original plan included a shipment-tracking page, but the user has since confirmed the company doesn't offer shipment tracking — that page has been removed entirely. The user also has the company logo now and wants the site's color palette derived from it; the logo file itself will be dropped into the project folder in a later (build) session.

This is a **planning-only** document — no code is written yet. It captures the decisions made during clarification so implementation can proceed directly from here in a future session.

## Key decisions (from clarification)

| Area | Decision |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Rendering | Statically generated marketing pages; the Contact form still needs a small serverless API route to send email, so the site isn't 100% static, but there's no longer a data-backed dynamic page like tracking |
| Languages | English + Mongolian (i18n routing, e.g. `/en`, `/mn`) |
| Content management | Hardcoded in the codebase for v1 (no CMS) — I'll draft placeholder/starter copy per section for the user to review and edit unless they supply final copy |
| Pages | Home, About Us, Services, Partners/Clients, Contact (+ standard supporting pages: 404, privacy/terms footer links). User confirmed these are sufficient for now — no Get a Quote, Industries Served, Certifications, or FAQ pages at this stage |
| Future page (not in v1 scope) | Gallery — user mentioned wanting an interactive gallery page later; noted here so it isn't forgotten, but explicitly deferred out of the initial build |
| Branding | User has the company logo now; will drop the logo file into the project folder in a later session. The color palette will be derived from the logo file once it's available, then turned into a Tailwind theme/token system with help from the installed design skills (`brand`, `design-system`, `ui-styling`, `frontend-design`, `ui-ux-pro-max`) |
| Styling | Tailwind CSS (pairs with the installed design-system/ui-styling skills; standard modern Next.js choice) |
| Hosting | Vercel |
| Contact | Single general Contact page (name, company, email, message) — no separate "Request a Quote" page |
| Contact form | Next.js API route + a transactional email service (e.g. Resend) to deliver inquiries — needs an API key + recipient email set up as a follow-up dependency |

## Open items / inputs needed from the user before or during build
These aren't blocking the plan, but will block specific implementation steps until provided:
- Logo file (to be dropped into the project folder) — colors will be derived from it; confirm/adjust the derived palette with the user before locking in the theme
- Font choices/style guide, if any beyond what the logo implies
- Final legal company name, address, phone, registration/certification details (for About Us / footer)
- Copy/content for each page, or confirmation to proceed with drafted placeholder copy
- Partner/client company names + logos (with permission to display) for the Partners/Clients section
- Contact form recipient email address + email service account (e.g. Resend API key)
- Domain name for the Vercel deployment

## Site structure

- **Home** — hero (company + region focus), value proposition, service highlights, trust signals (partner/client logos strip), CTA to Contact/Services
- **About Us** — company story, mission, Mongolia base + Japan/China/Russia partner network, certifications/compliance if applicable
- **Services** — logistics service categories (e.g. cross-border road/rail freight, customs brokerage, warehousing — exact list depends on what the user's company actually offers, to confirm during content drafting)
- **Partners/Clients** — logo grid/list of partner companies, short blurbs, optional testimonials
- **Contact** — inquiry form (name, company, email, message), company contact details, optional map embed
- **Shared**: header/nav with language switcher, footer with contact info + legal links, custom 404
- *(Deferred, not in v1)* **Gallery** — interactive photo gallery, to be scoped in a future session

## Technical architecture

- **Scaffold**: `create-next-app` with TypeScript, App Router, ESLint, Tailwind CSS
- **i18n**: locale-prefixed routing (`/en/...`, `/mn/...`) via `next-intl` (or Next.js's built-in i18n routing), with a language switcher in the header
- **Design tokens**: Tailwind theme (`tailwind.config.ts`) built by extracting a palette from the user's logo file once it's dropped into the project, then structured into primitive/semantic tokens with the installed design skills
- **Contact form**: `app/api/contact/route.ts` validates input server-side and sends via the email service SDK; env var for the API key, not committed to the repo
- **SEO**: per-page `generateMetadata`, `sitemap.xml`, `robots.txt`, Open Graph tags — relevant since partner companies may discover the site via search or shared links
- **Images**: `next/image` for logo/partner assets in `public/`
- **Deployment**: connect the repo to Vercel; environment variables (email API key) configured in Vercel project settings, not in source

## Build sequence (high level)
1. Scaffold the Next.js app (TypeScript, Tailwind, App Router)
2. Set up i18n routing (EN default + MN) and language switcher
3. Once the logo file is provided: extract a color palette from it and establish design tokens/theme
4. Build shared layout: header/nav, footer
5. Build Home, About Us, Services, Partners/Clients pages with placeholder-then-real content
6. Build Contact page + API route + email delivery
7. Add SEO metadata, sitemap, robots.txt, OG images
8. Responsive QA across mobile and desktop breakpoints
9. Deploy to Vercel, connect domain

## Verification
- `npm run dev` and manually click through every page at both mobile (e.g. 375px) and desktop (e.g. 1440px) widths
- `npm run build` succeeds with no type errors (TypeScript strict) before each deploy
- Language switcher correctly toggles all pages between `/en` and `/mn` without broken links
- Contact form: submit a real test message and confirm the email arrives at the configured recipient
- Run Lighthouse (or Vercel's built-in checks) on the deployed preview for performance/accessibility/SEO before going live
