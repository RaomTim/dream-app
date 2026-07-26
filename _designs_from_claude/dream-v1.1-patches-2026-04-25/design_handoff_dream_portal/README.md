# Handoff: Dream Portal — V1

A high-fidelity design reference for a contemplative dream / kairos journaling app, in French. The prototype defines a specific atmosphere ("sanctuaire", "narratrice", "kairos") expressed through typography, matter textures, tempi, and conditional voice. This package is for a developer using Claude Code to reimplement the design in a real codebase.

---

## 1. About the design files

The files in `prototype/` are a **design reference built in HTML + inline React (JSX via Babel) + plain CSS**. They are not production code. Do not ship them as-is. Your task is to **recreate these screens in the target app's existing environment** — React Native, Next.js, SwiftUI, Flutter, whatever the codebase uses — following that codebase's established patterns, component library, and state management.

If there is no existing environment yet, pick a framework that fits the product's needs (a contemplative, text- and animation-heavy mobile-first app → React Native + Reanimated, or SwiftUI, are natural fits) and implement there.

The design intent (tokens, voice, transitions, conditional UI behaviors) is the source of truth. The HTML is a visualization of that intent.

## 2. Fidelity

**High-fidelity.** Colors, typography scale, spacing scale, tempi, and easings are all final and should be ported verbatim into the target codebase's token system. Copy (French) is final for prototype screens — review with the product owner before shipping if the content model changes.

Layouts are final at mobile width (~390–430px). Desktop / tablet are out of scope for V1.

## 3. Source material

`reference/CLAUDE-DESIGN-MEGA-PROMPT-V1.md` is the full product+design brief (the "mega-prompt"). It is the canonical spec for voice, screens, components, conditional logic, and the 24-screen catalogue. **Read it before implementing.** Everything in this README is derived from it.

## 4. What's in the prototype

9 of the 24 spec'd screens, enough to establish the atmosphere and core flows:

| # | Screen key | File / component | Purpose |
|---|---|---|---|
| 1 | `home` | `screens-core.jsx` → `HomeScreen` | Journal substrat — vertical scroll of past kairos / captures as a living river |
| 2 | `capture` | `screens-core.jsx` → `CaptureScreen` | 3-step capture: somatic gate → field → post-capture confirmation |
| 3 | `journal` | `screens-core.jsx` → `JournalScreen` | Journal de Vie — chronological list of all captures with metadata |
| 4 | `detail` | `screens-core.jsx` → `DetailScreen` | Détail Kairos — single-entry expanded view with narratrice framing |
| 5 | `portrait` | `screens-deep.jsx` → `PortraitScreen` | Breathing constellation of the user's inner figures (3 toggles × 4 filters) |
| 6 | `voute` | `screens-deep.jsx` → `VouteScreen` | Anima Mundi Voûte — collective / archetypal sky |
| 7 | `meteo` | `screens-deep.jsx` → `MeteoScreen` | Météo de l'inconscient — emotional weather reading |
| 8 | `polyphonie` | `screens-deep.jsx` → `PolyphonieScreen` | Polyphonie lunaire — multi-voice lunar rhythm |
| 9 | `chat` | `screens-deep.jsx` → `ChatScreen` | Chat narratrice — conversational interface with strict conditional voice (Claude-backed) |

Navigation is driven by a single `screen` state (in `app.jsx`) toggled via the Tweaks panel (bottom-right) and the Home footer nav. In production, route these to real screens / nav stack entries.

### Screens still to build (catalogued in the mega-prompt, not in prototype)

Cercle, Oracle du Corps, Conte-miroir, Réentrée, Onboarding, Paramètres, Annales "tenu ensemble", Offre au kairos, Détail Figure, Feedback. The voice rules, tokens, and matter system defined here apply to all of them.

## 5. Design tokens

All tokens live in `prototype/styles.css` under `:root`. Port them into the target codebase's token system exactly.

### Colors (OKLCH, dark-first)

The app never uses pure `#000` or pure `#FFF`. Whites and blacks are tinted.

