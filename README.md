# Image Carousel

Infinite scroll carousel built with React. Navigation is scroll-only - trackpad, touch and mouse wheel.

## How it works

### Infinite loop - the clone trick

Native `overflow-x: scroll` handles all scrolling. The browser runs this on the compositor thread with no JS per frame.

The DOM layout is:

```
[ tail clones ] [ real images ] [ head clones ]
```

Clones are copies of the last/first images wide enough to always cover the viewport (2000px). The user starts scrolled to the real content. When scroll drifts into a clone zone, one line of JS teleports `scrollLeft` by `realW` (the total width of the real content). Because clone pixels are identical to what they replace, the jump is invisible.

### Loading

Two sequential fetches combat the initial blank screen:

1. **10 images** - resolves fast (~150ms), skeleton disappears, carousel is interactive
2. **30 images** - loads in the background, carousel silently expands

A shimmer skeleton covers the first fetch.

### Performance

| Problem | Fix | Saving |
|---|---|---|
| Full-res images decoded per scroll frame | Request Picsum at 2× display size via `/id/{id}/{w}/{h}` | ~99% fewer pixels decoded |
| Image decode blocks main thread | `decoding="async"` on every `<img>` | Decode moved off main thread |
| Scroll triggers page repaints | `will-change: scroll-position` | Browser promotes to GPU layer upfront |
| All images fetch on load | `loading="lazy"` | Only images near the viewport fetch |

## Structure

```
src/
  hooks/
    useImages.ts                    - two-step fetch (10 → 30 images)
  components/ImageCarousel/
    ImageCarousel.tsx               - carousel, clone math, scroll wiring
    ImageCarousel.module.css
    CarouselSkeleton.tsx            - shimmer placeholder
    CarouselSkeleton.module.css
  App.tsx                           - skeleton ↔ carousel swap
  index.css                         - app layout
```

## Running

```bash
npm install
npm run dev
```
