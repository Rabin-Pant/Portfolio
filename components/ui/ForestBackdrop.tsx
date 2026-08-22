// components/ui/ForestBackdrop.tsx
'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Each scene is one backdrop photo plus the section ids it covers. Sections
 * must be listed in the order they appear on the page — the scroll handler
 * walks them top-down and keeps the last one whose top has passed the
 * viewport midpoint, the same approach the Navbar uses for its active link.
 */
// `boost` compensates for source quality, not the scrim (the scrim sits in
// its own layer above every scene and is untouched by this). forest-floor/
// forest-water are lower-resolution and much more compressed than branch.jpg
// (474px/~33KB vs 612px/146KB) and are naturally soft, low-contrast shots to
// begin with (mist, dappled light) — the same color-grade layer that
// branch.jpg shrugs off crushes them further. A contrast/saturation lift on
// the image itself reads as more detail without changing anything text sits
// on top of.
// Filenames matter here, not just as labels: these two have had their file
// content swapped multiple times during setup, and browsers cache the
// resulting /_next/image response by full URL — a hard refresh doesn't
// reliably bust that. Renamed to filenames that were never previously
// requested, so there is nothing anywhere (browser, Next's own image-
// optimizer disk cache) that could be holding a stale cached response.
const SCENES = [
  { src: '/images/branch.jpg', sections: ['hero', 'about'], boost: false },
  { src: '/images/forest-floor.webp', sections: ['experience', 'interests', 'skills'], boost: true },
  { src: '/images/forest-water.webp', sections: ['projects', 'contact'], boost: true },
] as const;

const SECTION_SCENE: [string, number][] = SCENES.flatMap((scene, index) =>
  scene.sections.map((id) => [id, index] as [string, number])
);

/* ------------------------------------------------------------------ *
 * Wind gust — canvas particle layer
 * ------------------------------------------------------------------ */

const GUST_MS = 2600;
const LEAF_COUNT = 96;
const DASH_COUNT = 28;

// Muted sage / dry-gold tones pulled from the site's green palette, so the
// debris reads as canopy litter rather than confetti.
const LEAF_RGB = [
  [150, 178, 116],
  [196, 182, 118],
  [118, 148, 100],
  [214, 196, 140],
  [134, 160, 108],
] as const;

type Leaf = {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  size: number;
  rot0: number;
  vrot: number;
  swayAmp: number;
  swaySpeed: number;
  swayPhase: number;
  delay: number;
  life: number;
  alpha: number;
  sprite: number;
};

function makeLeaves(w: number, h: number): Leaf[] {
  const leaves: Leaf[] = [];
  for (let i = 0; i < LEAF_COUNT; i++) {
    // Depth: small+slow leaves read as far away, large+fast as close.
    const depth = Math.random();
    const size = 9 + depth * 27;
    leaves.push({
      // Start off the left edge, spread out so they don't arrive as a wall.
      x0: -80 - Math.random() * 520,
      y0: Math.random() * h * 1.15 - h * 0.08,
      vx: 380 + depth * 620 + Math.random() * 180,
      vy: -80 + Math.random() * 170,
      size,
      rot0: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 5.5,
      swayAmp: 10 + Math.random() * 40,
      swaySpeed: 1.4 + Math.random() * 2.6,
      swayPhase: Math.random() * Math.PI * 2,
      delay: Math.random() * 520,
      life: 1.5 + Math.random() * 1.0,
      alpha: 0.46 + depth * 0.44,
      sprite: (Math.random() * LEAF_RGB.length) | 0,
    });
  }
  return leaves;
}

/** Thin, fast motion streaks — the air itself moving, between the leaves. */
type Dash = {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  len: number;
  width: number;
  delay: number;
  life: number;
  alpha: number;
};

function makeDashes(w: number, h: number): Dash[] {
  const dashes: Dash[] = [];
  for (let i = 0; i < DASH_COUNT; i++) {
    const depth = Math.random();
    dashes.push({
      x0: -140 - Math.random() * 460,
      y0: Math.random() * h,
      vx: 900 + depth * 1250,
      vy: -30 + Math.random() * 70,
      len: 40 + depth * 150,
      // Bumped because the backing store renders at 0.6 scale — a 0.7px line
      // would land on well under one device pixel and wash out.
      width: 1.2 + depth * 1.9,
      delay: Math.random() * 700,
      life: 0.85 + Math.random() * 0.7,
      alpha: 0.16 + depth * 0.3,
    });
  }
  return dashes;
}

/** The leaf silhouette: a pointed lens, drawn centred on the origin. */
function leafPath(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, 0);
  ctx.quadraticCurveTo(0, -s * 0.42, s * 0.5, 0);
  ctx.quadraticCurveTo(0, s * 0.42, -s * 0.5, 0);
}

