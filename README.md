# Rabin Pant's portfolio

Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Three.js.

The background is a procedural Yggdrasil-inspired world tree. Scrolling climbs
from braided roots around a woven trunk and into a broad, layered crown.
Wide views show a colossal tree rooted in a sunlit meadow, surrounded by much
smaller trees, swaying grass, and wildflowers. Portfolio sections are ordinary
HTML and work independently of the scene.

UI typography uses soft ivory, silver-gray supporting text, and muted champagne
accents across all realms. Shared text and surface colors live in `app/globals.css`.
Grass and foliage use natural greens, with warmer cedar bark and stronger leaf
and bark texture contrast. These colors retain sRGB output and the existing tone
mapping; texture dimensions and geometry counts are unchanged.

## Tree journey

- `components/ui/TreeJourney.tsx` lazy-loads the renderer and measures section
  positions when layout changes.
- `lib/tree-journey.ts` contains section anchors and individual project waypoints.
  Five virtual palace anchors use the final project's existing scroll distance:
  the approach and entry happen as its content leaves, with Contact immediately next.
  There is no interstitial prompt, spacer section, or extra Contact padding.
- `lib/tree-realms.ts` defines five lower realms and the shared Heaven Citadel.
  `lib/branch-realms.ts` builds their architecture, moving residents, ground-floor
  snowfall, windmill, and celestial landmarks. Distant architecture uses simplified
  silhouettes; nearby realms show full detail.
- `lib/tree-camera.ts` defines the roots-to-crown camera stops.
- `lib/heaven-palace.ts` builds a connected ivory palace inspired by golden-domed
  cloud architecture. Projects introduces the skyline; MediaTranscribe visits the
  entrance bridge, TalentBridge the east archive, CineBook the observatory, Chat App
  the west garden. The final passage aligns with the bridge, crosses the open main
  entrance, and follows a vaulted gallery into the throne room. Contact stays inside,
  facing a raised golden throne, crimson carpet, columns, banners, and chandelier.
  Static architecture and cloud banks are merged by material.
- `lib/palace-layout.ts` shares floor, doorway, and throne dimensions between the
  architecture and camera. The sanctuary is hollow and its main entrance is open.
- `lib/royal-court.ts` fills the throne room with a crowned, seated king, paired
  guards, advisors with scrolls, and attendants. Characters are merged by material;
  their head turns, breathing, and robe movement use individual GPU animation phases.
  Gilded candelabra, softly flickering flames, sparse drifting dust, and one local
  warm light bring the room to life without additional shadow passes. Mobile retains
  the king and six court members; desktop adds two outer guards. The final camera
  framing shows the king and inner guards behind the Contact section.
- `lib/underworld-fortress.ts` builds the dark basalt fortress, pointed spires,
  fiery windows, and glowing fissures beneath the roots. `lib/underworld-landscape.ts`
  surrounds it with lava channels, jagged crags, red haze, and rising orange embers.
  These details are merged or instanced, appear only underground, and use no
  additional lights or shadow passes.
- `lib/tree-scene.ts` controls the continuous spiral camera route, daylight sky,
  realm-specific sky colors, lighting, frame cadence, adaptive resolution, and
  renderer lifecycle. The sky renders after opaque scenery at the far plane, so
  covered pixels skip its cloud shader. Lower daylight fog keeps nearby scenery
  clearer while preserving distance atmosphere.
- `lib/tree-render-quality.ts` protects resolution during startup, lowers it
  under sustained rendering pressure, and restores it when headroom returns.
  Optional asynchronous GPU timing separates rendering work from browser scheduling
  delays. Pixel density remains capped and rendering retains its 60 fps target.
- `lib/tree-world.ts` builds the woven trunk, spreading roots, branching canopy,
  supporting boughs, clouds, and glowing motes. `lib/tree-meadow.ts` adds
  instanced meadow vegetation and gradually reveals the underground roots during
  descent. Branch geometry is merged and foliage is instanced to reduce draw calls.
- `lib/tree-surfaces.ts` generates small reusable surface textures, organic
  rock shapes, ferns, fine leaf cutouts, and soft contact shading. Canopy
  clusters use instanced, separately culled tiers with alpha testing and gentle wind.
  `lib/tree-geometry.ts` shares tapered branch geometry between the world tree and
  smaller meadow trees. Desktop sunlight uses a cached 2048px shadow map;
  lighter devices use contact shading. No reflection passes, models, or downloaded
  textures are required. Grass has varied blade shapes and shaded roots and tips.
- `public/scene/tree-fallback.svg` provides a matching static world tree before
  WebGL loads, with reduced motion, or if WebGL is unavailable or loses context.

The route descends into the volcanic Rootbound Underworld (About), where the tree's
exposed roots hang over molten rivers and a basalt fortress beneath a crimson sky.
The underground view hides the ground island and its surface decorations to open
the volcanic panorama, while the tree and its roots remain connected above it.
The existing scene lights blend into warm lava illumination during the descent,
then return to daylight as the route climbs through Frosthaven (Experience),
Bloomgrove (Interests), Copperleaf (Skills), Skyward Academy (Certifications),
and the Heaven Citadel (Projects through Contact). Snow appears only in Frosthaven.
The camera holds inside the throne room through Contact and the footer. Scrolling
back reverses the palace tour. Camera pullback, pointer movement, and desktop framing
ease away before the doorway to keep the route within the gallery on phones and
desktops. The field of view and existing lights blend into a wider, warm interior.

The renderer loads separately from the portfolio content. Foliage and ground
details use instancing. Rendering targets 60 fps in both development and
production, including small screens. Small screens and devices reporting at
most four CPU threads use lighter settings. Resolution is capped and reduced
further when frame delivery or render submission stays slow. Frame deadlines
maintain the same cadence on higher-refresh displays; actual frame rates depend
on the device. Grass is split into spatial batches and thinned with distance;
redundant foliage and subpixel decorations are omitted. A small tolerance
accommodates animation timestamp jitter. Quality changes ignore startup work and
use sustained CPU/GPU measurements when available; resolution recovers gradually
within the original device cap. No extra rendering passes or larger textures are
needed for the clearer nature palette.
Rendering runs automatically while the tab is visible. Reduced-motion visitors
get the static illustration without loading Three.js. GPU resources and event
listeners are disposed when the renderer unmounts.

The project listing and detail routes use the crown camera position.

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

Run `npm run test:journey` to check both palace detail levels against the actual
camera spline. It samples the entrance-to-Contact route for architectural clearance,
an unobstructed view, and an endpoint inside the throne room.
