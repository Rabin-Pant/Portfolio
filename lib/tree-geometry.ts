import * as THREE from 'three';

// Tapered sweeps give the trunk, roots, and branches continuous organic curves.
export function createLimb(points: THREE.Vector3[], radius: number, tip: number, segments: number, sides: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const frames = curve.computeFrenetFrames(segments, false);
  const vertices: number[] = [], uvs: number[] = [], indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments, center = curve.getPoint(t);
    const r = THREE.MathUtils.lerp(radius, tip, Math.pow(t, 0.7));
    for (let j = 0; j <= sides; j++) {
      const a = j / sides * Math.PI * 2;
      const ridge = 1 + Math.sin(a * 7 + t * 8) * 0.07 + Math.sin(a * 3 - t * 12) * 0.04;
      const p = center.clone().addScaledVector(frames.normals[i], Math.cos(a) * r * ridge)
        .addScaledVector(frames.binormals[i], Math.sin(a) * r * ridge);
      vertices.push(p.x, p.y, p.z); uvs.push(j / sides * 3, t * 12);
      if (i < segments && j < sides) {
        const k = i * (sides + 1) + j;
        indices.push(k, k + 1, k + sides + 1, k + 1, k + sides + 2, k + sides + 1);
      }
    }
  }
  const result = new THREE.BufferGeometry();
  result.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  result.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  result.setIndex(indices); result.computeVertexNormals();
  return result;
}