// Leaves are blitted from pre-rendered sprites rather than re-tessellating
// two quadratic curves per leaf per frame — with ~120 leaves plus trails that
// path work dominated the frame budget.
const SPRITE_BOX = 48;
const SPRITE_LEAF = SPRITE_BOX * 0.9;

function makeLeafSprites(): HTMLCanvasElement[] {
  return LEAF_RGB.map(([r, g, b]) => {
    const c = document.createElement('canvas');
    c.width = SPRITE_BOX;
    c.height = SPRITE_BOX;
    const cx = c.getContext('2d');
    if (cx) {
      cx.translate(SPRITE_BOX / 2, SPRITE_BOX / 2);
      cx.fillStyle = `rgb(${r},${g},${b})`;
      leafPath(cx, SPRITE_LEAF);
      cx.fill();
    }
    return c;
  });
}

/**
 * Paints one gust of wind-blown leaves whenever `gust` changes. Runs for
 * ~2.6s then clears itself and stops the rAF loop, so there is no ambient
 * cost between transitions. Positions are computed from elapsed time rather
 * than integrated per frame, so a dropped frame can't accumulate drift.
 */
const GustCanvas = ({ gust, enabled }: { gust: number; enabled: boolean }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    // `desynchronized` lets the browser skip a compositing round-trip for a
    // canvas that is pure decoration and never read back.
    const ctx = canvas?.getContext('2d', { desynchronized: true });
    if (!canvas || !ctx) return;

    // The backing store is deliberately smaller than the element and stretched
    // back up by CSS. This measurably cuts the cost of the canvas 2D draw
    // calls themselves; it does not meaningfully move the compositor's
    // per-frame raster cost for the layer (that cost tracks on-screen size,
    // not source resolution), but it's still free to keep.
    const RES = 0.6;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.max(1, Math.round(w * RES));
    canvas.height = Math.max(1, Math.round(h * RES));
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    // Draw in CSS-pixel coordinates; the transform maps them onto the smaller
    // backing store, so none of the particle maths below has to change.
    ctx.setTransform(RES, 0, 0, RES, 0, 0);

    const leaves = makeLeaves(w, h);
    const dashes = makeDashes(w, h);
    const sprites = makeLeafSprites();

    // Pre-render the haze glow once, at a small fixed size and scaled up on
    // draw. It used to be built at viewport width, so on a 1080p screen every
    // frame blitted a ~1920x1920 source; a smooth radial gradient survives
    // that upscale with no visible difference.
    const HAZE_TEX = 192;
    const hazeR = w * 0.5;
    const haze = document.createElement('canvas');
    haze.width = HAZE_TEX;
    haze.height = HAZE_TEX;
    const hctx = haze.getContext('2d');
    if (hctx) {
      const c = HAZE_TEX / 2;
      const g = hctx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, 'rgba(226,238,208,1)');
      g.addColorStop(1, 'rgba(226,238,208,0)');
      hctx.fillStyle = g;
      hctx.fillRect(0, 0, HAZE_TEX, HAZE_TEX);
    }

    const start = performance.now();
    let raf = 0;
    let lastDraw = 0;
    // Capped at ~30fps — soft, blurred, fast-moving particles don't read as
    // choppier at half the frame rate, and it halves the canvas's own draw
    // cost for free.
    const FRAME_MS = 1000 / 30;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (now - lastDraw < FRAME_MS) {
        if (elapsed < GUST_MS) raf = requestAnimationFrame(tick);
        return;
      }
      lastDraw = now;
      ctx.clearRect(0, 0, w, h);

      // Air haze: a broad soft glow riding across with the gust, so the wind
      // has body between the particles instead of just scattered debris.
      const hazeT = elapsed / GUST_MS;
      if (hazeT < 1) {
        const hx = -0.35 * w + hazeT * 1.75 * w;
        ctx.globalAlpha = Math.sin(Math.PI * hazeT) * 0.075;
        ctx.drawImage(haze, hx - hazeR, h * 0.45 - hazeR, hazeR * 2, hazeR * 2);
        ctx.globalAlpha = 1;
      }

      // Wind dashes, drawn under the leaves.
      ctx.lineCap = 'round';
      for (const d of dashes) {
        const t = (elapsed - d.delay) / 1000;
        if (t < 0) continue;
        const lifeT = t / d.life;
        if (lifeT > 1) continue;

        let a = 1;
        if (lifeT < 0.2) a = lifeT / 0.2;
        else if (lifeT > 0.6) a = 1 - (lifeT - 0.6) / 0.4;
        a *= d.alpha;
        if (a <= 0.01) continue;

        const x = d.x0 + d.vx * t;
        if (x - d.len > w + 60) continue;
        const y = d.y0 + d.vy * t;

        ctx.strokeStyle = `rgba(232,241,220,${a})`;
        ctx.lineWidth = d.width;
        ctx.beginPath();
        ctx.moveTo(x - d.len, y - d.len * 0.06);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      for (const leaf of leaves) {
        const t = (elapsed - leaf.delay) / 1000;
        if (t < 0) continue;
        const lifeT = t / leaf.life;
        if (lifeT > 1) continue;

        // Ease in, hold, ease out — keeps leaves from popping at the edges.
        let a = 1;
        if (lifeT < 0.16) a = lifeT / 0.16;
        else if (lifeT > 0.68) a = 1 - (lifeT - 0.68) / 0.32;
        a *= leaf.alpha;
        if (a <= 0.01) continue;

        const x = leaf.x0 + leaf.vx * t;
        if (x > w + 120) continue;
        const y =
          leaf.y0 +
          leaf.vy * t +
          Math.sin(t * leaf.swaySpeed + leaf.swayPhase) * leaf.swayAmp;
        const rot = leaf.rot0 + leaf.vrot * t;

        // Leaves flutter, so squash the width on a second, faster cycle to
        // fake them turning edge-on to the viewer.
        const flutter = Math.abs(Math.cos(t * leaf.swaySpeed * 1.7 + leaf.swayPhase));
        const sx = 0.25 + flutter * 0.75;

        const sprite = sprites[leaf.sprite];
        // Scale the sprite so its drawn width matches this leaf's size.
        const k = leaf.size / SPRITE_LEAF;
        const off = -SPRITE_BOX / 2;

        // Fast, close leaves get a smeared ghost behind them so the speed
        // reads as motion rather than a shape teleporting across the frame.
        if (leaf.vx > 720) {
          ctx.save();
          ctx.translate(x - leaf.vx * 0.022, y);
          ctx.rotate(rot);
          ctx.scale(sx * k * 2.4, k * 0.55);
          ctx.globalAlpha = a * 0.3;
          ctx.drawImage(sprite, off, off);
          ctx.restore();
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(sx * k, k);
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, off, off);
        ctx.restore();
      }

      if (elapsed < GUST_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    };
  }, [gust, enabled]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};

