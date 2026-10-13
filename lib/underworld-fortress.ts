import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// A single basalt stronghold, with the front gate facing the realm camera.
// The architecture uses a handful of static material batches at either distance.
export function createUnderworldFortress(group: THREE.Group, detail: THREE.Group, distant: THREE.Group, lightweight: boolean) {
  const resources = new Set<THREE.BufferGeometry | THREE.Material>();
  const own = <T extends THREE.BufferGeometry | THREE.Material>(value: T): T => { resources.add(value); return value; };
  const basalt = own(new THREE.MeshStandardMaterial({ color: '#322625', roughness: 0.96 }));
  const ledge = own(new THREE.MeshStandardMaterial({ color: '#634235', roughness: 0.92 }));
  const obsidian = own(new THREE.MeshStandardMaterial({ color: '#171519', roughness: 0.84 }));
  const rock = own(new THREE.MeshStandardMaterial({ color: '#32211e', roughness: 1 }));
  const opening = own(new THREE.MeshBasicMaterial({ color: '#0c0809' }));
  const ember = own(new THREE.MeshStandardMaterial({ color: '#ff792f', emissive: '#ff5a16', emissiveIntensity: 1.2, roughness: 0.75 }));
  const box = own(new THREE.BoxGeometry(1, 1, 1));
  const pillar = own(new THREE.CylinderGeometry(1, 1.07, 1, 6));
  const spire = own(new THREE.ConeGeometry(1, 1, 6));
  const cliff = own(new THREE.CylinderGeometry(1, 0.68, 1, 9));
  const shard = own(new THREE.ConeGeometry(1, 1, 5));

  function pointedArch(width: number, shoulder: number, peak: number) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0); shape.lineTo(width / 2, 0); shape.lineTo(width / 2, shoulder);
    shape.quadraticCurveTo(width * 0.39, shoulder + (peak - shoulder) * 0.72, 0, peak);
    shape.quadraticCurveTo(-width * 0.39, shoulder + (peak - shoulder) * 0.72, -width / 2, shoulder);
    shape.closePath(); return shape;
  }
  const archFace = own(new THREE.ShapeGeometry(pointedArch(1, 1, 1.7), 5));
  const frameShape = pointedArch(1.34, 1.15, 2);
  frameShape.holes.push(new THREE.Path(pointedArch(1, 1, 1.7).getPoints(5)));
  const frameSource = new THREE.ExtrudeGeometry(frameShape, { depth: 0.2, bevelEnabled: false, curveSegments: 5 });
  const archFrame = own(mergeVertices(frameSource)); frameSource.dispose();
  const nearParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const farParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const platformParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
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
  function window(x: number, y: number, z: number, width: number, height: number, rotation = 0) {
    stamp(archFace, opening, x, y, z, width * 1.5, height / 1.7, 1, rotation);
    stamp(archFace, ember, x + Math.sin(rotation) * 0.02, y + 0.17, z + Math.cos(rotation) * 0.02,
      width * 0.48, (height - 0.35) / 1.7, 1, rotation);
    stamp(archFrame, ledge, x + Math.sin(rotation) * 0.03, y, z + Math.cos(rotation) * 0.03,
      width * 1.5, height / 1.7, 0.35, rotation);
  }
  function battlement(x: number, y: number, z: number, length: number, rotation = 0) {
    structure(box, ledge, x, y, z, length, 0.5, 1.25, rotation);
    const count = Math.max(3, Math.round(length / 1.55));
    for (let i = 0; i <= count; i++) {
      const offset = -length / 2 + i / count * length;
      stamp(box, basalt, x + Math.cos(rotation) * offset, y + 0.65, z - Math.sin(rotation) * offset, 0.75, 1.05, 1.15, rotation);
    }
  }
  function tower(x: number, z: number, radius: number, height: number, cap: number) {
    structure(pillar, basalt, x, height / 2, z, radius, height, radius, Math.PI / 6);
    structure(pillar, ledge, x, height * 0.35, z, radius * 1.05, 0.4, radius * 1.05, Math.PI / 6);
    structure(pillar, ledge, x, height + 0.15, z, radius * 1.16, 0.6, radius * 1.16, Math.PI / 6);
    structure(spire, obsidian, x, height + 0.45 + cap / 2, z, radius * 1.23, cap, radius * 1.23, Math.PI / 6);
    structure(spire, basalt, x, height + cap + 0.7, z, 0.18, 0.9, 0.18);
    for (const a of [0, Math.PI / 3, -Math.PI / 3, Math.PI]) {
      const wx = x + Math.sin(a) * (radius * 0.87 + 0.035), wz = z + Math.cos(a) * (radius * 0.87 + 0.035);
      window(wx, height * 0.57, wz, radius * 0.29, Math.min(2.8, height * 0.24), a);
      if (!lightweight && height > 11) window(wx, 2.2, wz, radius * 0.23, 2.1, a);
    }
    for (const side of [-1, 1]) {
      stamp(box, ledge, x + side * radius * 0.76, height * 0.38, z + radius * 0.82,
        0.24, height * 0.73, 0.36, Math.PI / 6 * side);
    }
  }

  // Faceted bedrock rises from the lava; the front apron stays clear for residents.
  stamp(cliff, rock, 0, -6.65, -1, 19, 13, 15.7, 0.15, platformParts);
  stamp(cliff, basalt, 0, -0.25, -1, 18.75, 0.4, 15.5, 0.15, platformParts);
  stamp(box, rock, 0, -0.15, 11.4, 24, 0.6, 5.1, 0, platformParts);
  for (let i = 0; i < 11; i++) {
    const a = i * 2.39996, x = Math.sin(a) * 17.3, z = Math.cos(a) * 13.8 - 1;
    stamp(shard, obsidian, x, -1.8, z, 1.9 + i % 3 * 0.4, 6 + i % 4, 1.7, a, platformParts);
    if (i % 2 === 0) stamp(box, ember, x, -2.3, z + 0.13, 0.1, 3.6, 0.14, a, platformParts);
  }

  // A stepped central keep and uneven, needle-like towers form the skyline.
  structure(box, basalt, 0, 6.4, -3.6, 12.8, 12.8, 10.6);
  structure(box, ledge, 0, 12.8, -3.6, 13.8, 0.65, 11.4);
  structure(box, obsidian, 0, 13.5, -3.6, 11.8, 1.3, 9.8);
  tower(1.4, -4.2, 3.3, 17.2, 5.4);
  tower(-7.2, -7, 2.35, 14.5, 4.5);
  tower(8.5, -5.6, 2.75, 12.4, 5.1);
  tower(-13, -4.5, 1.8, 9.5, 4.1);
  tower(12.6, -9, 1.5, 12.7, 4.6);
  tower(-10.8, 7.2, 2.9, 9.3, 4.6);
  tower(10.8, 7.2, 2.9, 11.1, 5.4);
  for (const x of [-4.5, -2.2, 0, 2.2, 4.5]) {
    window(x, 3.5, 1.74, 0.58, 3.2);
    window(x, 8.5, 1.74, 0.48, 2.7);
    stamp(box, ledge, x + 0.8, 6.4, 1.82, 0.25, 12, 0.3);
  }
  for (const x of [-5.5, 5.5]) {
    structure(box, basalt, x, 3.5, 3.7, 3.1, 7, 5.5);
    structure(spire, obsidian, x, 8.4, 3.7, 2, 2.9, 2.7, Math.PI / 6);
  }

  // Thick ramparts, an arched gate, and a short stone causeway.
  for (const x of [-13.4, 13.4]) {
    structure(box, basalt, x, 2.9, -0.4, 1.8, 5.8, 18);
    battlement(x, 5.9, -0.4, 18.5, Math.PI / 2);
  }
  structure(box, basalt, 0, 3.1, -10.7, 28, 6.2, 1.7);
  battlement(0, 6.25, -10.7, 28.5);
  for (const side of [-1, 1]) {
    structure(box, basalt, side * 8.9, 3.1, 8.4, 9.4, 6.2, 1.9);
    battlement(side * 8.9, 6.25, 8.4, 9.6);
    structure(box, basalt, side * 3.85, 4.2, 8.15, 1.7, 8.4, 3.5);
    stamp(shard, obsidian, side * 3.85, 10.1, 8.15, 0.9, 3.2, 0.9);
  }
  structure(archFrame, basalt, 0, 0, 9.85, 5.6, 4.5, 8);
  structure(archFace, opening, 0, 0, 9.81, 5.6, 4.5, 1);
  stamp(archFrame, ledge, 0, 0, 10.02, 5.6, 4.5, 0.85);
  stamp(archFace, ember, 0, 0.4, 9.83, 1.45, 2.1, 1);
  structure(box, basalt, 0, 8.75, 8.55, 9.2, 1.2, 3.7);
  battlement(0, 9.3, 8.55, 9.2);
  stamp(box, ledge, 0, 0.1, 12.9, 5.6, 0.45, 5.8);
  for (const side of [-1, 1]) {
    stamp(box, obsidian, side * 3.1, 0.6, 12.8, 0.65, 0.9, 5.7);
    stamp(box, ember, side * 3.45, -0.34, 12.4, 0.18, 0.07, 6.4, side * 0.08, platformParts);
  }

  for (const [bucket, parent] of [[nearParts, detail], [farParts, distant], [platformParts, group]] as const) {
    for (const [material, parts] of bucket) {
      const merged = mergeGeometries(parts); parts.forEach(part => part.dispose());
      if (!merged) throw new Error('Unable to merge underworld fortress architecture');
      const mesh = new THREE.Mesh(own(merged), material);
      mesh.name = parent === group ? 'underworld-basalt-foundation' : 'underworld-fortress';
      parent.add(mesh);
    }
  }
  return { dispose() { resources.forEach(resource => resource.dispose()); } };
}
