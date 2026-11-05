# index.html — slides 3-5 (the three sections)

Source: Ratribhojan Tyag — file key `HY1oDJS8TCoBGnTgxSKQ5l`
Base frame size: **1920 x 1080** (px -> vw divides by 1920)
Existing page: vertical Swiper `.vertical-swiper` — slide 1 title, slide 2 "What is Ratribhojan Tyag?".
This file covers what **continues after slide 2**.

**STATUS: built**

---

## Navigation

Vertical Swiper (existing down / up buttons) now has 5 slides:

| # | Slide | Frames |
|---|---|---|
| 1 | title scene | — (existing) |
| 2 | What is Ratribhojan Tyag? | 39:655 shows it leaving into section 3 |
| 3 | **Why should we do Ratribhojan Tyag ?** — section `why` | intro 39:655, slides 53:1145 53:1462 53:1611 53:1760 53:1909 53:2058 |
| 4 | **What are the benefits of Ratribhojan Tyag ?** — section `benefits` | intro 49:922, slides 53:2378 53:2536 53:2685 |
| 5 | **How can we avoid Ratribhojan?** — section `avoid` | intro 58:3124, slides 58:3530 58:3701 58:3872 |

The old placeholder slides 3-8 ("Slide 3" … "Slide 8") are removed.

Each section is a **nested horizontal Swiper** inside the sun circle: slide 0 is the empty sun
(intro), then the picture slides. Frames of the same section are states of one slide.

| State | Left arrow | Right arrow | Caption box |
|---|---|---|---|
| intro (sun only) | hidden | shown | hidden (parked at y 1131) |
| middle slides | shown | shown | shown |
| last slide | shown | hidden | shown |

---

## 0. Assets

### 0.1 — Images (all new files in `assets/images/`)

| File | Layer / use | px |
|---|---|---|
| `slide-why-1.png` … `slide-why-6.png` | picture inside the sun circle, Why section | 686 x 686, circle-masked |
| `slide-benefits-1.png` … `-3.png` | Benefits pictures | 686 x 686 |
| `slide-avoid-1.png` … `-3.png` | Avoid pictures | 686 x 686 |
| `fore-graund-3.png` | landscape, Why section (existing file) | 1920 x 555 |
| `landscape-benefits.png` | same shapes recoloured to blue / navy | 1920 x 555 |
| `landscape-avoid.png` | same shapes recoloured to teal | 1920 x 555 |
| `prev-btn.png`, `next-btn.png` | purple arrows (existing) | 80 x 124 |

Pictures were exported node by node from Figma (the code export leaves out image fills inside masks)
and cut to a circle. They are 1:1 with the design (686px for a 690px circle).
The sky is `verticalpanorama.png` (see 5b); sun, glow and halo rings are CSS. The Figma landscape SVGs are not used: the MCP export
is only 1024px wide, so the existing crisp PNG was recoloured instead (colour error ~5% for benefits / avoid,
0.25% for Why).

### 0.2 — Fonts

| Family | Used for | File |
|---|---|---|
| Paytone One | pill, caption | `fonts/PaytoneOne.ttf` (existing `@font-face`) |

---

## 1. Palette

```
why     sky   #9a80bf  #ad91b3  #c1a5a3  #d6b996  #ebcd87  #ffe07a   top -> horizon
        pill  rgba(142,62,126,.59)   text #ffe59e   caption heading #ffea03
benefits sky  #201b51  #261e59  #2c2062  #302168  #35236f           top -> horizon (night + stars)
        pill  rgba(62,82,142,.59)    text #ffe59e   caption heading #ffe815
avoid   sky   #e2c48d  #fadb7c  #e5e198  #d0e2b1  #bbe3cb           top -> horizon
        pill  rgba(28,190,215,.59)   text #ffffff   caption text    #ffe815
caption box   rgba(45,48,31,.52)   radius 42   (all sections)
sun / intro   #fffbeb              glow #fff59d
```

---

## 2. Structure (a continuous, parallax world)

```
.panorama                      fixed sky: verticalpanorama.png, scrolls slower than the slides   z 0
.vertical-swiper
├── .swiper-wrapper            slides: page 1, page 2, Why, Benefits, Avoid
│   └── .section-slide         only the halo + .sun-circle (nested .h-swiper of pictures)
├── .section-landscapes        FIXED mountains at the bottom, one img per section, colour crossfade   z 3
└── .section-hud               .hud-why / .hud-benefits / .hud-avoid: pill, arrows, caption          z 5
```

