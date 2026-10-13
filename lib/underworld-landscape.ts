import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createContactTexture, createSurfaceTexture } from './tree-surfaces';

// All heights use the tree's local coordinates (its parent compresses y to
// 0.62). The basin sits at world y=-47.74 below the exposed root crown.
export function createUnderworldLandscape(parent: THREE.Group, lightweight: boolean, angle: number, anisotropy: number) {
  const group = new THREE.Group();
  group.name = 'underworld-volcanic-basin'; group.visible = false; parent.add(group);
  const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  const own = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(value: T): T => { resources.add(value); return value; };
  let seed = 73019;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const floorY = -77;
  const towardVisitor = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  const across = new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
  const basinPoint = (u: number, v: number, y: number) => across.clone().multiplyScalar(u).addScaledVector(towardVisitor, v).setY(y);
  const surface = own(createSurfaceTexture('stone')); surface.repeat.set(20, 20); surface.anisotropy = anisotropy;
  const basalt = own(new THREE.MeshStandardMaterial({ color: '#271b18', emissive: '#4d160a', emissiveIntensity: 0.24, roughness: 1, map: surface, flatShading: true }));
  const basin = new THREE.Mesh(own(new THREE.CircleGeometry(195, 80).rotateX(-Math.PI / 2)), basalt);
  basin.position.y = floorY; basin.name = 'underworld-basalt-floor'; group.add(basin);

  // A single instanced batch forms sharp basalt cliffs and broken columns.
  // Low foreground ridges leave the fortress and the hanging roots visible.
  const columnBase = new THREE.CylinderGeometry(0.3, 1, 2, 6, 3);
  const columnPositions = columnBase.getAttribute('position');
  for (let i = 0; i < columnPositions.count; i++) {
    const x = columnPositions.getX(i), y = columnPositions.getY(i), z = columnPositions.getZ(i);
    const fracture = 1 + Math.sin(y * 5 + x * 7 + z * 3) * 0.2;
    columnPositions.setXYZ(i, x * fracture + Math.sin(y * 3) * 0.12, y, z * fracture);
  }
  const columnsGeometry = own(columnBase.toNonIndexed()); columnBase.dispose(); columnsGeometry.computeVertexNormals();
  const count = lightweight ? 65 : 100;
  const cliffs = new THREE.InstancedMesh(columnsGeometry, basalt, count);
  cliffs.name = 'underworld-jagged-basalt-crags'; group.add(cliffs);
  const transform = new THREE.Object3D();
  const rockColors = ['#b3a19a', '#e0baaa', '#c5a08e', '#857b78'].map(value => new THREE.Color(value));
  for (let i = 0; i < count; i++) {
    const a = i / count * Math.PI * 2 + (random() - 0.5) * 0.14;
    const facingVisitor = Math.cos(a - angle) > 0.48;
    const radius = (facingVisitor ? 118 : 92) + random() * 65;
    const height = facingVisitor ? 7 + random() * 15 : 30 + random() * 59;
    transform.position.set(Math.sin(a) * radius, floorY + height * 0.5 - 1, Math.cos(a) * radius);
    transform.scale.set(6 + random() * 13, height * 0.5, 6 + random() * 13);
    transform.rotation.set((random() - 0.5) * 0.18, random() * Math.PI, (random() - 0.5) * 0.18);
    transform.updateMatrix(); cliffs.setMatrixAt(i, transform.matrix); cliffs.setColorAt(i, rockColors[i % rockColors.length]);
  }
  cliffs.computeBoundingSphere();

  // Meandering molten ribbons and their shared lake are merged into one mesh.
  // Their movement is entirely in the fragment shader; no lights or bloom pass.
  const lavaParts: THREE.BufferGeometry[] = [];
  function river(points: [number, number][], width: number) {
    const curve = new THREE.CatmullRomCurve3(points.map(([u, v]) => basinPoint(u, v, floorY + 0.18)));
    const vertices: number[] = [], uv: number[] = [], indices: number[] = [];
    const segments = lightweight ? 36 : 56;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments, p = curve.getPoint(t), tangent = curve.getTangent(t);
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const reach = width * (0.68 + Math.sin(t * Math.PI * 5) * 0.12 + Math.sin(t * Math.PI * 13) * 0.08);
      for (const edge of [-1, 1]) {
        const vertex = p.clone().addScaledVector(side, edge * reach * 0.5);
        vertices.push(vertex.x, vertex.y, vertex.z); uv.push(t, edge < 0 ? 0 : 1);
      }
      if (i < segments) { const k = i * 2; indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geometry.setIndex(indices);
    lavaParts.push(geometry);
  }
  river([[-79, -158], [-58, -100], [-20, -60], [39, -32], [48, 26], [35, 78], [61, 155]], 16);
  river([[-153, -79], [-93, -48], [-51, -15], [-46, 45], [-23, 105], [-32, 170]], 12);
  river([[-51, -15], [-14, -19], [18, -10], [48, 26]], 10);
  river([[46, -29], [102, -56], [164, -110]], 8);
  // This foreground tributary remains visible in the narrower mobile view,
  // crossing beneath the fortress's elevated entrance bridge.
  river([[-46, 45], [-20, 58], [4, 65], [2, 80], [-12, 104], [-32, 140]], 15);
  const lakeVertices: number[] = [], lakeUV: number[] = [], lakeIndices: number[] = [];
  const lakeCenter = basinPoint(-6, -15, floorY + 0.2); lakeVertices.push(lakeCenter.x, lakeCenter.y, lakeCenter.z); lakeUV.push(0.5, 0.5);
  for (let i = 0; i <= 44; i++) {
    const a = i / 44 * Math.PI * 2, r = 1 + Math.sin(a * 5) * 0.09 + Math.cos(a * 7) * 0.06;
    const p = basinPoint(-6 + Math.sin(a) * 31 * r, -15 + Math.cos(a) * 23 * r, floorY + 0.2);
    lakeVertices.push(p.x, p.y, p.z); lakeUV.push(0.5 + Math.sin(a) * 0.5, 0.5 + Math.cos(a) * 0.5);
    if (i < 44) lakeIndices.push(0, i + 1, i + 2);
  }
  const lake = new THREE.BufferGeometry(); lake.setAttribute('position', new THREE.Float32BufferAttribute(lakeVertices, 3));
  lake.setAttribute('uv', new THREE.Float32BufferAttribute(lakeUV, 2)); lake.setIndex(lakeIndices); lavaParts.push(lake);
  const lavaGeometry = mergeGeometries(lavaParts); lavaParts.forEach(part => part.dispose());
  if (!lavaGeometry) throw new Error('Unable to merge underworld lava surface');
  const lavaTime = { value: 0 };
  const lavaMaterial = own(new THREE.ShaderMaterial({
    side: THREE.DoubleSide, fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { time: lavaTime }]),
    vertexShader: `varying vec2 lavaUV; varying vec2 lavaPosition;
      #include <fog_pars_vertex>
      void main() { lavaUV = uv; lavaPosition = position.xz; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,
    fragmentShader: `uniform float time; varying vec2 lavaUV; varying vec2 lavaPosition;
      #include <fog_pars_fragment>
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+1.0),f.x),f.y); }
      void main() {
        vec2 flow = lavaPosition * 0.19 + vec2(time * 0.055, -time * 0.09);
        float crust = noise(flow) * 0.62 + noise(flow * 2.8) * 0.38;
        float heat = smoothstep(0.34, 0.74, crust);
        float bank = pow(abs(lavaUV.y - 0.5) * 2.0, 5.0);
        vec3 color = mix(vec3(0.24, 0.027, 0.006), vec3(1.35, 0.22, 0.006), heat);
        color += vec3(1.1, 0.55, 0.035) * smoothstep(0.70, 0.88, crust);
        color *= 1.0 - bank * 0.5;
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
  }));
  const lava = new THREE.Mesh(own(lavaGeometry), lavaMaterial); lava.name = 'underworld-molten-lava-channels'; group.add(lava);

  // Broken dark rocks interrupt the lake and riverbanks, avoiding a flat pool.
  const debris = new THREE.InstancedMesh(columnsGeometry, basalt, lightweight ? 34 : 52); group.add(debris);
  debris.name = 'underworld-lava-bank-rocks';
  for (let i = 0; i < debris.count; i++) {
    const a = random() * Math.PI * 2, r = 15 + random() * 76;
    transform.position.copy(basinPoint(Math.sin(a) * r, Math.cos(a) * r - 13, floorY + 0.45));
    transform.scale.set(1 + random() * 4, 0.5 + random() * 3, 1 + random() * 4);
    transform.rotation.set(0, random() * Math.PI, (random() - 0.5) * 0.35);
    transform.updateMatrix(); debris.setMatrixAt(i, transform.matrix); debris.setColorAt(i, rockColors[i % rockColors.length]);
  }
  debris.computeBoundingSphere();

  const hazeMap = own(createContactTexture());
  const hazeMaterial = own(new THREE.SpriteMaterial({ map: hazeMap, color: '#af2b09', opacity: 0.24, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  for (let i = 0; i < 3; i++) {
    const haze = new THREE.Sprite(hazeMaterial); haze.position.copy(basinPoint((i - 1) * 90, -108, -47 + i * 5));
    haze.scale.set(145, 66, 1); group.add(haze);
  }
  const emberCount = lightweight ? 95 : 165;
  const emberPositions = new Float32Array(emberCount * 3);
  for (let i = 0; i < emberCount; i++) {
    const p = basinPoint((random() - 0.5) * 185, (random() - 0.5) * 150, floorY + random() * 62);
    emberPositions.set([p.x, p.y, p.z], i * 3);
  }
  const emberGeometry = own(new THREE.BufferGeometry()); emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  const emberMaterial = own(new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { time: { value: 0 } },
    vertexShader: `uniform float time; varying float glow; void main() {
      vec3 p = position; p.y = -76.0 + mod(p.y + 76.0 + time * (0.75 + fract(p.x * 0.13)), 61.0);
      p.x += sin(time * 0.4 + p.z) * 0.85;
      vec4 v = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * v;
      gl_PointSize = clamp(150.0 / max(1.0, -v.z), 1.1, 4.5); glow = 0.35 + 0.25 * sin(time * 1.6 + position.z);
    }`,
    fragmentShader: `varying float glow; void main() {
      float alpha = smoothstep(0.5, 0.08, distance(gl_PointCoord, vec2(0.5)));
      gl_FragColor = vec4(1.0, 0.28, 0.025, alpha * glow);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
  }));
  const embers = new THREE.Points(emberGeometry, emberMaterial); embers.name = 'underworld-rising-embers'; group.add(embers);

  return {
    update(time: number, cameraHeight: number) {
      group.visible = cameraHeight < -5;
      if (group.visible) { lavaMaterial.uniforms.time.value = time; emberMaterial.uniforms.time.value = time; }
    },
    dispose() { group.removeFromParent(); cliffs.dispose(); debris.dispose(); resources.forEach(resource => resource.dispose()); },
  };
}
