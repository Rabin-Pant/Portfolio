# Rabin Pant's portfolio

Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Three.js.

The background is a procedural 3D forest journey. Scrolling follows a trail
from dawn at the forest entrance, across a stream and wooden bridge, through
a clearing, workshop, mountain overlook, lake, waterfall, windmill meadow,
stone amphitheatre, and firefly camp, to a woodland studio at dusk. Existing portfolio
sections remain ordinary HTML and work independently of the scene.

## Forest journey

- `components/ui/ForestJourney.tsx` loads the renderer, measures section
  positions when layout changes, and provides the animation pause button.
- `lib/forest-journey.ts` contains eight section anchors and individual project
  waypoints. Each full-length project story explores a different location:
  MediaTranscribe at the waterfall, TalentBridge in the windmill meadow,
  CineBook at the amphitheatre, and Chat App at the firefly camp.
- `lib/forest-scene.ts` creates the environment, camera stops, lighting, water,
  foliage movement, and floating particles. The windmill turns, water falls,
  flags flutter, and the campfire flickers. All models are generated in code.
- `lib/forest-surfaces.ts` generates small reusable surface textures, irregular
  pine boughs, broadleaf canopies, rock shapes, ferns, and soft contact shading.
  Water uses wave normals and a sky tint; the sky uses a horizon gradient.
  These effects need no reflection passes, shadow maps, or downloaded textures.
- `public/scene/forest-fallback.svg` is the static background used before the
  renderer loads, with reduced motion, or if WebGL is unavailable or loses its context.

The renderer loads separately from the portfolio content. Trees and ground
details use instancing. Rendering targets 60 fps in both development and
production, including small screens. Small screens and devices reporting at
most four CPU threads use lighter settings. Resolution is capped and reduced
further when frame delivery or render submission stays slow. Frame deadlines
maintain the same cadence on higher-refresh displays; actual frame rates depend
on the device. A small tolerance accommodates animation timestamp jitter.
Rendering stops while the tab is hidden or the visitor
pauses it. Reduced-motion visitors get the static illustration without loading
Three.js. GPU resources and event listeners are disposed when the renderer unmounts.

The project listing and detail routes use the studio camera position. No old
photo background or transition particle system is retained.

All four projects are shown in full on the homepage by
`components/home/ProjectsSection.tsx`: descriptions, problems, approaches,
results, technology stacks, screenshots, and source/demo links. The hero link
goes directly to these stories. Existing project URLs remain available.
`components/home/CertificationsSection.tsx` holds the separate certifications
chapter, with AWS and Programming & Design groups. Skills contains only skills
and programming languages.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The homepage is `app/(home)/page.tsx`. The page auto-updates as you edit files.
Fonts are Fraunces, Inter, and JetBrains Mono, loaded with `next/font`.

Run `npm run lint` and `npm run build` to validate changes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
