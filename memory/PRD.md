# KNDP Agency Website — PRD

## Original Problem Statement
Build the KNDP agency website. Clean, modern startup look; white + baby blue colors; hero "We Build Whatever You Need" with given subheading; DO NOT mention AI anywhere. Pages: Home (hero, what we do, why KNDP, CTA), Services (8 offerings incl. custom tools & automations), Portfolio (coming-soon placeholder), About (founder story/mission), Contact (form + email placeholder + calendar/booking link placeholder). Full-stack with contact form saved to database only.

## Architecture
- Frontend: React 19 single-page layout (no routes). One continuous scroll: Hero → Services → Portfolio → About → Contact. Sticky stacked panel transitions between sections (framer-motion scale/dim), scroll-spy navbar + footer smooth-scroll via Lenis, animated hero background (grid, drifting blobs, mouse-parallax shapes), word-masked headlines, animated counters, magnetic buttons, custom cursor ring, editorial marquee, sonner toasts.
- Backend: FastAPI (`/api` prefix). POST /api/contact (save message), GET /api/contact (list messages), GET /api/ health.
- Database: MongoDB via MONGO_URL/DB_NAME, collection `contact_messages` (uuid ids, ISO timestamps).

## Implemented
- 2026-08-19: All sections with award-style art direction: kinetic masked hero, animated hero background, stacked sticky panels, bento grids, numbered manifesto chapters, editorial marquee, giant dark footer.
- 2026-08-19: Working contact form (service chips, validation, toast feedback) saving to MongoDB.
- 2026-08-19: Portfolio filled with 6 realistic placeholder project cards (images, tags, "In progress" badges) keeping the coming-soon framing.
- 2026-08-19: Converted from 5 routed pages to a single-page continuous scroll with section smooth-scroll nav and scroll-spy active states.
- 2026-08-19: Fixed stacked-panel clipping — panels measure their height and only pin after all content has scrolled through.
- 2026-08-19: Trust & conversion pass — hero stats (projects/2h reply promise/4w delivery), promise chips ("Free estimate · Reply within 2 hours · You own everything"), all primary CTAs changed to "Get a Free Estimate", new FAQ accordion panel (5 Q&As) between About and Contact, 2-hour response line near CTAs.
- 2026-08-19: Performance pass — replaced per-panel brightness() filter animation with a GPU-cheap opacity overlay, halved hero background complexity (fewer floating shapes, blur-3xl → blur-2xl blobs, will-change hints), compressed hero/about images via CDN params, lightened nav backdrop blur, mobile menu now animates opacity/translate instead of height.
- 2026-08-19: Added 5 new stacked panels: What We Can Build (6 icon cards), Problem → Solution (4 pairs), How It Works (dark 3-step panel, 48h free plan promise), Who Is KNDP For (7 business types + inclusive highlight card), Testimonials (3 placeholder cards, stories coming soon). Stack scale/dim capped at depth 3 for 10 panels. Fixed WordMask words randomly staying hidden — whileInView now observes the untransformed mask with variant propagation.
- No "AI" mentioned anywhere on the site.

## User Personas
- Prospective client (SMB owner): browses services, submits project enquiry.
- Founder/owner: reads submissions via GET /api/contact (no admin UI yet).

## Implemented (2026-08-19)
- All 5 pages with award-style art direction: kinetic masked hero reveal, parallax hero image, bento grids, numbered manifesto chapters, editorial marquee, giant dark footer with KNDP wordmark.
- Working contact form (service chips, validation, toast feedback) saving to MongoDB.
- Mobile responsive nav with animated menu. All interactive elements carry data-testid.
- No "AI" mentioned anywhere on the site.

- 2026-08-19: Restructured scroll — sticky/stacked transitions now only on Hero→Problem→Solution and How It Works→Portfolio pairs; all other sections use natural scroll with entrance animations. Removed standalone "What We Can Build" (merged as "A few examples" into Services) and "Who Is KNDP For?" (merged into About).
- 2026-08-19: Removed the About section entirely (incl. founder story, Why KNDP, values, Who Is KNDP For grid) and the About link from navbar + footer. Flow: Hero → Problem→Solution → Services → How It Works → Portfolio → Testimonials → FAQ → Contact.
- 2026-08-19: Replaced hero photo with animated phone mockup (ChatPhone component) — looping chat conversation (customer left/grey, KNDP right/baby blue) with typing indicators and a mini booking-app preview card with check animation; ~10s loop.



- 2026-07: Portfolio carousel (ProjectCarousel.jsx) — removed the 3D stacked/coverflow depth effect (no more faded/scaled/rotated side cards); now a single-card-at-a-time slide carousel with the same arrow buttons, dot indicators, swipe/drag, and wrap-around.


