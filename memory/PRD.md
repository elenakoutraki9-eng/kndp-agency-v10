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

- 2026-07: Redesigned Portfolio/Our Work carousel (ProjectCarousel.jsx) — from 3-card coverflow to a premium editorial split-stage: large image panel (Ken-Burns zoom, directional spring slide + crossfade, hover arrows, swipe/drag) beside a detail card (big index "01 / 06", tag kicker, title, description, animated progress segments, prev/next + accent CTA), plus a thumbnail filmstrip below. Gentle autoplay (5.2s) pausing on hover/drag. All project data, descriptions, tags and "Σε εξέλιξη" badge unchanged; testids preserved. Added scrollbar-none utility to index.css.

- 2026-07: Admin dashboard at /admin (P0 backlog item). Backend: ADMIN_PASSWORD env (default kndp2025), POST /api/admin/login returns token, GET /api/admin/contacts protected via X-Admin-Token header. Frontend: introduced react-router-dom (App.js now BrowserRouter with "/"→Landing, "/admin"→Admin; existing landing moved verbatim into pages/Landing.jsx — no visual change). pages/Admin.jsx = simple password login (token in localStorage) + clean dashboard showing all leads (name, company, email, service tag, message, date) as a desktop table / mobile cards, with refresh + logout. Discreet "Admin" link added at very bottom of Footer. No existing sections/styling/animations changed.

- 2026-07: Admin lead management. Backend: ContactMessage gained status (default "New") + notes (default "") fields; new PATCH /api/admin/contacts/{id} (protected) updates status/notes; GET applies defaults to legacy docs via response_model. Frontend (pages/Admin.jsx dashboard rebuilt as 2-col lead cards): per-lead status dropdown (New/Contacted/Converted/Not Interested, colored pills, auto-save) + notes textarea with explicit Save; top controls bar filters by status & by service and sorts by date (newest/oldest); Export CSV button downloads currently-visible/filtered leads (UTF-8 BOM for Greek). Leads counter reflects filtered count. Same clean white/baby-blue style. Verified end-to-end via UI.

- 2026-07: "Spot new leads easily" enhancement (pages/Admin.jsx). New-status leads get a bold baby-blue border + ring + pulsing "NEW" badge, always sort to the top of the list (before the chosen date order), and a clickable "Νέα (N)" counter chip in the header quick-filters to New (toggle). Status persistence verified across reload.

- 2026-07: Redesigned admin dashboard from cards to a KANBAN board (user: compact + kanban + minimal card info). 4 columns (New/Contacted/Converted/Not Interested) with colored headers + counts. Compact draggable lead cards show name, company, service tag, short date only. Native HTML5 drag-and-drop moves a card between columns to change status (optimistic update + PATCH, persists; drop reads id from state with dataTransfer fallback). Click a card opens a detail modal (email, message, status select, notes editor + save). Kept service filter, date sort, Export CSV. Verified drag persistence via reload.

- 2026-07: Added phone number. Backend ContactMessage/Create gained `phone` (Optional). Contact form has a required "Τηλέφωνο" field (tel input) beside Company. Admin Kanban cards now feature name + phone (tel: link) + email (mailto: link) as the primary info (service tag + date demoted to a small footer row); detail modal shows phone too; CSV export includes a Τηλέφωνο column. Legacy leads without phone show "—".

- 2026-07: Card identity + required company. Kanban cards & detail modal now show company as the bold title with the person's name below (falls back to person name when no company). Contact form's Εταιρεία field is now required. Removed unused Building2 import.

- 2026-07: Made the Our Work / Portfolio section more compact so more fits on one screen. Reduced section padding (py-20/28→12/16), heading (6xl→5xl, mt-5→3), intro text (lg→base, mt-6→4); carousel: top margin 12/16→8/10, image aspect 16/11→16/9, detail padding 7/9→5/7, index 5xl/6xl→4xl/5xl, title 2xl/3xl→xl/2xl, tighter internal spacing, nav buttons 11→10, thumbnails 16x24/20x32→12x20/14x24; CTA block padding/text reduced. Layout/animations unchanged.

- 2026-07: Mobile animation reductions (<=767px via new hooks/useIsMobile matchMedia; desktop fully intact). Reveal/WordMask/MaskLine: shorter durations, less/no movement + rotation, tighter stagger. Magnetic: static wrapper on touch. ParallaxY: output 0 on mobile. Hero phone mockup: disabled scroll parallax (phoneY) + pointer parallax (imgMX/imgMY), simplified entrance (no scale pop, smaller y, shorter duration), floating card's animate-float-soft loop removed on mobile. No layout/content/styling changes. ServicesPhoneMockup + ChatPhone demo interactions left as-is (core content, not parallax).

- 2026-07: Sitewide DISABLE all animations/transitions on mobile (<=767px); desktop fully intact. (1) App wrapped in framer-motion <MotionConfig skipAnimations={isMobile} reducedMotion={isMobile?"always":"never"}> so all JS motion snaps to final/static. (2) Global CSS media query zeroes animation/transition durations + iteration-count 1 + scroll-behavior auto on mobile (kills Tailwind transitions, keyframes float-soft/spin/pulse, btn-shine, react-fast-marquee). (3) StackPanel renders static (no scroll-scale/sticky) on mobile. (4) Lenis smooth-scroll skipped on mobile (native scroll). Verified: mobile hero opacity 1 instantly, no hidden-in-view elements, layout intact; desktop phone demo still animating.

- 2026-07: Replaced mobile "no animation" with subtle fast fade-ins (~350ms) on scroll-into-view; desktop unchanged. MotionConfig on mobile uses reducedMotion="always" (strips transform/slide/scale/parallax + transform loops, KEEPS opacity) and NO skipAnimations (so fades play). Shared primitives Reveal/WordMask/MaskLine → opacity-only fade @0.35s, no stagger, no delay on mobile. Hero entrance timings shortened to 0.35s with 0 delay (no multi-step) on mobile. Decorative CSS loops disabled via targeted CSS (.animate-float-soft/.animate-pulse/.animate-spin-slow, btn-shine::after) — NOT a blanket * rule (would clobber framer WAAPI fades). Marquee play={!isMobile}. StackPanel still static on mobile (no stacking); Hero parallax/Lenis still off on mobile. Verified: mobile content fades in, nothing stuck hidden (except intended hover-only carousel arrows), no slides/parallax; desktop fully intact.

## Next Tasks
1. Fix service field mismatch (services array vs singular service) in ContactSection/backend model.
2. Add lightweight admin login to view enquiries in-browser.
3. Wire Resend email notifications for new contact messages.
4. Swap booking placeholder for real scheduling link.

- 2026-07: Enabled full animations on MOBILE (desktop view kept identical). Root fix: App.js MotionConfig changed from `reducedMotion={isMobile?"always":"never"}` to `reducedMotion="never"` (was globally disabling all Framer Motion on phones). Also removed per-component mobile gating in Reveal.jsx (WordMask slide, MaskLine, Reveal fade/slide-up, ParallaxY), Hero.jsx (entrance scale/float/phone scroll-parallax) and Marquee.jsx (marquee now scrolls on mobile). Kept desktop-only: Magnetic buttons (mouse-based) and StackSection sticky-stacking (layout safety on small screens). Verified: WordMask caught mid-animation on mobile, Reveal initial states present + fire on scroll, no horizontal overflow / no layout breakage at 390px.
