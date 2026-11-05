# Figma Frame Links

## Base frame width

1920

<!-- The Figma frame's width in px. Every px -> vw conversion divides by this.
     Get it wrong and the whole page mis-scales. Usually 1440 or 1920. -->

## Frame Index

## [index].html

| Frame    | Node ID         | Figma Link                                                                                 | Used for                                 |
| -------- | --------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| Frame 1 | node-id=1-2 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=1-2&m=dev | Page 1 — day: sunrise scene, ornate title pill, down chevron |
| Frame 2 | node-id=1-1338 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=1-1338&m=dev | Page 1 — night: moon, stars, forest, title moves up, home shown |
| Frame 3 | node-id=20-145 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=20-145&m=dev | Page 1 — dark forest rises over a starry sky (= top of verticalpanorama.png) |
| Frame 4 (labelled Frame 3) | node-id=36-531 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=36-531&m=dev | Page 2 — What is Ratribhojan Tyag? on the starry navy sky |
| Frame 5 | node-id=39-655 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=39-655&m=dev | Why intro — dusk sky, big sun, only the right arrow |
| Frame 8  | node-id=53-1145 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-1145&m=dev | Why 1 — Prohibited In Jain Dharma        |
| Frame 9  | node-id=53-1462 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-1462&m=dev | Why 2 — Bad Karma                        |
| Frame 10 | node-id=53-1611 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-1611&m=dev | Why 3 — Uncountable Microbes             |
| Frame 11 | node-id=53-1760 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-1760&m=dev | Why 4 — Highway to Hell (Narak)          |
| Frame 12 | node-id=53-1909 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-1909&m=dev | Why 5 — Health Problems                  |
| Frame 13 | node-id=53-2058 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-2058&m=dev | Why 6 — Doctor's suggestion              |
| Frame 7  | node-id=49-922  | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=49-922&m=dev  | Benefits intro (sun only)                |
| Frame 14 | node-id=53-2378 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-2378&m=dev | Benefits 1 — Better Digestive System     |
| Frame 15 | node-id=53-2536 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-2536&m=dev | Benefits 2 — Better sleep                |
| Frame 16 | node-id=53-2685 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=53-2685&m=dev | Benefits 3 — Better Energy Flow          |
| Frame 17 | node-id=58-3124 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=58-3124&m=dev | Avoid intro (sun only)                   |
| Frame 18 | node-id=58-3530 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=58-3530&m=dev | Avoid 1 — food after sunset              |
| Frame 19 | node-id=58-3701 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=58-3701&m=dev | Avoid 2 — water after sunset             |
| Frame 20 | node-id=58-3872 | https://www.figma.com/design/HY1oDJS8TCoBGnTgxSKQ5l/Ratribhojan-Tyag?node-id=58-3872&m=dev | Avoid 3 — food no, water / medicines yes |

---

## How to Read Each Frame

For every frame listed above, read ALL of the following from the Figma MCP
local server using get_design_context / get_metadata:

- Layout & spacing — exact positions, padding, margin, gap, alignment
- Layer names — use as class names and image filenames
- Layer hierarchy — parent > child order must match in the HTML DOM
- Colors & gradients — exact hex/rgba values
- Typography — font family, size, weight, letter spacing, line height
- Images — read layer name, map to /assets/images/[layer-name].png
- Prototypes & interactions — every click, tap, hover action
- Navigation targets — which frame or page each interaction leads to
- Animations & transitions — type, duration, easing
- Overlays — position, backdrop, close behavior
- Scroll behavior — fixed, sticky, overflow settings
- Component states — default, hover, pressed, disabled
- Variants — all variant properties for each component
- Auto layout — direction, spacing, padding, fill/hug/fixed sizing
- Constraints — how layers scale or pin relative to parent

Note: layers at `opacity: 0` in a frame are usually that state's start/end
position for an animation, not separate elements. Check whether two frames are
two pages or one page in two states before building.

Note: a layer positioned beyond the frame edge (e.g. `left: 2063px` in a
1920-wide frame) is parked off-canvas. Ask before building it.

---

## Interaction Map

> Fill after reading Figma. Drives click events and navigation.

| Page  | Layer Name                    | Interaction | Target                                     | Animation          |
| ----- | ----------------------------- | ----------- | ------------------------------------------ | ------------------ |
| index | down / up chevrons (existing) | click       | next / previous vertical slide (5 slides)  | Swiper slide 700ms |
| index | Polygon right (`.sec-next`)   | click       | next picture slide inside the section      | Swiper slide 600ms |
| index | Polygon left (`.sec-prev`)    | click       | previous picture slide / back to empty sun | Swiper slide 600ms |
| index | Home (existing)               | click       | `index.html`                               | none               |

---

## Sliders

> Fill when a page has a slider. Swiper.js only.

| Page  | Slider Layer         | Slides (node ids)                                                  | Effect            | Synced with |
| ----- | -------------------- | ------------------------------------------------------------------ | ----------------- | ----------- |
| index | Why `.h-swiper`      | intro 39:655, 53:1145, 53:1462, 53:1611, 53:1760, 53:1909, 53:2058 | slide, horizontal | caption box |
| index | Benefits `.h-swiper` | intro 49:922, 53:2378, 53:2536, 53:2685                            | slide, horizontal | caption box |
| index | Avoid `.h-swiper`    | intro 58:3124, 58:3530, 58:3701, 58:3872                           | slide, horizontal | caption box |

---

## Translations

> Figma carries English only. All three languages live in `assets/js/data.js` (`window.translationsData`).

| Page  | Keys in data.js                                                                                                                                       |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| index | `title`, `title-1` … `title-4`, `slide-1`, `slide-2.1` … `slide-2.6`, `slide-3.1` … `slide-3.3`, `slide-4.1` … `slide-4.3` (English, Hindi, Gujarati) |

Caption text uses `"Heading
Body"`; the first line becomes the yellow heading.