/* ------------------------------------------------------------------ *
 * Wind streaks — light sweeping through the canopy
 * ------------------------------------------------------------------ */

const STREAKS = [
  { top: '13%', width: '58%', blur: 16, delay: 0.0, dur: 1.35, peak: 0.8 },
  { top: '34%', width: '76%', blur: 22, delay: 0.1, dur: 1.7, peak: 0.55 },
  { top: '58%', width: '54%', blur: 16, delay: 0.05, dur: 1.4, peak: 0.85 },
  { top: '79%', width: '70%', blur: 20, delay: 0.17, dur: 1.6, peak: 0.6 },
];

/**
 * Fixed, full-viewport forest backdrop shared across every route. Lives once
 * in the root layout so it never remounts or reloads on client navigation —
 * only page content scrolls over it.
 *
 * All three scene photos stay mounted permanently (so nothing has to load
 * mid-transition). A scene change plays a gust rather than a plain fade:
 * the outgoing photo fades out while the incoming one fades in (see the
 * comment on the opacity animation below for why it's opacity-only), light
 * streaks sweep across the canopy, and a canvas layer blows leaves over the
 * whole frame. The grade and scrim layers sit above the photos and never
 * change, so text contrast stays constant; the gust layers sit above the
 * scrim so they aren't dimmed into invisibility, but the whole stack is
 * still behind page content.
 */
