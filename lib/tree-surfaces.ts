import * as THREE from 'three';

// A small cutout of individual leaves gives canopy edges fine detail without
// thousands of separate leaf meshes or a downloaded texture.
export function createFoliageTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create foliage texture');
  let seed = 193;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  // Overlapping sprays with small gaps, shaded leaves, and fine central veins.
  for (let i = 0; i < 1150; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * (185 + Math.sin(angle * 5) * 22 + Math.cos(angle * 3) * 15);
    const x = 256 + Math.cos(angle) * radius;
    const y = 256 + Math.sin(angle) * radius * 0.87;
    const shade = Math.floor(160 + random() * 65 + (1 - y / 512) * 25);
    context.save(); context.translate(x, y); context.rotate(angle + random() * 2);
    const length = 5 + random() * 9, width = 3 + random() * 3;
    const gradient = context.createLinearGradient(0, -width, 0, width);
    gradient.addColorStop(0, `rgb(${shade},${Math.min(255, shade + 8)},${Math.floor(shade * 0.78)})`);
    gradient.addColorStop(1, `rgb(${shade * 0.68},${shade * 0.76},${shade * 0.5})`);
    context.fillStyle = gradient;
    context.beginPath(); context.moveTo(-length, 0);
    context.quadraticCurveTo(0, -width * 1.5, length, 0);
    context.quadraticCurveTo(0, width * 1.5, -length, 0); context.fill();
    context.strokeStyle = 'rgba(244,255,209,0.22)'; context.lineWidth = 0.65;
    context.beginPath(); context.moveTo(-length, 0); context.lineTo(length, 0); context.stroke();
    context.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

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
export function createSurfaceTexture(kind: 'earth' | 'stone' | 'bark') {
  const size = kind === 'bark' ? 512 : 128;
  const pixels = new Uint8Array(size * size * 4);
  let seed = 917;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 4294967296;
      const u = x / size * Math.PI * 2;
      const v = y / size * Math.PI * 2;
      const broad = Math.sin(u * 3 + Math.sin(v * 2)) * Math.cos(v * 3 + Math.sin(u));
      const fissure = Math.pow(Math.abs(Math.sin(u * 18 + Math.sin(v * 2) * 0.6 + Math.sin(v * 7) * 0.16)), 12);
      const value = kind === 'bark' ? 185 + broad * 22 - fissure * 88 + Math.sin(u * 53 + Math.sin(v * 4)) * 12 + (noise - 0.5) * 22
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
