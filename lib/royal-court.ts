import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PALACE_LAYOUT } from './palace-layout';

type Point = [number, number, number];
type Motion = [number, number, number];
type CourtMember = {
  name: string;
  role: 'king' | 'guard' | 'advisor' | 'attendant';
  pose: 'seated' | 'standing';
  position: Point;
};

// Characters are actual 3D geometry, merged by material. Individual pivot and
// motion attributes keep idle animation on the GPU without per-person draws.
export function createRoyalCourt(parent: THREE.Group, lightweight: boolean) {
  const resources = new Set<THREE.BufferGeometry | THREE.Material>();
  const own = <T extends THREE.BufferGeometry | THREE.Material>(resource: T): T => { resources.add(resource); return resource; };
  const material = (name: string, color: string, metalness = 0, roughness = 0.8) => {
    const value = own(new THREE.MeshStandardMaterial({ color, metalness, roughness }));
    value.name = name;
    return value;
  };
  const gold = material('court-gold', '#e8b84e', 0.65, 0.3);
  const crimson = material('royal-crimson', '#821e32');
  const teal = material('court-teal', '#245b60');
  const blue = material('guard-steel', '#405562', 0.55, 0.38);
  const skin = [material('warm-skin', '#ce956c'), material('deep-skin', '#8f6048')];
  const dark = material('hair-and-leather', '#291d20');
  const silver = material('ermine-and-silver', '#e5dfcc', 0.15);
  const jewel = material('royal-jade', '#49b9a7', 0.4, 0.25);
  jewel.emissive.set('#226a57'); jewel.emissiveIntensity = 0.22;
  const flame = own(new THREE.MeshBasicMaterial({ color: '#ffdc91', toneMapped: false }));
  flame.name = 'court-candlelight';
  const sides = lightweight ? 8 : 12;
  const sphere = own(new THREE.SphereGeometry(1, sides, lightweight ? 6 : 8));
  const cylinder = own(new THREE.CylinderGeometry(1, 1, 1, sides));
  const robe = own(new THREE.CylinderGeometry(0.62, 1, 1, sides));
  const cone = own(new THREE.ConeGeometry(1, 1, sides));
  const box = own(new THREE.BoxGeometry(1, 1, 1));
  const ring = own(new THREE.TorusGeometry(1, 0.13, 5, sides).rotateX(Math.PI / 2));
  const pieces = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const transform = new THREE.Object3D(), actor = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0), direction = new THREE.Vector3();
  const pivot = new THREE.Vector3();
  const time = { value: 0 };
  const members: CourtMember[] = [];
  const court = new THREE.Group(); court.name = 'palace-royal-court'; parent.add(court);
  court.userData.members = members;
  let phase = 0;
  const still: Motion = [0, 0, 0], body: Motion = [0, 1, 0], head: Motion = [1, 1, 0], fabric: Motion = [0, 1, 1];

  function bake(geometry: THREE.BufferGeometry, surface: THREE.Material, motion: Motion) {
    const copy = geometry.clone().applyMatrix4(transform.matrix).applyMatrix4(actor.matrix);
    const count = copy.getAttribute('position').count;
    const pivots = new Float32Array(count * 3), movement = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      pivots.set([pivot.x, pivot.y, pivot.z], i * 3);
      movement.set([...motion, phase], i * 4);
    }
    copy.setAttribute('courtPivot', new THREE.BufferAttribute(pivots, 3));
    copy.setAttribute('courtMotion', new THREE.BufferAttribute(movement, 4));
    const bucket = pieces.get(surface) ?? []; bucket.push(copy); pieces.set(surface, bucket);
  }
  function part(geometry: THREE.BufferGeometry, surface: THREE.Material, position: Point, scale: Point,
    motion = still, rotation: Point = [0, 0, 0]) {
    transform.position.fromArray(position); transform.rotation.set(...rotation); transform.scale.fromArray(scale); transform.updateMatrix();
    bake(geometry, surface, motion);
  }
  function limb(surface: THREE.Material, start: Point, end: Point, radius: number, motion = body) {
    direction.fromArray(end).sub(new THREE.Vector3(...start));
    transform.position.fromArray(start).addScaledVector(direction, 0.5);
    transform.quaternion.setFromUnitVectors(up, direction.clone().normalize());
    transform.scale.set(radius, direction.length(), radius); transform.updateMatrix();
    bake(cylinder, surface, motion);
  }
  function person(name: string, role: CourtMember['role'], x: number, y: number, z: number, yaw: number, headHeight: number) {
    members.push({ name, role, pose: role === 'king' ? 'seated' : 'standing', position: [x, y, z] });
    actor.position.set(x, y, z); actor.rotation.set(0, yaw, 0); actor.scale.setScalar(1); actor.updateMatrix();
    phase = members.length * 1.73;
    pivot.set(0, headHeight - 0.3, 0).applyMatrix4(actor.matrix);
  }
  function face(height: number, complexion: THREE.Material, beard: boolean, crowned = false) {
    part(sphere, complexion, [0, height, 0], [0.39, 0.47, 0.36], head);
    part(sphere, dark, [0, height + 0.19, -0.08], [0.42, 0.36, 0.32], head);
    // Eyes and nose face the camera along the palace's +Z axis.
    for (const x of [-0.14, 0.14]) {
      part(sphere, dark, [x, height + 0.025, 0.33], [0.045, 0.035, 0.025], head);
      part(box, dark, [x, height + 0.115, 0.327], [0.14, 0.025, 0.025], head);
    }
    part(sphere, complexion, [0, height - 0.075, 0.38], [0.09, 0.14, 0.1], head);
    if (beard) part(cone, dark, [0, height - 0.32, 0.15], [0.28, 0.48, 0.25], head, [0, 0, Math.PI]);
    if (crowned) {
      part(cylinder, gold, [0, height + 0.37, 0], [0.44, 0.22, 0.4], head);
      part(ring, gold, [0, height + 0.49, 0], [0.44, 0.38, 0.4], head);
      for (let i = 0; i < 7; i++) {
        const angle = i / 7 * Math.PI * 2;
        part(cone, gold, [Math.sin(angle) * 0.4, height + 0.72, Math.cos(angle) * 0.36], [0.095, 0.43, 0.095], head);
      }
      part(sphere, jewel, [0, height + 0.4, 0.42], [0.1, 0.14, 0.055], head);
    }
  }

  const { floor, throneZ } = PALACE_LAYOUT;
  // A full seated pose: boots on the dais, bent knees, hands on the armrests,
  // an ermine mantle, jeweled crown, and a ceremonial orb.
  person('The king', 'king', 0, floor, throneZ + 0.12, 0, 6.15);
  part(robe, crimson, [0, 4.62, -0.04], [1.12, 2.35, 0.67], fabric);
  part(box, crimson, [0, 4.62, -0.57], [1.85, 3.7, 0.16], fabric);
  part(sphere, silver, [0, 5.46, -0.06], [1.12, 0.42, 0.66], body);
  for (const side of [-1, 1]) {
    part(sphere, gold, [side * 0.96, 5.3, 0], [0.29, 0.16, 0.43], body);
    limb(crimson, [side * 0.9, 5.05, 0], [side * 1.45, 4.2, 0.35], 0.27);
    limb(crimson, [side * 1.45, 4.2, 0.35], [side * 1.9, 4.1, 0.87], 0.22);
    part(sphere, skin[0], [side * 1.9, 4.1, 0.95], [0.23, 0.16, 0.32], body);
    part(box, crimson, [side * 0.47, 3.23, 0.62], [0.8, 0.65, 1.65], fabric);
    limb(crimson, [side * 0.49, 3.25, 1.35], [side * 0.49, 1.62, 1.48], 0.3, fabric);
    part(box, dark, [side * 0.49, 1.38, 1.65], [0.62, 0.45, 0.95]);
    part(box, gold, [side * 0.49, 1.62, 1.89], [0.42, 0.1, 0.12]);
  }
  part(box, gold, [0, 3.8, 0.6], [1.65, 0.16, 0.12], body);
  part(sphere, jewel, [0, 5.36, 0.61], [0.18, 0.24, 0.08], body);
  part(cylinder, gold, [0, 5.75, 0], [0.2, 0.45, 0.2], body);
  face(6.15, skin[0], true, true);
  part(sphere, jewel, [1.9, 4.43, 1], [0.25, 0.25, 0.25], body);
  part(ring, gold, [1.9, 4.43, 1], [0.27, 0.27, 0.27], body);
  part(cylinder, gold, [1.9, 4.76, 1], [0.025, 0.22, 0.025], body);
  part(box, gold, [1.9, 4.81, 1], [0.16, 0.035, 0.035], body);

  function standing(role: 'guard' | 'advisor' | 'attendant', side: number, x: number, z: number, index: number) {
    const guard = role === 'guard', advisor = role === 'advisor';
    const outfit = guard ? blue : advisor ? teal : crimson;
    person(`${role}-${side < 0 ? 'left' : 'right'}-${index}`, role, side * x, floor, z, -side * (guard ? 0.08 : 0.28), 4.05);
    const complexion = skin[(index + (side > 0 ? 1 : 0)) % skin.length];
    for (const s of [-1, 1]) {
      part(box, dark, [s * 0.3, 0.24, 0.15], [0.4, 0.48, 0.7]);
      limb(guard ? blue : dark, [s * 0.3, 0.5, 0], [s * 0.3, 1.9, 0], 0.22);
    }
    if (!guard) part(robe, outfit, [0, 1.49, -0.04], [0.91, 2.5, 0.58], fabric);
    part(robe, outfit, [0, 2.65, 0], [1.02, 1.55, 0.58], body);
    part(cylinder, gold, [0, 2.1, 0], [0.69, 0.12, 0.4], body);
    part(cylinder, complexion, [0, 3.55, 0], [0.18, 0.38, 0.18], body);
    for (const s of [-1, 1]) {
      part(sphere, gold, [s * 0.77, 3.23, 0], [0.3, 0.18, 0.4], body);
      const handX = guard ? s * 1.02 : s * 0.37, handY = guard ? 2.28 : 2.63;
      limb(outfit, [s * 0.74, 3.16, 0], [s * 0.94, 2.65, 0.14], 0.21);
      limb(outfit, [s * 0.94, 2.65, 0.14], [handX, handY, 0.48], 0.17);
      part(sphere, complexion, [handX, handY, 0.52], [0.16, 0.19, 0.16], body);
    }
    part(sphere, gold, [0, 3.06, 0.48], [0.12, 0.19, 0.05], body);
    face(4.05, complexion, advisor);
    if (guard) {
      part(sphere, blue, [0, 4.29, -0.04], [0.46, 0.35, 0.41], head);
      part(box, gold, [0, 4.25, 0.34], [0.07, 0.42, 0.13], head);
      part(box, crimson, [0, 4.65, -0.05], [0.15, 0.63, 0.55], head);
      part(cylinder, dark, [side * 1.14, 2.7, 0.42], [0.055, 5.4, 0.055]);
      part(cone, gold, [side * 1.14, 5.62, 0.42], [0.17, 0.7, 0.13]);
      part(ring, gold, [side * 1.14, 5.24, 0.42], [0.17, 0.17, 0.17]);
    } else if (advisor) {
      part(cylinder, silver, [0, 2.69, 0.58], [0.12, 1.15, 0.12], body, [0, 0, Math.PI / 2]);
      for (const s of [-1, 1]) part(cylinder, gold, [s * 0.57, 2.69, 0.58], [0.15, 0.07, 0.15], body, [0, 0, Math.PI / 2]);
      part(cylinder, teal, [0, 4.43, -0.04], [0.43, 0.24, 0.4], head);
    } else {
      part(box, gold, [0, 2.58, 0.66], [0.9, 0.07, 0.55], body);
      part(sphere, jewel, [0, 2.77, 0.66], [0.18, 0.18, 0.18], body);
    }
  }
  for (const side of [-1, 1]) {
    standing('guard', side, 4.85, -14.2, 0);
    standing('advisor', side, 8.1, -11.8, 1);
    standing('attendant', side, 7.6, -7.2, 2);
    if (!lightweight) standing('guard', side, 10.8, -3.4, 3);
  }

  // Candelabra sit outside the carpet. All flames share one animated draw.
  actor.position.set(0, 0, 0); actor.rotation.set(0, 0, 0); actor.updateMatrix(); pivot.set(0, 0, 0);
  for (const side of [-1, 1]) for (const z of [-15, -6]) {
    const x = side * (z === -15 ? 6.6 : 11.4);
    part(cylinder, gold, [x, floor + 0.15, z], [0.62, 0.3, 0.62]);
    part(cylinder, gold, [x, floor + 1.9, z], [0.12, 3.5, 0.12]);
    part(sphere, gold, [x, floor + 3.5, z], [0.28, 0.28, 0.28]);
    for (let i = -1; i <= 1; i++) {
      const candleX = x + i * 0.6, height = floor + 3.9 - Math.abs(i) * 0.3;
      limb(gold, [x, floor + 3.25, z], [candleX, height, z], 0.065, still);
      part(cylinder, gold, [candleX, height, z], [0.2, 0.12, 0.2]);
      part(cylinder, silver, [candleX, height + 0.28, z], [0.075, 0.5, 0.075]);
      phase += 1.4; pivot.set(candleX, height + 0.6, z);
      part(sphere, flame, [candleX, height + 0.65, z], [0.09, 0.23, 0.09], [0, 1, 1]);
    }
  }

  for (const [surface, geometries] of pieces) {
    surface.onBeforeCompile = shader => {
      shader.uniforms.courtTime = time;
      shader.vertexShader = `uniform float courtTime; attribute vec3 courtPivot; attribute vec4 courtMotion;\n` + shader.vertexShader;
      const angle = 'sin(courtTime * 0.36 + courtMotion.w) * 0.035 * courtMotion.x';
      shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', `
        #include <beginnormal_vertex>
        float courtNormalAngle = ${angle};
        objectNormal.xz = mat2(cos(courtNormalAngle), -sin(courtNormalAngle), sin(courtNormalAngle), cos(courtNormalAngle)) * objectNormal.xz;
      `);
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        float courtAngle = ${angle};
        vec2 relativeHead = transformed.xz - courtPivot.xz;
        transformed.xz = courtPivot.xz + mat2(cos(courtAngle), -sin(courtAngle), sin(courtAngle), cos(courtAngle)) * relativeHead;
        transformed.y += sin(courtTime * ${surface === flame ? '6.7' : '0.92'} + courtMotion.w) * ${surface === flame ? '0.045' : '0.018'} * courtMotion.y;
        transformed.x += sin(courtTime * ${surface === flame ? '8.3' : '0.7'} + courtMotion.w + position.y * 0.6) * ${surface === flame ? '0.04' : '0.025'} * courtMotion.z;
      `);
    };
    surface.customProgramCacheKey = () => surface === flame ? 'royal-flame-v1' : 'royal-idle-v1';
    const merged = mergeGeometries(geometries); geometries.forEach(geometry => geometry.dispose());
    if (!merged) throw new Error('Unable to merge royal court');
    const mesh = new THREE.Mesh(own(merged), surface);
    mesh.name = surface.name; mesh.userData.royalCourt = true; court.add(mesh);
  }

  // One local light adds a warm key to the faces and metal, without shadow passes.
  const candlelight = new THREE.PointLight('#ffd18a', 65, 30, 2);
  candlelight.name = 'throne-candlelight'; candlelight.position.set(-5, floor + 10, -10); court.add(candlelight);
  const motes = new Float32Array((lightweight ? 24 : 48) * 3);
  for (let i = 0; i < motes.length / 3; i++) motes.set([Math.sin(i * 2.39996) * (3 + i % 9), (i * 1.71) % 14, -17 + (i * 2.37) % 27], i * 3);
  const dustGeometry = own(new THREE.BufferGeometry()); dustGeometry.setAttribute('position', new THREE.BufferAttribute(motes, 3));
  const dustMaterial = own(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { courtTime: time, floorHeight: { value: floor } },
    vertexShader: `uniform float courtTime; uniform float floorHeight; varying float dustAlpha;
      void main() { vec3 p = position; p.y = mod(p.y + courtTime * 0.12, 14.0);
        dustAlpha = smoothstep(0.0, 2.0, p.y) * (1.0 - smoothstep(11.0, 14.0, p.y));
        p.y += floorHeight; p.x += sin(courtTime * 0.16 + position.z) * 0.24;
        vec4 view = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * view;
        gl_PointSize = clamp(34.0 / max(1.0, -view.z), 1.0, 2.2); }`,
    fragmentShader: `varying float dustAlpha; void main() {
      float alpha = (1.0 - smoothstep(0.1, 0.5, length(gl_PointCoord - vec2(0.5)))) * dustAlpha * 0.23;
      gl_FragColor = vec4(1.0, 0.76, 0.4, alpha);
      #include <colorspace_fragment>
    }`,
  }));
  const dust = new THREE.Points(dustGeometry, dustMaterial); dust.name = 'throne-room-dust'; court.add(dust);
  const localCamera = new THREE.Vector3();
  return {
    group: court,
    update(elapsed: number, camera?: THREE.Camera) {
      time.value = elapsed;
      candlelight.intensity = 65 + Math.sin(elapsed * 4.7) * 2 + Math.sin(elapsed * 7.1) * 1.2;
      if (camera) {
        parent.worldToLocal(localCamera.copy(camera.position));
        candlelight.visible = parent.visible && parent.parent?.visible !== false
          && Math.abs(localCamera.x) < 30 && localCamera.z < 42 && localCamera.z > -40 && localCamera.y > floor;
      }
    },
    dispose() { court.removeFromParent(); resources.forEach(resource => resource.dispose()); },
  };
}
