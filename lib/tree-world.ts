import * as THREE from 'three';
import { createLimb as limb } from './tree-geometry';
import { TREE_REALMS } from './tree-realms';
import { createTreeMeadow } from './tree-meadow';
import { createUnderworldLandscape } from './underworld-landscape';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createContactTexture, createFoliageTexture, createFernGeometry, createOrganicGeometry, createSurfaceTexture } from './tree-surfaces';

export function createTreeWorld(scene: THREE.Scene, lightweight: boolean, anisotropy = 1) {
  const tree = new THREE.Group();
  tree.name = "yggdrasil"; tree.scale.y = 0.62; scene.add(tree);
  const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  const own = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(value: T): T => { resources.add(value); if (value instanceof THREE.Texture) value.anisotropy = anisotropy; return value; };
  let seed = 2717;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const standard = (color: string) => own(new THREE.MeshStandardMaterial({ color, roughness: 0.95 }));
  const bark = standard('#956b43'), moss = standard('#3f8344');
  const stone = standard('#53736c');
  const stoneMap = own(createSurfaceTexture('stone')); stoneMap.repeat.set(3, 3); stone.map = stoneMap;
  const barkMap = own(createSurfaceTexture('bark'));
  bark.map = barkMap;
  if (!lightweight) { bark.bumpMap = barkMap; bark.bumpScale = 0.48; }
  const leafColors = ['#285f32', '#40803c', '#709b47', '#a0b957'].map(color => new THREE.Color(color));
  const canopyMaterial = standard('#ffffff');
  const leafTexture = own(createFoliageTexture());
  const wind = { value: 0 };
  canopyMaterial.map = leafTexture; canopyMaterial.alphaTest = 0.45; canopyMaterial.side = THREE.DoubleSide;
  canopyMaterial.emissive.set('#3d6536'); canopyMaterial.emissiveMap = leafTexture; canopyMaterial.emissiveIntensity = 0.07;
  canopyMaterial.onBeforeCompile = shader => {
    shader.uniforms.wind = wind;
    shader.vertexShader = 'uniform float wind;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      #ifdef USE_INSTANCING
        transformed.x += sin(wind * 0.65 + instanceMatrix[3].x * 0.13 + instanceMatrix[3].z * 0.2) * 0.035 * (position.y + 1.0);
      #endif
    `);
  };
  const rockShape = own(createOrganicGeometry(1));
  function mesh(g: THREE.BufferGeometry, m: THREE.Material, p: THREE.Vector3, parent: THREE.Object3D = tree) {
    const object = new THREE.Mesh(g, m); object.position.copy(p);
    object.castShadow = !lightweight && (m === bark || m === stone);
    object.receiveShadow = !lightweight;
    parent.add(object); return object;
  }
  function radial(angle: number, radius: number, y: number) { return new THREE.Vector3(Math.sin(angle) * radius, y, Math.cos(angle) * radius); }
  function merged(parts: THREE.BufferGeometry[], m: THREE.Material) {
    const combined = mergeGeometries(parts); parts.forEach(p => p.dispose());
    if (combined) mesh(own(combined), m, new THREE.Vector3());
  }

  const trunkPoints = [new THREE.Vector3(0, -2, 0), new THREE.Vector3(-2, 18, 1), new THREE.Vector3(2, 45, -2), new THREE.Vector3(-3, 72, 2), new THREE.Vector3(1, 102, -1), new THREE.Vector3(0, 128, 0)];
  mesh(own(limb(trunkPoints, 11, 0.4, lightweight ? 64 : 96, lightweight ? 16 : 24)), bark, new THREE.Vector3()).name = 'world-tree-trunk';
  const trunkCurve = new THREE.CatmullRomCurve3(trunkPoints);
  const trunkFrames = trunkCurve.computeFrenetFrames(48, false);
  const livingMoss = standard('#4f853b');
  livingMoss.emissive.set('#264522'); livingMoss.emissiveIntensity = 0.12;
  const mossTrails: THREE.BufferGeometry[] = [];
  for (let strand = 0; strand < 9; strand++) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48, a = strand / 9 * Math.PI * 2 + t * 7;
      const radius = THREE.MathUtils.lerp(11, 0.4, Math.pow(t, 0.7)) * 1.07;
      points.push(trunkCurve.getPoint(t)
        .addScaledVector(trunkFrames.normals[i], Math.cos(a) * radius)
        .addScaledVector(trunkFrames.binormals[i], Math.sin(a) * radius));
    }
    mossTrails.push(limb(points, 0.35, 0.05, 48, 6));
  }
  merged(mossTrails, livingMoss);
  // Braided buttresses rise out of the roots and wrap the main trunk.
  const rootParts: THREE.BufferGeometry[] = [];
  // A buried neck joins the hanging root crown to the trunk when the island
  // is cut away. It shares the root mesh and remains below the ground floor.
  rootParts.push(limb([
    new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, -9, 0),
    new THREE.Vector3(0, -18, 0), new THREE.Vector3(0, -25, 0),
  ], 10, 4.5, 20, 10));
  for (let i = 0; i < 16; i++) {
    const angle = i / 16 * Math.PI * 2;
    rootParts.push(limb([radial(angle + 0.7, 6, 34), radial(angle + 0.3, 10, 11), radial(angle, 21, 2), radial(angle - 0.2, 43, -1)], 2.5, 0.25, 28, 10));
    for (const side of [-1, 1]) {
      rootParts.push(limb([radial(angle, 20, 2), radial(angle + side * 0.12, 34, 0.7), radial(angle + side * 0.22, 51, -2), radial(angle + side * 0.27, 54, -17)], 0.8, 0.06, 20, 7));
    }
  }
  for (let i = 0; i < 18; i++) {
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 18; j++) {
      const t = j / 18, a = i / 18 * Math.PI * 2 + t * 2.8;
      const r = 9.5 - t * 5.9 + Math.sin(t * 10 + i) * 0.45;
      points.push(radial(a, r, 2 + t * 96));
    }
    rootParts.push(limb(points, 0.95, 0.18, 30, 7));
  }
  // Below the island, the root crown hangs in the open underworld instead of
  // disappearing into the rock. Broad roots fork into finer interwoven strands.
  const rootVeins: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 18; i++) {
    const angle = i / 18 * Math.PI * 2 + 0.1;
    const facingTown = Math.cos(angle - TREE_REALMS[0].angle) > 0.8;
    const rootReach = facingTown ? 32 : 48;
    const forkReach = facingTown ? 39 : 58;
    rootParts.push(limb([
      radial(angle, 8, -15), radial(angle + 0.13, 18, -30),
      radial(angle - 0.08, 28, -47), radial(angle + 0.12, rootReach, -72),
    ], 1.5, 0.22, 28, 9));
    for (const side of [-1, 1]) rootParts.push(limb([
      radial(angle + 0.13, 18, -30), radial(angle + side * 0.17, 29, -42),
      radial(angle + side * 0.28, forkReach, -69),
    ], 0.55, 0.05, 21, 7));
    if (i % 2 === 0) rootVeins.push(limb([
      radial(angle + 0.08, 10, -17), radial(angle + 0.16, 19, -31),
      radial(angle - 0.03, 29, -48), radial(angle + 0.16, rootReach - 1, -68),
    ], 0.16, 0.025, 24, 5));
  }
  merged(rootParts, bark);
  const veinMaterial = own(new THREE.MeshStandardMaterial({ color: '#a2491d', emissive: '#ff6b20', emissiveIntensity: 0.7, roughness: 0.8 }));
  merged(rootVeins, veinMaterial);
  const island = mesh(rockShape, stone, new THREE.Vector3(0, -19, 0)); island.scale.set(57, 20, 54);
  const cliff = new THREE.InstancedMesh(rockShape, stone, 36);
  const cliffTransform = new THREE.Object3D(); tree.add(cliff);
  for (let i = 0; i < cliff.count; i++) {
    const a = i / cliff.count * Math.PI * 2;
    cliffTransform.position.copy(radial(a, 47 + random() * 4, -11 - random() * 3));
    cliffTransform.scale.set(4 + random() * 3, 11 + random() * 6, 4 + random() * 3);
    cliffTransform.rotation.set(0, a, 0); cliffTransform.updateMatrix(); cliff.setMatrixAt(i, cliffTransform.matrix);
  }
  cliff.computeBoundingSphere();
  const earth = own(createSurfaceTexture('earth')); earth.repeat.set(12, 12); moss.map = earth;
  mesh(own(new THREE.CircleGeometry(54, 48).rotateX(-Math.PI / 2)), moss, new THREE.Vector3(0, -0.1, 0));
  const underworld = createUnderworldLandscape(tree, lightweight, TREE_REALMS[0].angle, anisotropy);
  const contact = own(createContactTexture());
  const haloMaterial = own(new THREE.SpriteMaterial({ map: contact, color: '#ffe3a0', transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false }));
  const halo = new THREE.Sprite(haloMaterial); halo.position.set(-7, 94, -65); halo.scale.set(115, 100, 1); tree.add(halo);
  const shade = own(new THREE.MeshBasicMaterial({ color: '#102515', map: contact, transparent: true, opacity: 0.6, depthWrite: false }));
  mesh(own(new THREE.PlaneGeometry(75, 75).rotateX(-Math.PI / 2)), shade, new THREE.Vector3(0, 0.02, 0));

  // Each realm is carried by its own large bough. World-space heights are
  // converted to this tree group's compressed proportions.
  const destinations = TREE_REALMS.map(realm => ({ angle: realm.angle, y: realm.y / 0.62 - 3, radius: realm.radius }));
  const branchParts: THREE.BufferGeometry[] = [];
  const leafSites: { position: THREE.Vector3; size: number }[] = [];
  function foliageSite(position: THREE.Vector3, size: number) {
    leafSites.push({ position, size });
  }
  function branch(angle: number, y: number, reach: number, radius: number) {
    const start = radial(angle, 2, y - 8), bend = radial(angle + 0.08, reach * 0.5, y - 2);
    const end = radial(angle, reach, y + 3);
    branchParts.push(limb([start, bend, end, radial(angle - 0.1, reach + 7, y + 10)], radius, 0.18, 20, 9));
    for (const side of [-1, 1]) {
      const tip = radial(angle + side * 0.25, reach + 10, y + 15);
      branchParts.push(limb([bend, end.clone().add(new THREE.Vector3(side * 3, 5, 0)), tip], radius * 0.45, 0.08, 12, 7));
      for (let fork = 0; fork < 3; fork++) {
        const a = angle + side * (0.14 + fork * 0.16);
        const twig = radial(a, reach + 7 + random() * 7, y + 15 + fork * 2);
        branchParts.push(limb([end, tip, twig], radius * 0.22, 0.025, 9, 5));
      }
      foliageSite(tip, 4 + random() * 2);
      foliageSite(tip.clone().add(new THREE.Vector3(side * 3, 4, 2)), 3.5 + random() * 2);
    }
    foliageSite(radial(angle, reach + 6, y + 12), 4 + random() * 2);
    foliageSite(radial(angle + 0.08, reach * 0.68, y + 9), 4 + random() * 2);
  }
  destinations.slice(1).forEach(d => {
    branchParts.push(limb([
      radial(d.angle, 2, d.y - 12), radial(d.angle + 0.05, d.radius * 0.55, d.y - 6),
      radial(d.angle, d.radius, d.y),
    ], d.y < 90 ? 4.2 : 3.5, 2.2, 24, 10));
  });
  // Broad ascending tiers form a rounded umbrella rather than a tall pole.
  for (let level = 0; level < 5; level++) for (let i = 0; i < 10; i++) {
    const y = 61 + level * 18;
    const angle = i / 10 * Math.PI * 2 + level * 0.39;
    const reach = [43, 49, 45, 34, 20][level] + random() * 4;
    branch(angle, y, reach, 3.2 - level * 0.45);
  }
  // Supporting forks connect the top canopy to the central woven trunk.
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    branchParts.push(limb([radial(a, 2, 67), radial(a + 0.2, 8, 112), radial(a + 0.4, 15, 149), radial(a + 0.5, 12, 165)], 3.4, 0.15, 28, 10));
  }
  // Fill the canopy with small overlapping clumps, keeping gaps between tiers
  // for the silhouette of the fine branches and the warm light behind them.
  const canopyLevels = [
    { y: 81, radius: 50 }, { y: 103, radius: 53 },
    { y: 124, radius: 46 }, { y: 144, radius: 34 }, { y: 161, radius: 19 },
  ];
  canopyLevels.forEach((level, index) => {
    for (let ring = 0; ring < 3; ring++) {
      const r = level.radius * (0.25 + ring * 0.33);
      const count = Math.max(10, Math.round(r * (lightweight ? 0.6 : 0.85)));
      for (let i = 0; i < count; i++) {
        const a = i / count * Math.PI * 2 + index * 0.4;
        foliageSite(radial(a, r, level.y + Math.sin(a * 3) * 3 + random() * 3), 4.2 + random() * 2);
      }
    }
  });
  merged(branchParts, bark);

  // Dense volumes plus individual leaf silhouettes; both are instanced.
  const leafPlanes = [
    new THREE.PlaneGeometry(2, 2),
    new THREE.PlaneGeometry(2, 2).rotateY(Math.PI / 3),
    new THREE.PlaneGeometry(2, 2).rotateY(-Math.PI / 3),
  ];
  const crownGeometry = own(mergeGeometries(leafPlanes));
  leafPlanes.forEach(plane => plane.dispose());
  // Canopy tiers can be culled independently during close views of a realm.
  // Instance colors reuse one material instead of allocating four full buffers.
  const canopyTiers = new Map<number, typeof leafSites>();
  leafSites.forEach(site => {
    const tier = Math.floor(site.position.y / 28);
    const sites = canopyTiers.get(tier) ?? []; sites.push(site); canopyTiers.set(tier, sites);
  });
  const transform = new THREE.Object3D();
  canopyTiers.forEach((sites, tier) => {
    const crowns = new THREE.InstancedMesh(crownGeometry, canopyMaterial, sites.length * 3);
    crowns.name = `world-tree-canopy-${tier}`;
    let index = 0;
    sites.forEach(site => {
      const color = leafColors[Math.floor(random() * leafColors.length)];
      for (let j = 0; j < 3; j++) {
        transform.position.copy(site.position).add(new THREE.Vector3((random() - 0.5) * site.size, (random() - 0.5) * 6, (random() - 0.5) * site.size));
        transform.scale.set(site.size * (0.6 + random() * 0.25), site.size * (0.9 + random() * 0.4), site.size * 0.7);
        transform.rotation.set((random() - 0.5) * 0.8, random() * Math.PI, (random() - 0.5) * 0.6); transform.updateMatrix();
        crowns.setMatrixAt(index, transform.matrix); crowns.setColorAt(index++, color);
      }
    });
    crowns.computeBoundingSphere(); crowns.receiveShadow = !lightweight; tree.add(crowns);
  });
  const leafGeometry = own(new THREE.BufferGeometry());
  leafGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, -0.5, 0.25, 0, 0, 1.4, 0.12, 0, 0, 0, 0, 1.4, 0.12, 0.5, 0.25, 0], 3));
  leafGeometry.computeVertexNormals();
  const leafMaterial = own(canopyMaterial.clone()); leafMaterial.color.copy(leafColors[2]); leafMaterial.map = null; leafMaterial.emissiveMap = null; leafMaterial.alphaTest = 0; leafMaterial.side = THREE.DoubleSide; leafMaterial.onBeforeCompile = canopyMaterial.onBeforeCompile;
  const leaves = new THREE.InstancedMesh(leafGeometry, leafMaterial, lightweight ? 1000 : 2500); tree.add(leaves);
  for (let i = 0; i < leaves.count; i++) {
    const site = leafSites[i % leafSites.length];
    transform.position.copy(site.position).add(new THREE.Vector3((random() - 0.5) * site.size * 2, (random() - 0.5) * site.size, (random() - 0.5) * site.size * 2));
    transform.rotation.set(random() * 3, random() * 6, random() * 3); transform.scale.setScalar(0.25 + random() * 0.5); transform.updateMatrix(); leaves.setMatrixAt(i, transform.matrix);
  }
  leaves.computeBoundingSphere();

  // Moss, ferns, and boulders anchor the opening view at the roots.
  const fernMaterial = own(canopyMaterial.clone()); fernMaterial.color.copy(leafColors[1]); fernMaterial.map = null; fernMaterial.emissiveMap = null; fernMaterial.alphaTest = 0; fernMaterial.side = THREE.DoubleSide;
  const fernCount = lightweight ? 70 : 100;
  const ferns = new THREE.InstancedMesh(own(createFernGeometry(lightweight)), fernMaterial, fernCount);
  const rocks = new THREE.InstancedMesh(rockShape, stone, 60); tree.add(ferns, rocks);
  for (let i = 0; i < fernCount; i++) {
    const a = random() * Math.PI * 2, r = 15 + random() * 35;
    transform.position.copy(radial(a, r, 0.1)); transform.rotation.set(0, a, 0); transform.scale.setScalar(1 + random() * 2); transform.updateMatrix(); ferns.setMatrixAt(i, transform.matrix);
    if (i < 60) { transform.scale.set(1 + random() * 2, 0.6 + random(), 1 + random() * 2); transform.updateMatrix(); rocks.setMatrixAt(i, transform.matrix); }
  }
  ferns.computeBoundingSphere(); rocks.computeBoundingSphere();

  const meadow = createTreeMeadow(tree, lightweight, anisotropy);

  // Soft cloud banks beneath the branches, drawn with a small reusable texture.
  const cloudMaterial = own(new THREE.SpriteMaterial({ map: contact, color: '#edf4eb', transparent: true, opacity: 0.15, depthWrite: false }));
  const clouds: { sprite: THREE.Sprite; x: number }[] = [];
  for (let i = 0; i < (lightweight ? 8 : 14); i++) {
    const cloud = new THREE.Sprite(cloudMaterial); cloud.position.copy(radial(i * 2.4, 55 + random() * 55, 105 + (i % 4) * 15)); cloud.scale.set(55 + random() * 30, 10 + random() * 9, 1); tree.add(cloud); clouds.push({ sprite: cloud, x: cloud.position.x });
  }
  const moteGeometry = own(new THREE.BufferGeometry());
  const positions = new Float32Array((lightweight ? 170 : 330) * 3);
  for (let i = 0; i < positions.length / 3; i++) {
    const p = radial(random() * Math.PI * 2, 10 + random() * 45, 3 + random() * 170); positions.set([p.x, p.y, p.z], i * 3);
  }
  moteGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const motes = own(new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { time: { value: 0 } },
    vertexShader: `uniform float time; varying float glow; void main() { vec3 p = position; p.x += sin(time * 0.3 + p.y) * 0.6; p.y += sin(time * 0.4 + p.x) * 0.4; vec4 v = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * v; gl_PointSize = clamp(80.0 / -v.z, 1.0, 5.0); glow = 0.45 + 0.2 * sin(time + p.y); }`,
    fragmentShader: `varying float glow;
      void main() {
        float alpha = smoothstep(0.5, 0.1, distance(gl_PointCoord, vec2(0.5)));
        gl_FragColor = vec4(0.75, 0.95, 0.55, alpha * glow);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  }));
  tree.add(new THREE.Points(moteGeometry, motes));

  const localCamera = new THREE.Vector3();
  return {
    update(time: number, cameraHeight: number, camera?: THREE.Camera) {
      meadow.update(time, cameraHeight, camera); wind.value = time; motes.uniforms.time.value = time;
      underworld.update(time, cameraHeight);
      // Open the underground panorama while retaining the hanging roots.
      // The island and its rim return unchanged for every aboveground view.
      const aboveGround = cameraHeight >= -5;
      island.visible = cliff.visible = rocks.visible = ferns.visible = halo.visible = aboveGround;
      if (camera) {
        camera.getWorldPosition(localCamera); tree.worldToLocal(localCamera);
        // Fine leaves and ferns are too small to contribute to the final view;
        // the tiered crown geometry preserves the complete tree silhouette.
        leaves.visible = Math.hypot(localCamera.x, localCamera.z) < 170;
        ferns.visible = aboveGround && Math.hypot(localCamera.x, localCamera.y * tree.scale.y, localCamera.z) < 170;
      }
      clouds.forEach((c, i) => { c.sprite.visible = aboveGround; if (c.sprite.visible) c.sprite.position.x = c.x + Math.sin(time * 0.1 + i) * 2; });
    },
    dispose() { meadow.dispose(); underworld.dispose(); tree.removeFromParent(); tree.traverse(object => { if (object instanceof THREE.InstancedMesh) object.dispose(); }); resources.forEach(resource => resource.dispose()); },
  };
}