| Token | Value | Usage |
|---|---|---|
| `--night-floor` | `oklch(0.12 0.012 280)` | App background |
| `--night-warm`  | `oklch(0.16 0.015 60)` | Warm surface variant |
| `--ash-deep`    | `oklch(0.22 0.008 280)` | Card bg, inset surfaces |
| `--ash-mid`     | `oklch(0.34 0.010 60)` | Dividers, faint borders |
| `--ash-light`   | `oklch(0.52 0.012 60)` | Secondary text, meta |
| `--bone`        | `oklch(0.78 0.015 70)` | Primary text |
| `--embryonic`   | `oklch(0.92 0.008 80)` | Emphasis text, rare |

Matter-couleurs (low-saturation accents, use sparingly):

| Token | Value | Role |
|---|---|---|
| `--paper-warm`  | `oklch(0.62 0.045 70)` | Warm paper tint |
| `--stone-cool`  | `oklch(0.55 0.025 230)` | Cool stone tint |
| `--silk-gold`   | `oklch(0.70 0.080 80)` | Accent — kairos highlight |
| `--clay-earth`  | `oklch(0.50 0.060 50)` | Earth / grounding |
| `--obsidian`    | `oklch(0.28 0.030 290)` | Deep surface |
| `--ember-live`  | `oklch(0.65 0.140 40)` | Live / urgent — reserved |
| `--ember-soft`  | `oklch(0.55 0.080 40 / 0.35)` | Ember at rest |

### Typography

Three families, specific roles. No substitutions.

- **Serif**: `EB Garamond` (300, 400, 500; italic 300, 400). Titles, quotations, narratrice voice.
- **Sans**: `Inter` (300, 400, 500). Body, UI, meta.
- **Mono**: `JetBrains Mono` (400). Timestamps, field labels, technical hints.

Scale (classes in `styles.css`):

| Class | Family | Size / weight / leading | Usage |
|---|---|---|---|
| `.h1-seuil` | serif 300 | 39px / 1.15 / -0.01em | Screen thresholds |
| `.h2-section` | serif 400 | 31.25px / 1.20 / -0.005em | Section heads |
| `.h3-lecture` | serif 400 | 25px / 1.30 | Reading headers |
| `.h4-repere` | sans 500 | 20px / 1.40 | UI landmarks |
| `.body` | sans 400 | 16px / 1.55 | Body |
| `.meta` | sans 300 | 13px / 1.40 / +0.02em | Meta |
| `.mono` | mono 400 | 12.5px / 1.35 | Timestamps, codes |

### Spacing scale

`--s-1: 4px`, `--s-2: 8px`, `--s-3: 16px`, `--s-4: 24px`, `--s-5: 40px`, `--s-6: 64px`, `--s-7: 104px`, `--s-8: 168px`.

Whitespace is a feature. Screens breathe. Do not compress.

### Tempi (durations)

| Token | Value | Use |
|---|---|---|
| `--tempo-instant` | 100ms | Input feedback |
| `--tempo-tisse` | 380ms | Most UI transitions |
| `--tempo-ceremoniel` | 920ms | Screen enters, ritual moments |

### Easings

| Token | Curve | Character |
|---|---|---|
| `--ease-respire` | `cubic-bezier(0.32, 0.04, 0.25, 1)` | Breath — default |
| `--ease-tenue`   | `cubic-bezier(0.45, 0, 0.15, 1)` | Held / considered |
| `--ease-rituel`  | `cubic-bezier(0.7, 0.0, 0.3, 1)` | Ritual, screen change |

### Matter layers (grain / texture)

Every surface has optional noise overlays. Implemented as inline `<svg><filter type="fractalNoise">` defs in `Dream V1.html`, applied as `<div class="matter [linen|paper|stone|water|ember|silk|ash|earth]">`.

In production: reproduce via a noise-texture atlas (pre-rendered PNG/WebP per matter) or via shader / SKEffect / Reanimated noise primitive. The `ash` grain is fixed to the viewport as a sky layer (see `.sky` in styles.css).

Keep `mix-blend-mode: screen` and `opacity: 0.5` (or lower) — matter is always a whisper, never a texture.

### Radii, borders, shadows