- 2026-07: Made Services and Contact sections more compact — reduced section/card padding, spacing, icon/text sizes across offering cards, idea cards and the 8-row service list; Contact form narrowed to max-w-md with smaller inputs/chips/textarea (3 rows) so more content fits without scrolling.


- 2026-07: Visual-editor edits — removed Hero promise-row checkmarks; increased WordMask reveal padding to prevent descender/ascender clipping on headlines site-wide; made How It Works section more compact (padding/card sizes reduced); Portfolio carousel now shows a partial peek of prev/next cards (faded, no rotation) alongside the active center card.


- 2026-07: Removed the Hero stats row (Projects on the bench / Response time promise / Typical website delivery counters).


- 2026-07: Redesigned Services' 8-item list into 3 grouped categories (For Your Customers / For Your Team / For Your Operations); rewrote all 8 descriptions to be outcome/customer-focused, added a "who this is for" line per card, and a per-card "Let's talk" button scrolling to Contact. Kept existing white/baby-blue card styling; no animated mockups exist on any card currently (previously removed per earlier request).


- 2026-07: Removed the Testimonials section entirely (deleted TestimonialsSection.jsx, removed from App.js). Page now flows Portfolio -> FAQ -> Contact.


- 2026-07: Made "Problems We Solve" section more compact (py-20/28 -> py-12/16, headline text-4xl/6xl -> text-3xl/5xl, row spacing/padding/icon sizes reduced).


- 2026-07: Removed Services offering-cards bento grid; made FAQ section more compact; moved FAQ section to appear after Contact (page order: Hero -> Problems -> Services -> How It Works -> Portfolio -> Contact -> FAQ -> Footer).


- 2026-07: Added a phone mockup (ServicesPhoneMockup.jsx) to the Services section, sitting alongside the grouped service category cards (sticky on desktop, stacked below on mobile). Cycles through 3 mini screens on a 2.6s loop: website/landing page, mobile app UI, and dashboard/web tool, with progress dots + label, in white/baby-blue palette.


- 2026-07: Replaced Hero phone mockup content (was notification feed) with an interactive "business idea generator" demo (ChatPhone.jsx) — typed business name (Restaurant/Salon/Gym/Retail Store) -> CTA button tap -> results screen with 4 relevant build ideas popping in, looping continuously. Implemented via async/await timeout chain (not setInterval) to avoid the double-increment cycling bug seen in the earlier notification-feed version.

## Prioritized Backlog
- P0: Admin view for contact submissions (protected page or basic auth).
- P1: Email notification on new enquiry (Resend integration).
- P1: Real booking calendar link (Cal.com/Calendly) replacing placeholder.
- P2: Real portfolio case studies once projects exist.
- P2: Blog/insights section, SEO metadata expansion.

- 2026-08: Full Greek translation of entire site (Navbar, Hero, ChatPhone, Problem/Solution, Services, ServicesPhoneMockup, HowItWorks, Portfolio, Contact, FAQ, Footer, Marquee) + Manrope font for Greek glyph support. Verified via testing_agent: 100% pass, no layout/overflow issues, contact form persists correctly.
- 2026-08: Enlarged Hero phone mockup (~15% bigger via zoom scale bump).
- 2026-08: Replaced ServicesPhoneMockup content — now an animated app screen cycling through all 8 services: a menu list (icon + title per service) with a looping tap animation that slides into a one-line detail screen per service, then slides back and advances to the next service continuously. Same phone size/position, white/baby-blue palette.

## Known pre-existing (non-blocking) issue
- Contact form sends `services` (array) but backend model expects singular `service` — selected chip not persisted (name/email/message still save fine).

- 2026-07: Greek translation review — pushed genuine industry/technical terms to English while keeping all descriptive prose + marketing brand names Greek. Changes: Portfolio tags Εσωτερικό Εργαλείο→Internal Tool, Αυτοματισμός→Automation; ChatPhone labels Πρόγραμμα Επιβράβευσης/Επιβράβευση Πελατών→Loyalty Program, Ταμειακό Σύστημα (POS)→POS Integration; service name Αυτοματισμοί/Αυτοματισμός→Automations/Automation across Hero rotating chip, Marquee, Services card, ServicesPhoneMockup, Contact chip. Kept Greek: Έξυπνα Εργαλεία, Προγράμματα, Έξυπνες Ψηφιακές Λύσεις, all prose/headings. Text-only; no layout/animation/style changes.

## Next Tasks
1. Fix service field mismatch (services array vs singular service) in ContactSection/backend model.
2. Add lightweight admin login to view enquiries in-browser.
3. Wire Resend email notifications for new contact messages.
4. Swap booking placeholder for real scheduling link.
