import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// One connected palace, built in local coordinates shared with the camera tour.
// Static architecture is merged by material; detail never adds per-window draws.
export function createHeavenPalace(group: THREE.Group, detail: THREE.Group, distant: THREE.Group, lightweight: boolean) {
  const resources = new Set<THREE.BufferGeometry | THREE.Material>();
  const own = <T extends THREE.BufferGeometry | THREE.Material>(value: T): T => { resources.add(value); return value; };
  const stone = own(new THREE.MeshStandardMaterial({ color: '#f3edda', roughness: 0.82 }));
  const limestone = own(new THREE.MeshStandardMaterial({ color: '#d1bea0', roughness: 0.9 }));
  const gold = own(new THREE.MeshStandardMaterial({ color: '#edc354', metalness: 0.38, roughness: 0.28, emissive: '#9b671e', emissiveIntensity: 0.16 }));
  const shadow = own(new THREE.MeshBasicMaterial({ color: '#35454c' }));
  const water = own(new THREE.MeshStandardMaterial({ color: '#68b8bc', roughness: 0.22, metalness: 0.18 }));
  const leaves = own(new THREE.MeshStandardMaterial({ color: '#527a52', roughness: 0.95 }));
  const flowers = own(new THREE.MeshStandardMaterial({ color: '#e5ad94', roughness: 0.8 }));
  const cloudMaterials = ['#f4f2e9', '#dde5e6'].map(color => own(new THREE.MeshLambertMaterial({ color })));
  const sides = lightweight ? 16 : 24;
  const box = own(new THREE.BoxGeometry(1, 1, 1));
  const cylinder = own(new THREE.CylinderGeometry(1, 1, 1, sides));
  const cone = own(new THREE.ConeGeometry(1, 1, sides));
  const ball = own(new THREE.SphereGeometry(1, lightweight ? 10 : 14, 8));
  const dome = own(new THREE.LatheGeometry([
    [0, 0], [0.78, 0], [0.91, 0.07], [1, 0.24], [0.98, 0.43],
    [0.86, 0.65], [0.65, 0.83], [0.38, 0.99], [0.13, 1.15], [0, 1.3],
  ].map(([x, y]) => new THREE.Vector2(x, y)), sides));

  function archShape(width: number, shoulder: number, peak: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0); shape.lineTo(width / 2, 0); shape.lineTo(width / 2, shoulder);
    shape.quadraticCurveTo(width / 2, peak, 0, peak);
    shape.quadraticCurveTo(-width / 2, peak, -width / 2, shoulder);
    shape.closePath(); return shape;
  }
  const opening = own(new THREE.ShapeGeometry(archShape(1, 1.04, 1.6), 6).translate(0, -0.8, 0));
  const arch = archShape(1.32, 1.12, 1.85);
  arch.holes.push(new THREE.Path(archShape(1, 1.04, 1.6).getPoints(6)));
  const extrudedArch = new THREE.ExtrudeGeometry(arch, { depth: 0.18, bevelEnabled: false, curveSegments: 6 }).translate(0, -0.8, -0.09);
  const archFrame = own(mergeVertices(extrudedArch)); extrudedArch.dispose();
  const nearParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const farParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const clouds = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const transform = new THREE.Object3D();

  function stamp(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number,
    sx: number, sy: number, sz: number, rotation = 0, bucket = nearParts) {
    transform.position.set(x, y, z); transform.rotation.set(0, rotation, 0); transform.scale.set(sx, sy, sz); transform.updateMatrix();
    const parts = bucket.get(material) ?? [];
    parts.push(geometry.clone().applyMatrix4(transform.matrix)); bucket.set(material, parts);
  }
  function structure(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number,
    sx: number, sy: number, sz: number, rotation = 0) {
    stamp(geometry, material, x, y, z, sx, sy, sz, rotation);
    stamp(geometry, material, x, y, z, sx, sy, sz, rotation, farParts);
  }
  function window(x: number, base: number, z: number, width: number, height: number, rotation = 0) {
    stamp(opening, shadow, x, base + height / 2, z, width, height / 1.6, 1, rotation);
    stamp(archFrame, stone, x + Math.sin(rotation) * 0.07, base + height / 2, z + Math.cos(rotation) * 0.07,
      width, height / 1.6, 1, rotation);
  }
  function finial(x: number, base: number, z: number, scale: number) {
    structure(cylinder, gold, x, base + scale * 0.8, z, scale * 0.13, scale * 1.6, scale * 0.13);
    structure(dome, gold, x, base + scale * 1.1, z, scale * 0.47, scale * 0.66, scale * 0.47);
    structure(cone, gold, x, base + scale * 2.4, z, scale * 0.2, scale * 1.8, scale * 0.2);
    stamp(ball, gold, x, base + scale * 3.35, z, scale * 0.12, scale * 0.12, scale * 0.12);
  }
  function cupola(x: number, base: number, z: number, radius: number) {
    structure(cylinder, gold, x, base + 0.25, z, radius * 0.94, 0.5, radius * 0.94);
    structure(dome, gold, x, base + 0.35, z, radius, radius, radius);
    finial(x, base + radius * 1.3 + 0.35, z, Math.max(0.7, radius * 0.2));
  }
  function tower(x: number, z: number, radius: number, height: number) {
    structure(cylinder, limestone, x, 1.5, z, radius * 1.13, 3, radius * 1.13);
    structure(cylinder, stone, x, height / 2 + 3, z, radius, height, radius);
    structure(cylinder, stone, x, height + 2.8, z, radius * 1.14, 1, radius * 1.14);
    structure(cylinder, gold, x, height + 3.6, z, radius * 1.1, 0.5, radius * 1.1);
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * Math.PI * 2;
      window(x + Math.sin(a) * (radius + 0.06), height - 4.5, z + Math.cos(a) * (radius + 0.06), radius * 0.35, 4.1, a);
      if (i % 2 === 0) window(x + Math.sin(a) * (radius + 0.06), 7, z + Math.cos(a) * (radius + 0.06), radius * 0.22, 3.2, a);
    }
    cupola(x, height + 4, z, radius * 1.12);
  }
  function minaret(x: number, z: number, height: number) {
    structure(cylinder, limestone, x, 2, z, 2.2, 4, 2.2);
    structure(cylinder, stone, x, height / 2, z, 1.25, height, 1.25);
    for (const y of [height * 0.57, height * 0.8]) {
      structure(cylinder, stone, x, y, z, 2.2, 0.6, 2.2);
      stamp(cylinder, gold, x, y + 0.55, z, 1.9, 0.22, 1.9);
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2;
        stamp(cylinder, gold, x + Math.sin(a) * 1.8, y + 0.3, z + Math.cos(a) * 1.8, 0.045, 0.7, 0.045);
      }
    }
    cupola(x, height, z, 1.65);
  }
  function balustrade(x: number, y: number, z: number, length: number, rotation = 0) {
    stamp(box, gold, x, y + 1, z, length, 0.28, 0.34, rotation);
    stamp(box, limestone, x, y, z, length, 0.2, 0.6, rotation);
    const count = Math.max(3, Math.round(length / 1.4));
    for (let i = 0; i <= count; i++) {
      const offset = -length / 2 + i / count * length;
      stamp(cylinder, gold, x + Math.cos(rotation) * offset, y + 0.5, z - Math.sin(rotation) * offset, 0.075, 1, 0.075);
    }
  }

  // Cloud-covered foundation, a broad front terrace, and an ascending bridge.
  structure(cylinder, limestone, 0, -2.5, -1, 53, 5, 41);
  structure(cylinder, stone, 0, 0.25, -1, 52.7, 0.6, 40.7);
  structure(box, stone, 0, 3.5, 18, 72, 7, 27);
  structure(box, limestone, 0, 7.1, 18, 74, 0.5, 29);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) window(side * (10 + i * 3.2), 0.3, 31.56, 2.1, 5.6);
    balustrade(side * 24, 7.6, 32.6, 23);
    balustrade(side * 36.8, 7.6, 18, 27, Math.PI / 2);
  }
  structure(box, limestone, 0, 1, 53, 13, 2, 44);
  for (let i = 0; i < 22; i++) stamp(box, stone, 0, 1.1 + i * 0.29, 73 - i * 1.85, 12.6, 0.35 + i * 0.58, 1.9);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 11; i++) balustrade(side * 6.4, 1.5 + i * 0.58, 72 - i * 3.7, 3.9, Math.PI / 2);
    tower(side * 26, 23, 7.8, 27);
  }

  // Main sanctuary: round arcaded halls, a monumental gold dome and finial.
  structure(cylinder, limestone, 0, 4.5, -4, 20, 9, 20);
  structure(cylinder, stone, 0, 20, -4, 18, 31, 18);
  structure(cylinder, limestone, 0, 23.5, -4, 19.5, 1.2, 19.5);
  structure(cylinder, stone, 0, 35.8, -4, 19.3, 1.2, 19.3);
  structure(cylinder, gold, 0, 36.6, -4, 18.5, 0.55, 18.5);
  for (let i = 0; i < 20; i++) {
    const a = i / 20 * Math.PI * 2;
    const x = Math.sin(a) * 18.08, z = -4 + Math.cos(a) * 18.08;
    window(x, 9, z, 2.1, 8, a); window(x, 25, z, 1.9, 7.5, a);
    stamp(cylinder, limestone, Math.sin(a) * 18.5, 26, -4 + Math.cos(a) * 18.5, 0.2, 18, 0.2);
  }
  cupola(0, 37, -4, 18.3);
  // Raised, domed gatehouse at the top of the approach.
  structure(box, stone, 0, 12.4, 26, 17, 10.5, 12);
  structure(cylinder, stone, 0, 20, 26, 6.3, 5, 6.3);
  cupola(0, 22.6, 26, 7.1);
  window(0, 7.1, 32.1, 6.7, 8.7);
  for (const x of [-6.8, 6.8]) stamp(cylinder, gold, x, 12.8, 32.4, 0.28, 11, 0.28);
  for (const x of [-8.7, 8.7]) minaret(x, 27, 25);

  // East archive: a long three-domed library with two tiers of open arcades.
  structure(box, stone, 32, 9.5, -2, 22, 18, 38);
  structure(box, limestone, 32, 18.9, -2, 24, 1, 40);
  for (const z of [-13, -2, 9]) {
    structure(cylinder, stone, 32, 21, z, 5.3, 4.5, 5.3); cupola(32, 23.5, z, 6);
  }
  for (let i = 0; i < 9; i++) {
    const z = -18 + i * 4;
    window(43.05, 3, z, 2.3, 5.8, Math.PI / 2);
    window(43.05, 11.2, z, 2.1, 5.4, Math.PI / 2);
    stamp(cylinder, limestone, 43.7, 9.5, z + 1.7, 0.2, 18.5, 0.2);
  }
  for (const x of [26, 32, 38]) window(x, 4, 17.05, 2.6, 6.8);
  balustrade(44, 19.5, -2, 39, Math.PI / 2);

  // Rear observatory: a raised celestial pavilion, satellite domes and minarets.
  structure(box, limestone, 23, 5, -28, 24, 10, 21);
  tower(24, -28, 8.2, 31);
  for (const x of [14, 34]) {
    structure(cylinder, stone, x, 16, -26, 3.5, 12, 3.5); cupola(x, 22, -26, 4.2);
  }
  for (const [x, z, h] of [[-22, -28, 49], [43, -25, 46], [-43, -21, 41], [13, -37, 51]]) minaret(x, z, h);
  for (let i = 0; i < 6; i++) stamp(box, stone, 24, 0.4 + i * 0.7, -13 - i * 1.4, 10, 0.8 + i * 1.4, 1.5);

  // West garden: an open colonnaded court, greenery, reflecting pool and gazebo.
  structure(box, limestone, -31, 0.8, -4, 29, 1.6, 34);
  stamp(box, water, -30, 1.68, -5, 10, 0.15, 19);
  for (const x of [-44, -18]) {
    structure(box, stone, x, 12, -4, 2, 1.3, 35);
    for (let i = 0; i < 8; i++) {
      const z = -18 + i * 4;
      stamp(cylinder, stone, x, 6.5, z, 0.42, 10, 0.42);
      stamp(archFrame, stone, x, 7, z + 2, 2.7, 3.2, 1, Math.PI / 2);
    }
    balustrade(x, 13, -4, 34, Math.PI / 2);
  }
  for (const z of [-20, 13]) structure(box, stone, -31, 12, z, 28, 1.3, 2);
  tower(-32, -23, 6.2, 21);
  for (let i = 0; i < 10; i++) {
    const z = -17 + (i % 5) * 6.5, x = i < 5 ? -39 : -21;
    stamp(box, limestone, x, 2.1, z, 3.5, 1, 2.8);
    stamp(ball, leaves, x, 3.4, z, 1.6, 1.2, 1.3);
    stamp(ball, flowers, x + 0.6, 4.2, z + 0.4, 0.65, 0.4, 0.65);
  }
  stamp(cylinder, stone, -30, 2.4, -5, 2.8, 1.2, 2.8);
  stamp(cylinder, gold, -30, 4.3, -5, 0.4, 3, 0.4);
  stamp(ball, water, -30, 5.8, -5, 1.7, 0.3, 1.7);
  // Connecting rear galleries and slimmer skyline turrets unify the compound.
  structure(box, stone, -2, 8, -29, 47, 12, 11);
  for (const x of [-18, -7, 4]) { structure(cylinder, stone, x, 16, -29, 3.9, 4, 3.9); cupola(x, 18, -29, 4.7); }
  for (let i = 0; i < 14; i++) window(-23 + i * 3.4, 3.5, -34.56, 1.6, 6, Math.PI);

  // Solid billowing cloud banks hide the foundation without transparent overdraw.
  for (let i = 0; i < (lightweight ? 34 : 48); i++) {
    const a = i * 2.39996, radius = 47 + (i % 4) * 3.7;
    const x = Math.sin(a) * radius, z = Math.cos(a) * radius * 0.8;
    const size = 5.5 + (i % 5) * 1.1;
    stamp(ball, cloudMaterials[i % 2], x, -4.4 + Math.sin(i * 1.7) * 2.2, z, size * 1.7, size, size * 1.3, 0, clouds);
  }
  for (const [bucket, parent] of [[nearParts, detail], [farParts, distant], [clouds, group]] as const) {
    for (const [material, parts] of bucket) {
      const merged = mergeGeometries(parts); parts.forEach(part => part.dispose());
      if (!merged) throw new Error('Unable to merge palace architecture');
      const mesh = new THREE.Mesh(own(merged), material); mesh.name = parent === group ? 'palace-cloud-bank' : 'palace-architecture';
      parent.add(mesh);
    }
  }
  return { dispose() { resources.forEach(resource => resource.dispose()); } };
}