`.section-stage` size = `calc(1920 * var(--u))` by `calc(1080 * var(--u))` with
`--u: min(0.052083vw, 0.092593vh)` so the layout scales like a preview on any window.

## 3. Frame 53:1145 Guidelines — Why, slide 1 (same layout for 53:1462 … 53:2058)

  3- read frame 53:1145 from figma mcp local server https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-1145
     for image reference use @assets/images/

    3.1- `.section-pill` — "Why should we do Ratribhojan Tyag ?" Paytone One 48px #ffe59e, centred
      3.1.1- width 1000px, height 119px, radius 54px, top 18px, left 50%
    3.2- `.sun-circle` — diameter 690px, centre x 960, centre y 511 (top 166px)
      3.2.1- glow `0 0 40px 8px rgba(255,245,157,.9)`; slide 0 = cream #fffbeb sun
    3.3- `.sec-prev` left 370px, `.sec-next` left 1471px, 80 x 121, top 480px (centre y 540.5)
    3.4- `.section-caption` — width 872px, height 222px, radius 42px, top 841px
      3.4.1- heading Paytone One 36px #ffea03, body 32px white, line-height 92.29%, text width 823px, centred
    3.5- slider
      3.5.1- first slide -> empty sun (intro, frame 39:655), `.sec-next` -> slide 1 (this frame)
      3.5.2- `.sec-next` / `.sec-prev` -> next / previous slide, Swiper slide effect 600ms
      3.5.3- caption text = `data.js` key `slide-2.n`, split at the first line break into heading + body

## 4. Benefits (53:2378, 53:2536, 53:2685) and Avoid (58:3530, 58:3701, 58:3872)

    Same layout. Differences: pill width 1164px (benefits) / 904px (avoid); caption width 938px;
    avoid caption is 174px high, top 865px and has a single yellow line (no body).
    Keys `slide-3.n` and `slide-4.n`.

## 5. Vertical nav

    Existing `.slide-nav` (up / down chevrons) and the custom scrollbar keep working over the 5 slides.
    The down chevron hides on the last slide (existing behaviour), so the Pranam link is unchanged.

## 5b. Continuous parallax between the main slides

    Layers move at different speeds, so there is no seam between slides:

    - **Sky** (`.panorama`): one image for ALL five main slides, squashed to at most 4.4 screens tall and moved to
      `PANORAMA_STOPS = [0, .26, .49, .74, 1]` of its range (about 0.8-0.9 screen per slide), same duration as the
      slide change. Its top is Frame 3 (20:145: dark forest over stars), so page 1's forest hands over into it;
      then starry navy (page 2, Frame 36:531) -> indigo (Why) -> purple (Benefits) -> yellow dawn (Avoid).
    - **Sun circle + halo** ride with the slides (1 screen per slide), so they scroll away / in behind the mountains.
    - **Mountains** (`.section-landscapes`) stay fixed at the bottom; the new section's colour fades in on top
      while the old stays solid until the slide has arrived (`.is-on` / `.was-on`). They sink when you go back
      to page 2 and rise (1.5s) the first time you arrive in a section.
    - **Entrance** once a slide has arrived: sun rises (2s; waits 2s if the mountains are rising, else 0.3s),
      then halo, title pill, arrows and caption (`--t-sun` + 1.2 / 1.7 / 1.9s).
    - **HUD** (pill, arrows, caption) is outside the slides so it never scrolls; it fades out when a slide change
      starts and in again when it arrives.

    Tried and rejected earlier: Swiper parallax attributes, cross-fade of the vertical swiper,
    cover-then-slide, one landscape per slide (its dark ground edge showed as a line between slides).

---

## 6. Open questions

1. `data.js` English for `slide-4.3` said "Avoid drinking water completely…" (a copy of 4.2); changed to the Figma text. Hindi and Gujarati were already correct.
2. Frame 11's row in `figma-links.md` had its link in the Node ID column; fixed. Node IDs filled from the links.
3. The Pranam link / page after the last slide is unchanged.
4. The page runs 5 vertical slides; touch swipe stays disabled as before (arrows and the existing nav only).
