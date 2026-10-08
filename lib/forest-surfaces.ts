import * as THREE from 'three';

export function createContactTexture() {
  const size = 64;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const distance = Math.hypot((x + 0.5) / size * 2 - 1, (y + 0.5) / size * 2 - 1);
    const index = (y * size + x) * 4;
    pixels[index] = pixels[index + 1] = pixels[index + 2] = 255;
    pixels[index + 3] = Math.max(0, 1 - distance) ** 2 * 255;
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.magFilter = texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Small, deterministic surface maps generated once; no image downloads.
export function createSurfaceTexture(kind: 'earth' | 'grain' | 'stone') {
  const size = 128;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 917;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296;
      const u = x / size * Math.PI * 2;
      const v = y / size * Math.PI * 2;
      const broad = Math.sin(u * 3 + Math.sin(v * 2)) * Math.cos(v * 3 + Math.sin(u));
      const grain = Math.sin(u * 24 + Math.sin(v * 2) * 2 + Math.sin(u * 3));
      const value = kind === 'grain' ? 207 + grain * 23 + noise * 20
        : 211 + broad * (kind === 'earth' ? 28 : 17) + (noise - 0.5) * 29;
      const index = (y * size + x) * 4;
      pixels[index] = value;
      pixels[index + 1] = value;
      pixels[index + 2] = value;
      pixels[index + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createPineGeometry(lightweight: boolean) {
  const profile = [new THREE.Vector2(0.05, -0.5)];
  const tiers = lightweight ? 5 : 7;
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    profile.push(new THREE.Vector2((1 - t) * 0.96, t - 0.49));
    profile.push(new THREE.Vector2((1 - t) * 0.59, t - 0.43));
  }
  profile.push(new THREE.Vector2(0, 0.5));
  const shape = new THREE.LatheGeometry(profile, lightweight ? 8 : 11);
  const positions = shape.getAttribute('position');
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const angle = Math.atan2(z, x);
    const irregularity = 1 + Math.sin(angle * 5 + y * 19) * 0.12;
    positions.setXYZ(i, x * irregularity, y + Math.sin(angle * 3) * 0.025, z * irregularity);
  }
  shape.computeVertexNormals();
  return shape;
}

export function createOrganicGeometry(detail: number) {
  const shape = new THREE.IcosahedronGeometry(1, detail);
  const positions = shape.getAttribute('position');
  const normals = shape.getAttribute('normal');
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const scale = 1 + 0.13 * Math.sin(x * 7 + z * 3) * Math.cos(y * 5 - z * 4);
    positions.setXYZ(i, x * scale, y * scale, z * scale);
    const length = Math.hypot(x, y, z);
    normals.setXYZ(i, x / length, y / length, z / length);
  }
  return shape;
}

export function createFernGeometry(lightweight: boolean) {
  const vertices: number[] = [];
  const fronds = lightweight ? 5 : 7;
  for (let f = 0; f < fronds; f++) {
    const angle = f / fronds * Math.PI * 2;
    const point = (r: number, side: number, y: number) => [
      Math.sin(angle) * r + Math.cos(angle) * side,
      y,
      Math.cos(angle) * r - Math.sin(angle) * side,
    ];
    for (let i = 0; i < 5; i++) {
      const t = (i + 1) / 6;
      const y = Math.sin(t * Math.PI * 0.85) * 0.65;
      for (const side of [-1, 1]) {
        vertices.push(...point(t * 0.8, 0, y),
          ...point(t * 0.8 + 0.15, side * (1 - t) * 0.28, y + 0.025),
          ...point(t * 0.8 + 0.23, 0, y + 0.06));
      }
    }
  }
  const shape = new THREE.BufferGeometry();
  shape.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  shape.computeVertexNormals();
  return shape;
}