export const ForestBackdrop = () => {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  // Increments on every scene change. Used as the animation key so each gust
  // replays cleanly, and so returning to scene 0 still triggers one.
  const [gust, setGust] = useState(0);
  // True only while a transition is in flight, so `will-change` can be scoped
  // to that window instead of being left on permanently.
  const [busy, setBusy] = useState(false);

  // useReducedMotion() reads matchMedia, which doesn't exist during SSR — it
  // returns null on the server and the real value on the client, so branching
  // on it directly would render different DOM server vs. client and trigger a
  // hydration mismatch. Render as if motion is allowed until mounted, then
  // correct after hydration has already finished.
  const [mounted, setMounted] = useState(false);
  const systemReduceMotion = useReducedMotion();
  const reduceMotion = mounted ? !!systemReduceMotion : false;
  const animate = mounted && !reduceMotion;

  useEffect(() => setMounted(true), []);

  // Section tracking via IntersectionObserver rather than a scroll listener.
  // The old version called getBoundingClientRect() on every section on every
  // scroll frame, which forces a synchronous layout each time and is a classic
  // source of scroll jank. Collapsing the root to a 1px line at the viewport
  // midpoint (via the -50%/-50% rootMargin) reproduces the same "which section
  // is under the middle of the screen" rule with zero layout reads.
  useEffect(() => {
    const sceneOf = new Map<Element, number>();
    for (const [id, index] of SECTION_SCENE) {
      const el = document.getElementById(id);
      if (el) sceneOf.set(el, index);
    }
    if (sceneOf.size === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const next = sceneOf.get(entry.target);
          // Compared against a ref rather than inside a setState updater —
          // those can run twice under StrictMode, double-counting the gust.
          if (next === undefined || next === activeRef.current) continue;
          activeRef.current = next;
          setActive(next);
          setGust((g) => g + 1);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sceneOf.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // `will-change` is only worth setting while a transition is actually
  // running. Leaving it on permanently keeps three full-viewport composited
  // layers resident the whole time, which is a real cost on integrated GPUs.
  useEffect(() => {
    if (gust === 0) return;
    setBusy(true);
    const t = window.setTimeout(() => setBusy(false), 2200);
    return () => window.clearTimeout(t);
  }, [gust]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f08]">
      {SCENES.map((scene, index) => {
        const isActive = index === active;
        return (
          <motion.div
            key={scene.src}
            className="absolute inset-0"
            // Opacity only. This used to also animate `scale` (1 -> 1.08) —
            // an animated `transform: scale()` on a large raster image forces
            // the GPU to resample/re-mipmap that texture on every frame of
            // the transition. A CDP trace isolating this exact property (all
            // else identical) showed it was 59% of the transition's entire
            // raster cost (461ms -> 188ms with it removed) — opacity-only
            // blending doesn't touch the texture's pixels at all, so it's
            // close to free regardless of image size. An animated
            // `filter: blur()` was cut earlier for the same class of reason.
            style={{ willChange: busy ? 'opacity' : undefined }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={
              animate
                ? { duration: 1.9, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.3 }
            }
          >
            <Image
              src={scene.src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={scene.boost ? { filter: 'contrast(1.4) saturate(1.5) brightness(1.25)' } : undefined}
              priority={index === 0}
            />
          </motion.div>
        );
      })}

      {/* Color grade: pulls the bright, warm-lit photos toward the site's
          dark green palette instead of just dimming them to grey. This is
          tinting, not the text-safety layer — that's the scrim below, which
          this doesn't touch. Was 80%, which combined with the scrim to crush
          the two lower-contrast scenes into near-invisibility; text legibility
          comes entirely from the scrim, so this can drop without any risk. */}
      <div className="absolute inset-0 bg-[#0d1508] mix-blend-multiply opacity-45" />
      {/* Canopy tint + directional scrim, stacked as two backgrounds on a
          single element rather than two: the backdrop is position:fixed, so
          every full-viewport layer here is re-composited on each scroll frame.
          Top layer in the list paints on top. The scrim is darkest at the top
          (nav/hero copy) and bottom (footer), lighter through the middle so
          the canopy still reads. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            // First entry paints on top — the scrim sat above the tint when
            // these were two separate elements, so it must lead here.
            'linear-gradient(180deg, rgba(6,10,5,0.82) 0%, rgba(6,10,5,0.5) 16%, rgba(6,10,5,0.55) 50%, rgba(6,10,5,0.65) 78%, rgba(6,10,5,0.92) 100%)',
            'radial-gradient(ellipse 120% 90% at 50% 15%, rgba(58,74,40,0.25) 0%, transparent 55%)',
          ].join(','),
        }}
      />

      {/* Gust layers sit ABOVE the scrim so they don't get dimmed out, but
          still inside the -z-10 container so they stay behind page content. */}
      {animate && (
        <>
          <div
            key={`streaks-${gust}`}
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {STREAKS.map((s, i) => (
              <motion.div
                key={i}
                className="absolute h-px"
                style={{
                  top: s.top,
                  left: 0,
                  width: s.width,
                  background:
                    'linear-gradient(90deg, transparent, rgba(232,241,220,0.7), transparent)',
                  filter: `blur(${s.blur}px)`,
                  // Promote so the blur is rasterised once into the layer and
                  // the sweep is a pure transform, instead of the blurred
                  // result potentially being recomputed as it moves.
                  willChange: 'transform, opacity',
                }}
                initial={{ x: '-60%', opacity: 0, rotate: -4 }}
                animate={{ x: '150%', opacity: [0, s.peak, 0], rotate: -4 }}
                transition={{ duration: s.dur, delay: s.delay, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <GustCanvas gust={gust} enabled={animate} />
        </>
      )}
    </div>
  );
};
