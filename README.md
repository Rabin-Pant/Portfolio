# Rabin Pant's portfolio

Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Three.js.

The background is a procedural Yggdrasil-inspired world tree. Scrolling climbs
from braided roots around a woven trunk and into a broad, layered crown.
Wide views show a colossal tree rooted in a sunlit meadow, surrounded by much
smaller trees, swaying grass, and wildflowers. Portfolio sections are ordinary
HTML and work independently of the scene.

## Tree journey

- `components/ui/TreeJourney.tsx` lazy-loads the renderer and measures section
  positions when layout changes.
- `lib/tree-journey.ts` contains eight section anchors and individual project
  waypoints. Each project visits a distinct inhabited branch realm.
- `lib/tree-realms.ts` defines ten original realms, their visual lore, positions,
  architecture, and color palettes. `lib/branch-realms.ts` builds their settlements,
  moving residents, local snowfall, boats, windmill, and celestial landmarks.
  Distant settlements use simplified silhouettes; nearby realms show full detail.
- `lib/tree-camera.ts` defines the roots-to-crown camera stops.
- `lib/tree-scene.ts` controls the continuous spiral camera route, daylight sky,
  realm-specific sky colors, lighting, frame cadence, adaptive resolution, and
  renderer lifecycle. Antialiasing, anisotropic textures, and higher initial pixel
  density improve clarity; resolution scales down to native density when needed.
- `lib/tree-world.ts` builds the woven trunk, spreading roots, branching canopy,
  supporting boughs, clouds, and glowing motes. `lib/tree-meadow.ts` adds
  instanced meadow vegetation and gradually reveals the underground roots during
  descent. Branch geometry is merged and foliage is instanced to reduce draw calls.
- `lib/tree-surfaces.ts` generates small reusable surface textures, organic
  rock shapes, ferns, fine leaf cutouts, and soft contact shading. Canopy
  clusters use intersecting leaf cards with alpha testing and gentle wind.
  `lib/tree-geometry.ts` shares tapered branch geometry between the world tree and
  smaller meadow trees. Desktop sunlight uses a cached 2048px shadow map;
  lighter devices use contact shading. No reflection passes, models, or downloaded
  textures are required. Grass has varied blade shapes and shaded roots and tips.
- `public/scene/tree-fallback.svg` provides a matching static world tree before
  WebGL loads, with reduced motion, or if WebGL is unavailable or loses context.

The route descends into the snowy Rootbound Underworld (About), where the tree's
exposed roots hang below the island, then climbs through Frosthaven (Experience),
Bloomgrove (Interests), Copperleaf (Skills), Skyward Academy (Certifications),
Tideglass (MediaTranscribe), Bridgeward (TalentBridge), Starfall (CineBook),
Emberlight (Chat App), and the crown sanctuary Solarium (Contact). Lore guides
visuals only; no extra story labels or guide text are added to the portfolio.

The renderer loads separately from the portfolio content. Foliage and ground
details use instancing. Rendering targets 60 fps in both development and
production, including small screens. Small screens and devices reporting at
most four CPU threads use lighter settings. Resolution is capped and reduced
further when frame delivery or render submission stays slow. Frame deadlines
maintain the same cadence on higher-refresh displays; actual frame rates depend
on the device. A small tolerance accommodates animation timestamp jitter.
Rendering runs automatically while the tab is visible. Reduced-motion visitors
get the static illustration without loading Three.js. GPU resources and event
listeners are disposed when the renderer unmounts.

The project listing and detail routes use the crown camera position. No old
photo background or transition particle system is retained.

All four projects are shown in full on the homepage by
`components/home/ProjectsSection.tsx`: descriptions, problems, approaches,
results, technology stacks, screenshots, and source/demo links. The hero link
goes directly to these stories. Existing project URLs remain available.
`components/home/CertificationsSection.tsx` holds the separate certifications
chapter, with AWS and Programming & Design groups. Skills contains only skills
and programming languages.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The homepage is
`app/(home)/page.tsx`. Fonts are Fraunces, Inter, and JetBrains Mono via
`next/font`.

Before deployment, run `npm run lint` and `npm run build`. The contact form
requires `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the Vercel environment.
