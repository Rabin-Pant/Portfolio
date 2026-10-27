import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TREE_REALMS } from './tree-realms';
import { createContactTexture } from './tree-surfaces';
import { createHeavenPalace } from './heaven-palace';
import { createUnderworldFortress } from './underworld-fortress';

export function createBranchRealms(scene: THREE.Scene, lightweight: boolean) {
  const resources = new Set<THREE.BufferGeometry | THREE.Material | THREE.Texture>();
  const own = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(v: T): T => { resources.add(v); return v; };
  const box = own(new THREE.BoxGeometry(1, 1, 1));
  const roof = own(new THREE.ConeGeometry(1, 1, 4));
  const cylinder = own(new THREE.CylinderGeometry(1, 1, 1, 12));
  const cone = own(new THREE.ConeGeometry(1, 1, 10));
  const sphere = own(new THREE.SphereGeometry(1, 10, 7));
  const ring = own(new THREE.TorusGeometry(1, 0.055, 6, 32));
  const headGeometry = own(new THREE.SphereGeometry(0.14, 6, 5));
  const bodyGeometry = own(new THREE.CapsuleGeometry(0.14, 0.38, 2, 6));
  const cloudTexture = own(createContactTexture());
  const transform = new THREE.Object3D();
  const viewProjection = new THREE.Matrix4(), frustum = new THREE.Frustum();
  const palaces: ReturnType<typeof createHeavenPalace>[] = [];
  const fortresses: ReturnType<typeof createUnderworldFortress>[] = [];
  const states: { group: THREE.Group; detail: THREE.Group; distant: THREE.Group; residents: THREE.InstancedMesh; heads: THREE.InstancedMesh; residentTime: { value: number }; weather?: THREE.Points; rotor?: THREE.Object3D; bounds: THREE.Sphere; detailDistanceSquared: number; kind: string }[] = [];
  let seed = 731;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (const [realmIndex, realm] of TREE_REALMS.entries()) {
    const group = new THREE.Group(); group.name = realm.name;
    group.position.set(Math.sin(realm.angle) * realm.radius, realm.y, Math.cos(realm.angle) * realm.radius);
    group.rotation.y = realm.angle; scene.add(group);
    const detail = new THREE.Group(), distant = new THREE.Group(); group.add(detail, distant);
    const castle = realm.kind === 'castle';
    const underworld = realm.kind === 'roots';
    const standard = (color: string, roughness = 0.8) => own(new THREE.MeshStandardMaterial({ color, roughness }));
    const skin = standard('#e9c295'), clothes = standard(realm.kind === 'winter' ? '#a83e47' : realm.accent);
    const parts = new Map<THREE.Material, THREE.BufferGeometry[]>();
    const farParts = new Map<THREE.Material, THREE.BufferGeometry[]>();
    function stamp(g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number, rotation = 0, bucket = parts) {
      transform.position.set(x, y, z); transform.rotation.set(0, rotation, 0); transform.scale.set(sx, sy, sz); transform.updateMatrix();
      const copy = g.clone().applyMatrix4(transform.matrix); const list = bucket.get(m) ?? []; list.push(copy); bucket.set(m, list);
    }
    function single(g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number, parent: THREE.Object3D = detail) {
      const object = new THREE.Mesh(g, m); object.position.set(x, y, z); object.scale.set(sx, sy, sz); parent.add(object); return object;
    }
    let rotor: THREE.Object3D | undefined;
    // Dedicated fortresses and palaces supply their own materials and foundations.
    if ('ground' in realm) {
      const ground = standard(realm.ground), wall = standard(realm.walls), roofing = standard(realm.roof), timber = standard('#684934'), stone = standard('#385558');
      const accent = own(new THREE.MeshStandardMaterial({ color: realm.accent, emissive: realm.accent, emissiveIntensity: 0.5, roughness: 0.5 }));
      single(cylinder, stone, 0, -1.2, 0, 14.7, 2.2, 12.7, group);
      single(cylinder, ground, 0, -0.08, 0, 14.4, 0.3, 12.4, group);
      stamp(cylinder, wall, 0, 0.15, 2, 4.7, 0.15, 4.7);
      const houseCount = lightweight ? 9 : 13;
      for (let i = 0; i < houseCount; i++) {
        const a = Math.PI * 0.48 + i / (houseCount - 1) * Math.PI * 1.04;
        const x = Math.sin(a) * (9.4 + random()), z = Math.cos(a) * (8.5 + random()) - 1;
        const h = (realm.kind === 'academy' ? 5 : 2.7) + random() * 2, w = 2.4 + random() * 0.7;
        const round = realm.kind === 'academy';
        const body = round ? cylinder : box;
        const cap = realm.kind === 'academy' ? cone : roof;
        const capHeight = realm.kind === 'academy' ? 3.5 : 2.2;
        stamp(body, wall, x, h / 2, z, round ? w * 0.55 : w, h, round ? 1.4 : 2.8);
        stamp(cap, roofing, x, h + 1, z, w * 0.85, capHeight, 2.5, Math.PI / 4);
        stamp(box, timber, x, 0.7, z + 1.43, 0.65, 1.4, 0.08);
        for (const side of [-1, 1]) stamp(box, accent, x + side * w * 0.29, h * 0.65, z + 1.43, 0.43, 0.65, 0.08);
        if (realm.kind === 'winter' || realm.kind === 'workshop') stamp(box, timber, x + w * 0.3, h + 1.2, z - 0.4, 0.5, 1.8, 0.5);
        // Distant silhouettes are enough to show the tree is inhabited.
        stamp(body, wall, x, h / 2, z, round ? w * 0.55 : w, h, round ? 1.4 : 2.8, 0, farParts);
        stamp(cap, roofing, x, h + 1, z, w * 0.85, capHeight, 2.5, Math.PI / 4, farParts);
      }
      for (let i = 0; i < 7; i++) {
        const x = (i - 4) * 2.9, z = 9 + Math.cos(i * 0.5);
        stamp(cylinder, timber, x, 1.2, z, 0.09, 2.4, 0.09);
        stamp(sphere, accent, x, 2.5, z, 0.25, 0.32, 0.25);
      }
      if (realm.kind === 'winter') {
        stamp(box, wall, 0, 2.4, -1, 6, 4.8, 4.5);
        stamp(roof, roofing, 0, 5.3, -1, 5, 3.4, 4, Math.PI / 4);
        stamp(box, accent, 0, 2.4, 1.27, 1.1, 2.1, 0.08);
        for (const x of [-5, 5]) {
          stamp(cylinder, timber, x, 2, 3, 0.18, 4, 0.18);
          stamp(cone, roofing, x, 3.7, 3, 1.6, 4.8, 1.6);
        }
      } else if (realm.kind === 'garden') {
        // Paired garden terraces connected by a long visible crossing.
        for (const x of [-6, 6]) {
          stamp(cylinder, timber, x, 0.4, -1, 3.2, 0.8, 3.2);
          for (let i = 0; i < 5; i++) {
            const a = i / 5 * Math.PI * 2;
            stamp(cylinder, timber, x + Math.sin(a) * 2, 1.6, -1 + Math.cos(a) * 2, 0.13, 2.3, 0.13);
            stamp(sphere, accent, x + Math.sin(a) * 2, 3, -1 + Math.cos(a) * 2, 1.2, 0.9, 1.2);
          }
        }
        for (let i = 0; i < 20; i++) {
          const x = -6 + i * 0.63, y = 0.75 - Math.sin(i / 19 * Math.PI) * 0.4;
          stamp(box, timber, x, y, 4, 0.6, 0.15, 2.1);
          if (i % 3 === 0) for (const z of [3, 5]) stamp(cylinder, timber, x, y + 0.7, z, 0.06, 1.4, 0.06);
        }
      } else if (realm.kind === 'workshop') {
        stamp(cylinder, wall, 0, 3.5, -2, 2.1, 7, 2.1);
        stamp(cone, roofing, 0, 7.7, -2, 2.7, 2.8, 2.7);
        rotor = new THREE.Group(); rotor.position.set(0, 5, 0.2); detail.add(rotor);
        for (let i = 0; i < 2; i++) {
          const blade = single(box, accent, 0, 0, 0, 0.5, 7.5, 0.15, rotor); blade.rotation.z = i * Math.PI / 2;
        }
        for (const x of [-5, 5]) { stamp(box, timber, x, 1.1, 3, 3, 0.2, 1.8); stamp(box, roofing, x, 1.5, 3, 1, 0.6, 1); }
      } else if (realm.kind === 'academy') {
        stamp(cylinder, wall, 0, 0.6, -1, 5, 1.2, 5);
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * Math.PI * 2;
          stamp(cylinder, wall, Math.sin(a) * 4.2, 4, -1 + Math.cos(a) * 4.2, 0.28, 7, 0.28);
          stamp(cone, roofing, Math.sin(a) * 4.2, 8, -1 + Math.cos(a) * 4.2, 0.75, 1.7, 0.75);
        }
        rotor = new THREE.Group(); rotor.position.set(0, 6, -1); detail.add(rotor);
        single(sphere, accent, 0, 0, 0, 1.1, 1.1, 1.1, rotor);
        single(ring, roofing, 0, 0, 0, 2.4, 2.4, 2.4, rotor).rotation.x = 0.8;
        single(ring, accent, 0, 0, 0, 2, 2, 2, rotor).rotation.y = 1;
      }
      if (realm.kind === 'academy') {
        const cloudMaterial = own(new THREE.SpriteMaterial({ map: cloudTexture, color: '#dceefa', transparent: true, opacity: 0.35, depthWrite: false }));
        for (let i = 0; i < 4; i++) {
          const cloud = new THREE.Sprite(cloudMaterial), a = i / 4 * Math.PI * 2;
          cloud.position.set(Math.sin(a) * 19, -3, Math.cos(a) * 17); cloud.scale.set(24, 7, 1); detail.add(cloud);
        }
      }
    }
    if (underworld) fortresses.push(createUnderworldFortress(group, detail, distant, lightweight));
    else if (castle) palaces.push(createHeavenPalace(group, detail, distant, lightweight));
    // Snow is confined to the ground-floor winter realm.
    let weather: THREE.Points | undefined;
    if (realm.kind === 'winter') {
      const positions = new Float32Array((lightweight ? 240 : 420) * 3);
      for (let i = 0; i < positions.length / 3; i++) positions.set([(random() - 0.5) * 40, random() * 22, (random() - 0.5) * 32 + 5], i * 3);
      const geometry = own(new THREE.BufferGeometry()); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const snow = own(new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { time: { value: 0 } },
        vertexShader: `uniform float time; void main(){ vec3 p=position; p.y=mod(p.y-time*2.3+220.0,22.0); p.x+=sin(time*.7+p.z)*1.2; vec4 v=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*v; gl_PointSize=clamp(115.0/-v.z,2.0,7.0); }`,
        fragmentShader: `void main(){float a=1.0-smoothstep(.12,.5,length(gl_PointCoord-vec2(.5))); gl_FragColor=vec4(.92,.97,1.0,a*.95);}`,
      })); weather = new THREE.Points(geometry, snow); weather.frustumCulled = false; detail.add(weather);
    }
    for (const [bucket, parent] of [[parts, detail], [farParts, distant]] as const) for (const [m, geometries] of bucket) {
      const merged = mergeGeometries(geometries); geometries.forEach(g => g.dispose());
      if (merged) parent.add(new THREE.Mesh(own(merged), m));
    }
    // Citizens follow their paths in the vertex shader. Their instance matrices
    // are uploaded once rather than rewritten for every animation frame.
    // Palace inhabitants are the full-size royal court, with an open central aisle.
    const residentCount = castle ? 0 : underworld ? (lightweight ? 6 : 10) : lightweight ? 10 : 18;
    const motion = new Float32Array(residentCount * 4);
    for (let i = 0; i < residentCount; i++) motion.set([
      i / residentCount * Math.PI * 2 + realmIndex * 0.73,
      underworld ? 2.3 + i % 3 * 0.3 : (castle ? 9 : 5.5) + i % 3,
      0.028 + (i % 3) * 0.006,
      i,
    ], i * 4);
    const residentMotion = new THREE.InstancedBufferAttribute(motion, 4);
    const bodies = own(bodyGeometry.clone()), faces = own(headGeometry.clone());
    bodies.setAttribute('residentMotion', residentMotion); faces.setAttribute('residentMotion', residentMotion);
    const residentTime = { value: 0 };
    for (const material of [skin, clothes]) {
      material.onBeforeCompile = shader => {
        shader.uniforms.residentTime = residentTime;
        shader.uniforms.residentPath = { value: new THREE.Vector2(castle ? 18 : underworld ? 12.1 : 4, underworld ? 0.75 : 2.4) };
        shader.uniforms.residentOffset = { value: underworld ? -7.8 : 0 };
        shader.vertexShader = 'uniform float residentTime; uniform vec2 residentPath; uniform float residentOffset; attribute vec4 residentMotion;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
          #include <begin_vertex>
          float walkAngle = residentMotion.x + residentTime * residentMotion.z;
          float facing = walkAngle + 1.5707963;
          transformed.xz = mat2(cos(facing), -sin(facing), sin(facing), cos(facing)) * transformed.xz;
          transformed.x += residentOffset + sin(walkAngle) * residentMotion.y;
          transformed.z += residentPath.x + cos(walkAngle) * residentPath.y;
          transformed.y += abs(sin(residentTime * 4.0 + residentMotion.w)) * 0.045;
        `);
      };
      material.customProgramCacheKey = () => 'realm-citizens-v2';
    }
    const residents = new THREE.InstancedMesh(bodies, clothes, residentCount);
    const heads = new THREE.InstancedMesh(faces, skin, residentCount);
    transform.rotation.set(0, 0, 0); transform.scale.setScalar(1);
    for (let i = 0; i < residentCount; i++) {
      transform.position.set(0, castle ? 7.7 : 0.46, 0); transform.updateMatrix(); residents.setMatrixAt(i, transform.matrix);
      transform.position.y += 0.43; transform.updateMatrix(); heads.setMatrixAt(i, transform.matrix);
    }
    residents.instanceMatrix.needsUpdate = heads.instanceMatrix.needsUpdate = true;
    residents.frustumCulled = heads.frustumCulled = false; detail.add(residents, heads);
    const bounds = new THREE.Sphere(group.position.clone().add(new THREE.Vector3(0, castle ? 25 : underworld ? 10 : 8, 0)), castle ? 108 : underworld ? 31 : realm.kind === 'winter' ? 33 : 26);
    const detailDistance = castle ? 245 : underworld ? 120 : lightweight ? 65 : 78;
    states.push({ group, detail, distant, residents, heads, residentTime, weather, rotor, bounds, detailDistanceSquared: detailDistance * detailDistance, kind: realm.kind });
  }
  return {
    update(time: number, camera: THREE.Camera) {
      // Test whole realms first; invisible groups need no animations or draws.
      camera.updateMatrixWorld();
      viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(viewProjection);
      for (const state of states) {
        state.group.visible = frustum.intersectsSphere(state.bounds);
        if (!state.group.visible) continue;
        const near = camera.position.distanceToSquared(state.bounds.center) < state.detailDistanceSquared;
        state.detail.visible = near; state.distant.visible = !near;
        if (!near) continue;
        state.residentTime.value = time;
        if (state.weather) (state.weather.material as THREE.ShaderMaterial).uniforms.time.value = time;
        if (state.rotor) { if (state.kind === 'workshop') state.rotor.rotation.z = time * 0.4; else state.rotor.rotation.y = time * 0.2; }
      }
      palaces.forEach(palace => palace.update(time, camera));
    },
    dispose() { states.forEach(s => { s.residents.dispose(); s.heads.dispose(); s.group.removeFromParent(); }); palaces.forEach(palace => palace.dispose()); fortresses.forEach(fortress => fortress.dispose()); resources.forEach(r => r.dispose()); },
  };
}