- Radii: mostly none. Where used: 2px (inputs), 8px (cards), 16px (pill buttons). No large pill shapes.
- Borders: 1px `var(--ash-mid)` or `var(--ash-deep)`. Hairlines.
- Shadows: avoid. If needed, a soft `0 1px 0 var(--night-warm)` as a hairline separator on dark surfaces.

## 6. Screen-by-screen spec

For every screen, reference both this doc and `prototype/screens-core.jsx` / `prototype/screens-deep.jsx`.

### Home — journal substrat

- Dark scroll. Top: user's current kairos status (narratrice one-liner, serif italic).
- Vertical river of previous captures as cards (ash-deep bg, 1px ash-mid border, ~16px internal padding, 24px between).
- Each card: serif title, sans meta row (date mono + mood glyph), 2–3 line excerpt.
- Footer nav: icon row (journal, capture, portrait, voute, chat). ~56px tall, bone on night-floor, 1px ash-deep top border.
- A `.whisper` element may appear between the status and the river: full-width, transparent, serif italic, centered, ash-light → bone on hover. Used for gentle nudges ("un kairos t'attend pour cette question"). Tap → navigates to the relevant capture or detail.

### Capture — 3-step ritual

1. **Somatic gate.** Single centered question, serif. Three somatic options (tight / neutral / open) as large hit targets. Tap advances. No back button.
2. **Field.** Free-write textarea. Tall. Mono timestamp at top, bone text, 32px leading. No placeholder hint — the silence is the prompt. Auto-save on each keystroke (local).
3. **Post-capture.** Narratrice framing (serif italic, 25px, slow fade-in over `--tempo-ceremoniel`). Two quiet options: "déposer" / "continuer".

All three substeps transition with `--tempo-ceremoniel` + `--ease-rituel`.

### Journal de Vie

Chronological list. Each row: date (mono, left), title (serif, center), somatic glyph (right). Row height ≈ 72px. Tap → Détail.

### Détail Kairos

Single-entry view. Serif title, mono date+somatic, body in sans at 16/1.55. Below: narratrice framing block (serif italic, indented 24px on both sides, ash-light border-left). Below that: "retisser" action (enter narratrice chat with this kairos as context).

### Portrait — breathing constellation

