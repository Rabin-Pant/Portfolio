import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createLimb } from './tree-geometry';
import { createContactTexture, createFoliageTexture, createOrganicGeometry, createSurfaceTexture } from './tree-surfaces';

// A low, continuous landscape supplies familiar scale cues around the world tree.
export function createTreeMeadow(parent: THREE.Group, lightweight: boolean, anisotropy: number) {
  const group = new THREE.Group(); group.name = 'sunlit-meadow'; parent.add(group);
  const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  const own = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(v: T): T => { resources.add(v); return v; };
  let seed = 4819;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const time = { value: 0 }, reveal = { value: 1 };
  const material = (color: string, sway = false) => {
    const m = own(new THREE.MeshStandardMaterial({ color, roughness: 0.95 }));
    m.onBeforeCompile = shader => {
      shader.uniforms.meadowTime = time; shader.uniforms.meadowReveal = reveal;
      shader.vertexShader = 'uniform float meadowTime;\n' + shader.vertexShader;
      if (sway) shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        #ifdef USE_INSTANCING
          transformed.x += sin(meadowTime * 1.2 + instanceMatrix[3].x * 0.4 + instanceMatrix[3].z * 0.25) * max(position.y, 0.0) * 0.12;
        #endif
      `);
      shader.fragmentShader = 'uniform float meadowReveal;\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <alphatest_fragment>', `
        #include <alphatest_fragment>
        float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
        if (grain > meadowReveal) discard;
      `);
    };
    m.customProgramCacheKey = () => `meadow-${sway}`;
    return m;
  };
  const height = (x: number, z: number) => {
    const edge = THREE.MathUtils.smoothstep(Math.hypot(x, z), 48, 95);
    return -0.35 + edge * (Math.sin(x * 0.025) * Math.cos(z * 0.022) * 2.3 + Math.sin(z * 0.047 + x * 0.015) * 0.7);
  };
  const grassMap = own(createSurfaceTexture('earth')); grassMap.repeat.set(145, 145); grassMap.anisotropy = anisotropy;
  const groundMaterial = material('#6b9636'); groundMaterial.map = grassMap;
  const compileGround = groundMaterial.onBeforeCompile;
  groundMaterial.onBeforeCompile = (shader, renderer) => {
    compileGround(shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace('#include <fog_fragment>', `
      #include <fog_fragment>
      #ifdef USE_FOG
        gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, smoothstep(180.0, 420.0, length(vViewPosition)));
      #endif
    `);
  };
  groundMaterial.customProgramCacheKey = () => 'meadow-ground-haze';
  const groundGeometry = own(new THREE.PlaneGeometry(1600, 1600, 160, 160).rotateX(-Math.PI / 2));
  const vertices = groundGeometry.getAttribute('position');
  const colors: number[] = [], tint = new THREE.Color();
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), z = vertices.getZ(i);
    vertices.setY(i, height(x, z));
    const shade = 0.86 + Math.sin(x * 0.065 + Math.cos(z * 0.04)) * 0.09 + Math.cos(z * 0.08) * 0.05;
    tint.setRGB(shade, shade, shade * 0.9); colors.push(tint.r, tint.g, tint.b);
  }
  groundGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); groundGeometry.computeVertexNormals();
  groundMaterial.vertexColors = true;
  const ground = new THREE.Mesh(groundGeometry, groundMaterial); ground.receiveShadow = !lightweight; group.add(ground);

  const transform = new THREE.Object3D();
  const place = (mesh: THREE.InstancedMesh, i: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, angle = 0) => {
    transform.position.set(x, y, z); transform.rotation.set(0, angle, 0); transform.scale.set(sx, sy, sz); transform.updateMatrix(); mesh.setMatrixAt(i, transform.matrix);
  };
  const foliage = own(createFoliageTexture()); foliage.anisotropy = anisotropy;
  const foliageMaterial = material('#79a847', true); foliageMaterial.map = foliage;
  foliageMaterial.emissive.set('#597623'); foliageMaterial.emissiveMap = foliage; foliageMaterial.emissiveIntensity = 0.12;
  foliageMaterial.alphaTest = 0.45; foliageMaterial.side = THREE.DoubleSide;
  const planes = [new THREE.PlaneGeometry(2, 2), new THREE.PlaneGeometry(2, 2).rotateY(Math.PI / 3), new THREE.PlaneGeometry(2, 2).rotateY(-Math.PI / 3), new THREE.PlaneGeometry(2, 2).rotateX(-Math.PI / 3)];
  const crownGeometry = own(mergeGeometries(planes)); planes.forEach(p => p.dispose());
  const treeCount = lightweight ? 110 : 185;
  const bark = material('#8e7857'); bark.map = own(createSurfaceTexture('bark'));
  if (!lightweight) { bark.bumpMap = bark.map; bark.bumpScale = 0.09; }
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const branches = [createLimb([v(0, 0, 0), v(-0.2, 3, 0.1), v(0.3, 6, -0.1), v(0, 10, 0)], 0.48, 0.05, 12, 7)];
  for (let j = 0; j < 8; j++) {
    const a = j * 2.4, reach = 2.2 + (j % 3) * 0.45, y = 4.5 + j * 0.45;
    const tip = v(Math.sin(a) * reach, y + 2, Math.cos(a) * reach);
    branches.push(createLimb([v(0, y - 2, 0), v(Math.sin(a) * reach * 0.5, y, Math.cos(a) * reach * 0.5), tip], 0.22, 0.025, 7, 5));
    for (const side of [-1, 1]) branches.push(createLimb([tip.clone().multiplyScalar(0.75), tip, tip.clone().add(v(Math.sin(a + side * 0.6), 1, Math.cos(a + side * 0.6)))], 0.07, 0.008, 5, 4));
  }
  const branchingTrunk = own(mergeGeometries(branches)); branches.forEach(b => b.dispose());
  const trunks = new THREE.InstancedMesh(branchingTrunk, bark, treeCount);
  const crowns = new THREE.InstancedMesh(crownGeometry, foliageMaterial, treeCount * 15);
  trunks.castShadow = crowns.castShadow = !lightweight;
  trunks.receiveShadow = crowns.receiveShadow = !lightweight;
  group.add(trunks, crowns);
  const shadowMaterial = material('#253c1b'); shadowMaterial.map = own(createContactTexture()); shadowMaterial.transparent = true; shadowMaterial.opacity = 0.33; shadowMaterial.depthWrite = false;
  const shadows = new THREE.InstancedMesh(own(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), shadowMaterial, treeCount); group.add(shadows);
  for (let i = 0; i < treeCount; i++) {
    const angle = random() * Math.PI * 2, radius = i < 20 ? 68 + random() * 55 : 90 + Math.sqrt(random()) * 220;
    let x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    // Keep the foreground sightline to the giant trunk open.
    if (z > 30 && Math.abs(x) < 42) x += x < 0 ? -55 : 55;
    const y = height(x, z), h = 8 + random() * 9, width = h * (0.2 + random() * 0.06);
    place(trunks, i, x, y, z, h / 10, h / 10, h / 10, angle);
    for (let j = 0; j < 15; j++) {
      const a = j * 2.4, top = j < 4, spread = width * (top ? 0.4 : 0.9);
      const clump = width * (0.64 + random() * 0.26);
      place(crowns, i * 15 + j, x + Math.sin(a) * spread, y + h * (top ? 0.98 : 0.68 + random() * 0.2), z + Math.cos(a) * spread, clump, clump * (0.85 + random() * 0.35), clump, random() * 6);
      crowns.setColorAt(i * 15 + j, tint.setHSL(0.23 + random() * 0.06, 0.16, 0.72 + random() * 0.25));
    }
    place(shadows, i, x + 1, y + 0.07, z + 1, width * 5, 1, width * 4);
  }

  // Several curved blades per instance keep the meadow full at a low draw cost.
  const blades: number[] = [], bladeColors: number[] = [];
  for (let i = 0; i < (lightweight ? 5 : 8); i++) {
    const a = i * 2.4, x = Math.sin(a) * 0.48, z = Math.cos(a) * 0.48, h = 0.5 + random() * 1.1;
    const dx = Math.cos(a), dz = Math.sin(a), bend = 0.2 + random() * 0.3;
    blades.push(x - dx * 0.055, 0, z - dz * 0.055, x + dx * 0.055, 0, z + dz * 0.055, x + dx * bend * 0.5, h * 0.65, z + dz * bend * 0.5,
      x - dx * 0.055, 0, z - dz * 0.055, x + dx * bend * 0.5, h * 0.65, z + dz * bend * 0.5, x + dx * bend, h, z + dz * bend);
    for (const value of [0.32, 0.32, 0.8, 0.32, 0.8, 1]) bladeColors.push(value * 0.92, value, value * 0.7);
  }
  const bladeGeometry = own(new THREE.BufferGeometry()); bladeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(blades, 3)); bladeGeometry.computeVertexNormals();
  bladeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(bladeColors, 3));
  const bladeMaterial = material('#b0c957', true); bladeMaterial.side = THREE.DoubleSide; bladeMaterial.vertexColors = true;
  const grass = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, lightweight ? 13000 : 30000); group.add(grass);
  grass.receiveShadow = !lightweight;
  for (let i = 0; i < grass.count; i++) {
    const foreground = i % 2 === 0;
    const x = (random() - 0.5) * (foreground ? 170 : 360), z = foreground ? 60 + random() * 105 : (random() - 0.5) * 360;
    const size = 0.9 + random() * 1.5;
    place(grass, i, x, height(x, z) + 0.04, z, size, size, size, random() * 6);
    const shade = THREE.MathUtils.smoothstep(Math.hypot(x, z), 18, 60);
    grass.setColorAt(i, tint.setHSL(0.2 + random() * 0.07, 0.25, 0.5 + shade * 0.25 + random() * 0.2));
  }
  const flowerMaterial = material('#fff1bf', true); flowerMaterial.side = THREE.DoubleSide;
  const flowerGeometry = own(new THREE.CircleGeometry(0.14, 5).rotateX(-Math.PI / 2));
  const flowers = new THREE.InstancedMesh(flowerGeometry, flowerMaterial, lightweight ? 800 : 1800); group.add(flowers);
  for (let i = 0; i < flowers.count; i++) {
    const x = (random() - 0.5) * 240, z = (random() - 0.5) * 240;
    place(flowers, i, x, height(x, z) + 0.4 + random() * 0.4, z, 1, 1, 1, random() * 6);
  }
  const rockMaterial = material('#7b8262'); rockMaterial.map = own(createSurfaceTexture('stone'));
  const rocks = new THREE.InstancedMesh(own(createOrganicGeometry(1)), rockMaterial, lightweight ? 65 : 120); group.add(rocks);
  for (let i = 0; i < rocks.count; i++) {
    const a = random() * Math.PI * 2, r = 58 + random() * 180, x = Math.sin(a) * r, z = Math.cos(a) * r;
    const size = 0.4 + random() * 1.3;
    place(rocks, i, x, height(x, z), z, size * 1.3, size * 0.6, size, a);
  }
  group.traverse(o => { if (o instanceof THREE.InstancedMesh) o.computeBoundingSphere(); });
  return {
    update(elapsed: number, cameraHeight: number) {
      time.value = elapsed;
      // Open the ground gradually during the descent to the exposed root realm.
      reveal.value = THREE.MathUtils.smoothstep(cameraHeight, -10, 10);
      group.visible = reveal.value > 0;
    },
    dispose() { group.removeFromParent(); group.traverse(o => { if (o instanceof THREE.InstancedMesh) o.dispose(); }); resources.forEach(r => r.dispose()); },
  };
}
