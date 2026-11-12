# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** owners and managers of farms (orchards, vineyards, fruit) in Chile — and also Argentina and the US — who are evaluating Olive+ and want to understand what it is and how it benefits their irrigation. They are not yet users of the platform.
- **Secondary:** existing Olive+ customers who come in to log in ("Ingresar a Olive+" → `https://www.oliveplus.cl`) or to watch tutorials.
- Situation: domain experts (they know ETo/ETc, water potential, chill hours), often on a phone and in the field with unreliable connectivity.

## Product Purpose

OliveHome (`https://home.oliveplus.cl`) is the public landing page of **Olive+**. Its job is to communicate the value of the platform and convert interested visitors into contacts (main CTA: email to `tecnologias@olivos.cl`, temporary; secondary: WhatsApp `+56 9 3372 0947`). Success = a farm owner understands what Olive+ is, believes it serves their operation, and gets in touch.

## Positioning

Olive+ is the **Olivos Riego** platform that brings irrigation, soil, plant, climate and wells together in one place, so the farm owner or manager can **irrigate with data, not intuition**. What sets it apart: **it connects to the equipment you already have** (Talgil DREAM/SAPIR, PESSL, DAVIS, FloraPulse; well telemetry connects through the Talgil controller) and behind it is **an agronomic and technical team** that installs, trains and supports you. It is not resold third-party software. *(Confirmed by the user, 2026-11-12.)*

## Operating Context

- Sales process in stages (hunting → interest → formal meeting + demo); the landing supports the first ones.
- The product's source of commercial truth is `$OLIVE_VAULT/OlivePlus/marketing/presentacion-comercial.md` (verified against the platform, Nov 2026).
- Plans: **Base** and **PRO** (gold seal). PRO adds: Smart Analysis, comparison of two periods, irrigation map with 4 layers, forecast, Monitoring, advanced Indicators widgets.
- No prices are published.

## Capabilities and Constraints

- Modules on sale: Irrigation, Soil, Plant, Climate, Wells (Water source), Indicators, Monitoring (PRO exclusive). "Data Analysis" (Power BI panels) **is not sold as a feature**.
- Cross-cutting: Spanish/English, metric/imperial, dark mode, browser or installable app, multi-farm, Excel/PDF export, team notes on charts, help center with videos (requires a session).
- **Forbidden claims:** "real time", "instantly", "live"; "AI"; "controls/actuates" irrigation; configurable notifications or threshold alerts (they do not exist yet); virtual stations; hourly irrigation; prices; dates or "in development" for upcoming features.
- DGA (sending readings with a receipt) is only mentioned for Chile.
- Stack: Next.js 16 App Router + React 19 + Tailwind 3 + Framer Motion + react-three-fiber (3D scene of the modules). No backend.
- Out of scope: `/firmas` (internal email-signature generator) and `/lab-3d` (internal test page).

## Brand Commitments

- Olive+ design system: `C:/Users/nel_z/source/OliveMarketing/marcas/oliveplus/` (`DESIGN.md`, `tokens.css`, `tono-de-voz.md`, official module icons in `iconos/modulos/`). Primary `#084D6E` as the lead; turquoise `#00C1C6` **or** green `#028C44` (never both in the same piece); yellow `#F2BC09` only for details; module colors only next to their icon; Raleway.
- Logo: the user's **audited** SVG (better proportions than the one in OliveMarketing): `app/public/images/logo-oliveplus-negativo.svg` (stone + yellow, for dark backgrounds) and `logo-oliveplus-color.svg` (charcoal `#3C3C3C` + yellow, derived with the user's authorization to recolor the SVG).
- Voice: technological but approachable, agronomic, practical; informal "tú" address in Spanish; sentence case; no emoji; decimal comma; dd/mm/yyyy dates; benefit, not feature. Official headline: "La manera más fácil de gestionar tu riego". Brand phrases: "Riega con datos, no con intuición", "Tu campo completo, en un solo lugar", "Decides con el clima, compruebas en el suelo, confirmas con la planta".
- All copy in Spanish (es-CL).

## Evidence on Hand

- **Real platform screenshots** (a farm that authorizes being shown, "Rio Peumo"; shown as-is): `app/public/images/plataforma/` — irrigation-map, irrigation-map-comparison, irrigation-charts-comparison, monitoring, climate-etc, soil-bands, soil-advanced-delta, plant-summary, plant-map, indicators-dashboard, smart-analysis-comparison, wells-summary (~1460×820 px).
- **Official figures:** +258 companies, +678 devices, +30,000 ha; Chile, Argentina and the US (`presentacion-comercial.md` §2).
- **Water savings by strategy** (estimate by Olivos agronomists, published without a source): ETc 21 %, water balance 36 %, physiological threshold 43 %, regulated deficit irrigation 57 %.
- Compatible technologies, SVG logos in `app/public/images/aliados/` (`*-color.svg`, `*-blanco.svg`):
  - DAVIS: official.
  - PESSL: vectorized in OliveMarketing.
  - Talgil: vectorized from the official 1024 px PNG.
  - FloraPulse: icon rebuilt geometrically, wordmark traced.
  - None of the four providers publishes an official SVG.
- Existing **3D scene** of the modules (`components/escena_*.tsx`) and the **tutorials** page (YouTube videos).
- **Do not invent:** testimonials (pending, being pushed internally), customer logos (rule: no naming customers; files `cyt_logo`, `logo_sofruco`, `logo_agrofarming`, `riopeumo_logo` stay in the repo unused), prices, extra metrics.

## Product Principles

1. **Show the real product**, don't describe it: real screens over claims.
2. **Benefit before feature**, in the farmer's language, with technical terms that build credibility (ETc, water potential).
3. **Tell the truth**: only what exists today and real figures; what's coming has no dates.
4. **The team is part of the product**: the support (installation, agronomy, training) is a differentiator, not a footnote.
5. **Works in the field**: lightweight and readable on a phone with a poor connection.

## Accessibility & Inclusion

WCAG AA as the floor. Respect `prefers-reduced-motion` (no autoplay without a pause, no motion that blocks reading). Keyboard-operable controls. Main audience on mobile in outdoor light: high contrast.