SVG constellation of inner figures. Nodes breathe (opacity 0.6 ↔ 1.0 over 4–6s, offset per node). 3 toggles (mode) × 4 filters (timeframe/theme). Tap a node → opens Détail Figure (not in prototype — spec'd in mega-prompt).

**Production note:** prototype nodes are hand-laid. V2 should use d3-force (web) or a native force-layout equivalent for true drag/recover. Preserve the breathing.

### Anima Mundi Voûte

Collective / archetypal constellation. Same visual grammar as Portrait but with silk-gold accents for archetypes shared with the wider Anima Mundi corpus.

### Météo de l'inconscient

Emotional weather reading. Large serif headline (current "weather"). Below: three small cards — pression / vent / température — each with a mono label and a serif one-liner reading.

### Polyphonie lunaire

Lunar rhythm. Horizontal moon-phase strip, user's captures plotted along it. Tap a phase → filter detail list below.

### Chat narratrice (Claude-backed)

Conversational interface. System prompt enforces **conditional voice** (see mega-prompt section on voice): narratrice is never directive, never prescriptive, speaks in questions and mirrors. Uses `window.claude.complete({ messages, system })` in the prototype. In production, wire to the codebase's model client with the same system prompt.

UI: message stream, assistant in serif italic, user in sans. Input pinned bottom with a mono send-glyph. No typing indicator; use an ash-light ellipsis that breathes.

## 7. Voice & conditional UI (critical)

The mega-prompt defines strict rules for how the narratrice speaks and how the UI behaves around sensitive states (trauma gate, felt-shift gate, AHA capture). These are **not yet surfaced as components in the prototype** — they exist only as copy patterns in the chat. Implement them as:

- `FeltShiftGate` — prompts user to confirm a somatic shift before escalating.
- `TraumaGate` — detects trauma-adjacent content and offers an exit + resource hand-off.
- `AhaCapture` — surfaces an "écrire ce kairos" invitation when the model detects insight language.

All three must follow the conditional voice rules in the mega-prompt. Read the prompt before building.

## 8. Interactions & behavior

- **Screen enter:** `screen-in` keyframe in styles.css — opacity 0→1 with 8px upward translate, 920ms, `--ease-rituel`.
- **Taps:** no ripple, no scale bounce. Color change only, `--tempo-tisse`.
- **Scrolling:** natural. No snap. No pull-to-refresh (the app has no "refresh" — it has return).
- **Haptics:** prototype stubs only. In production, use the target platform's haptic API on: capture submit, felt-shift confirm, narratrice reply arrival. Keep them sparse — one per minute at most.
- **Loading:** never show spinners. Use the `.breathe` class (opacity 0.6↔1.0 on a 4s loop) on the target surface.
- **Empty states:** write real copy. Never "No items yet."

## 9. State management

For V1 implementation:

- `user` — auth state.
- `captures` — list of kairos entries. Each: `{ id, createdAt, somatic, field, narratriceFrame, tags, mood }`.
- `figures` — list of inner figures (for Portrait). Derived from captures via a backend process (out of scope here).
- `currentKairos` — the open kairos if any.
- `chatThread` — messages for the narratrice chat. Persist per-kairos.

Persist all of the above on-device (for offline) and sync. Dream-portal data is private and tender — encrypt at rest.

## 10. Assets

- **Fonts:** Google Fonts — EB Garamond, Inter, JetBrains Mono. Self-host in production.
- **Imagery:** none in prototype. The mega-prompt describes optional photographic imagery for section headers; none is bundled. Use placeholders until the design team delivers assets.
- **Icons:** the prototype has no icon set. Footer nav uses unicode glyphs as placeholders. Production should use a minimal hairline icon set (1.25px stroke, bone color) — commission or pick a library that fits (Lucide hairline, Phosphor thin).
- **Noise textures:** live SVG filters in the prototype. In production, pre-render to small tileable PNG/WebP or implement via shader — see §5 Matter layers.

## 11. Known gaps (for the receiving engineer)

From the final prototype summary, carry these into the implementation backlog:

- Only 9 of the 24 spec'd screens exist. Cercle, Oracle du Corps, Conte-miroir, Réentrée, Onboarding, Paramètres, Annales, Offre au kairos, Détail Figure, Feedback are spec'd in the mega-prompt but not mocked.
- Matter layers are applied minimally (ash grain + card borders). Do a full pass applying `linen/paper/water/ember/stone/silk` per-screen per the mega-prompt's matter table.
- Constellation is hand-laid. Wire a real force layout for V2.
- Haptique and Van Gennep transitions are CSS stubs. Hook real platform haptics and multi-stage liminal transitions.
- `AhaCapture`, `FeltShiftGate`, `TraumaGate` exist as copy patterns only — promote to first-class components.

## 12. Files in this bundle

```
design_handoff_dream_portal/
├── README.md                              ← you are here
├── prototype/
│   ├── Dream V1.html                      ← entry
│   ├── styles.css                         ← tokens + all styles
│   ├── app.jsx                            ← root + screen router
│   ├── screens-core.jsx                   ← Home, Capture, Journal, Détail
│   ├── screens-deep.jsx                   ← Portrait, Voûte, Météo, Polyphonie, Chat
│   └── tweaks-panel.jsx                   ← dev-only screen switcher
└── reference/
    └── CLAUDE-DESIGN-MEGA-PROMPT-V1.md    ← canonical product + design brief
```

To run the prototype locally: open `prototype/Dream V1.html` in a modern browser (Chrome, Safari, Firefox). No build step. Use the Tweaks panel (bottom-right) or Home footer nav to move between screens.

## 13. Implementation order suggested

1. Tokens + typography + matter primitive. Ship a design-system package before any screen.
2. Capture (the ritual heart). Get the 3-step flow right, including tempi and ease.
3. Home + Journal + Détail (read paths).
4. Chat narratrice + conditional-voice system prompt. Port the prompt from the prototype verbatim.
5. Portrait + Voûte (force layout).
6. Météo + Polyphonie.
7. Remaining 10+ screens from the mega-prompt.
8. `FeltShiftGate`, `TraumaGate`, `AhaCapture` as cross-cutting components.

Read the mega-prompt before writing any code. The voice is the product.
