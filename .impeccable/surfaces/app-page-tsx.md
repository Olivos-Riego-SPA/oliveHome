---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface brief: OliveHome home (`app/page.tsx`)

**Mode:** Persuade. **Build:** code-led. **Chosen sketch:** `.impeccable/mocks/decision/conecta.html` (structure "Conecta lo que ya tienes").

**Audience:** owner or manager of a farm in Chile (also Argentina and the US) who is evaluating Olive+.
**Action:** "Escríbenos", which goes to the #contacto section (mailto to `tecnologias@olivos.cl` with a template, WhatsApp). The secondary action is "Ingresar a Olive+", to oliveplus.cl.
**Proof:**
- real screenshots in `app/public/images/plataforma/`;
- the figures +258 empresas / +678 dispositivos / +30.000 ha;
- compatible technologies;
- savings by strategy (21/36/43/57 %);
- the team (installation, agronomy, support, training).

**Constraints:** do not touch `/firmas`; no customer logos; no testimonials until they are approved; claims must follow `PRODUCT.md` § Capabilities and Constraints.
**Keep, reworked:** the 3D modules scene, the Centro de Extensión Digital block (reframed as the team/learning section), the tutorials teaser. The video does not come back.

**Open decisions:**
- The interactive guided demo will be built separately at `/lab-demo` and integrated later.

## Direction contract

THESIS: The platform first. The visitor sees Olive+ at work with real data from a real farm, before hearing about equipment. Equipment compatibility is proof inside each module, not the hero's headline. Rejects the generic SaaS hero, device sales, and a dark photo under a glass card. *(Revised 12/11/2026 after the user's review: the first version, "Conecta lo que ya tienes", read as selling technologies.)*

OWN-WORLD: Olive+ brand. A primary #084D6E wave over a field photo with the 0.86 primary veil. Tone circles with concentric rings that expand slowly like a drop falling on water. A curved edge with a green #028C44 strip. Light sections on #EEF4F7 with light rings. Green pill CTA; yellow only on PRO. Official module icons as the visual vocabulary. Raleway at mixed weights. Real screenshots at 10 px radius with a bluish shadow. White floating data cards.

STORY:
1. Hero: Tu campo completo, en un solo lugar.
2. Module explorer: Riego, Suelo, Clima, Planta, Pozos, Indicadores, each with its benefit and compatible equipment, and the 3D field scene as its visual. Screenshots are kept for the hero and the guided demo, so they do not repeat (user decision, 12/11/2026).
3. Quick guided demo of Olive+ (to be designed; built at /lab-demo and then integrated).
4. Monitoreo + PRO.
5. Productivity route with % savings.
6. The team that supports you, plus figures (+258 / +678 / +30.000 ha, 3 countries).
7. Tutorials.
8. Contact (Escríbenos).

The visitor understands what the platform does, believes it because they see real screens, and writes in, or goes into Olive+ if they are already a customer.

FIRST VIEWPORT:
- Wave with photo and rings at ~75 % height. Nav with "Ingresar a Olive+" as a text link.
- Left: 68 px mixed headline, subhead "Riega con datos, no con intuición", green "Escríbenos" (to #contacto) plus outline "Ingresar a Olive+" (to oliveplus.cl), and a row of the 7 module icons.
- Right: the real Riego screen breaking out of the wave into the white, with 3 floating cards of real data: ETc diario 4,34 mm · Sector 28 113 % · Envío a la DGA exitoso.
- Signature interaction: the explorer's tabs advance on their own with a progress bar and pause on hover or focus; the 3D scene loads only when the section gets close and pauses when it leaves the view.
- One authored moment in the hero: the screen and the cards come in one after another.
- With reduced motion, everything is static.

FORM: Structure "Conecta lo que ya tienes" (#5, lead of the roll), revised to platform-first at the user's request. seed:0ee41e1ef1fdcd8c

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
