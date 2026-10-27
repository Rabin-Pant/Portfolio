import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import * as THREE from 'three';

// Run the actual TypeScript scene modules without adding a test runtime.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && context.parentURL) {
      const candidate = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(candidate)) return nextResolve(candidate.href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.ts')) {
      const source = ts.transpileModule(readFileSync(fileURLToPath(url), 'utf8'), {
        compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
      }).outputText;
      return { format: 'module', source, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

const { TREE_CAMERA_STOPS, palacePoint } = await import('../lib/tree-camera.ts');
const { CROWN_PROGRESS, JOURNEY_WAYPOINTS, PALACE_ENTRANCE_PROGRESS } = await import('../lib/tree-journey.ts');
const { createHeavenPalace } = await import('../lib/heaven-palace.ts');
const { HEAVEN_REALM } = await import('../lib/tree-realms.ts');
const { PALACE_LAYOUT } = await import('../lib/palace-layout.ts');

assert.equal(TREE_CAMERA_STOPS.length, CROWN_PROGRESS + 1);
assert.equal(JOURNEY_WAYPOINTS.at(-1).id, 'contact');
assert.equal(JOURNEY_WAYPOINTS.at(-1).progress, CROWN_PROGRESS);
assert.ok(JOURNEY_WAYPOINTS.every((stop, index) => index === 0 || stop.progress > JOURNEY_WAYPOINTS[index - 1].progress));

const orbit = new THREE.CatmullRomCurve3(TREE_CAMERA_STOPS.map(stop => new THREE.Vector3(...stop.position)), false, 'catmullrom', 0.3);
const aim = new THREE.CatmullRomCurve3(TREE_CAMERA_STOPS.map(stop => new THREE.Vector3(...stop.target)), false, 'catmullrom', 0.3);
const directions = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)];

for (const lightweight of [false, true]) {
  const palace = new THREE.Group(), detail = new THREE.Group(), distant = new THREE.Group();
  palace.position.fromArray(palacePoint([0, 0, 0])); palace.rotation.y = HEAVEN_REALM.angle;
  palace.add(detail, distant);
  const architecture = createHeavenPalace(palace, detail, distant, lightweight);
  palace.updateMatrixWorld(true);
  const court = detail.getObjectByName('palace-royal-court');
  assert.ok(court, 'The throne room must be inhabited');
  const members = court.userData.members;
  const king = members.find(member => member.role === 'king');
  assert.equal(king?.pose, 'seated', 'The king must be seated on the throne');
  assert.ok(Math.abs(king.position[0]) < 0.1 && Math.abs(king.position[2] - PALACE_LAYOUT.throneZ) < 1);
  assert.ok(members.filter(member => member.role === 'guard').length >= 2, 'The throne needs flanking guards');
  assert.ok(members.filter(member => member.role === 'advisor').length >= 2, 'The court needs advisors');
  assert.ok(members.filter(member => member.role !== 'king').every(member => Math.abs(member.position[0]) > 3), 'Keep the processional aisle clear');
  const collisionMeshes = [];
  detail.traverse(object => { if (object.isMesh) collisionMeshes.push(object); });
  const ray = new THREE.Raycaster(), position = new THREE.Vector3(), target = new THREE.Vector3();
  let samples = 0, crossedEntrance = false;
  // Sample the curve itself, including in-between positions and reversed travel.
  for (let progress = PALACE_ENTRANCE_PROGRESS; progress <= CROWN_PROGRESS + 0.0001; progress += 0.005) {
    const t = Math.min(progress, CROWN_PROGRESS) / CROWN_PROGRESS;
    orbit.getPoint(t, position); aim.getPoint(t, target);
    const local = palace.worldToLocal(position.clone());
    assert.ok(local.y > PALACE_LAYOUT.floor + 2, `Camera below walking height at ${progress}`);
    assert.ok(Math.abs(local.x) < 0.001, `Camera leaves the entrance axis at ${progress}`);
    if (local.z < PALACE_LAYOUT.entranceZ) crossedEntrance = true;
    for (const direction of directions) {
      ray.set(position, direction); ray.near = 0; ray.far = 0.65;
      assert.equal(ray.intersectObjects(collisionMeshes, false).length, 0, `Camera clips architecture at ${progress.toFixed(3)} (${lightweight ? 'mobile' : 'desktop'})`);
    }
    const distance = position.distanceTo(target);
    ray.set(position, target.clone().sub(position).normalize()); ray.far = distance - 0.5;
    assert.equal(ray.intersectObjects(collisionMeshes, false).filter(hit => !hit.object.userData.royalCourt).length, 0, `View toward throne obstructed at ${progress.toFixed(3)}`);
    samples++;
  }
  assert.ok(crossedEntrance, 'Route must pass through the main entrance');
  const final = palace.worldToLocal(new THREE.Vector3(...TREE_CAMERA_STOPS.at(-1).position));
  assert.ok(Math.hypot(final.x, final.z + 4) < 17, 'Contact must end inside the throne room');
  assert.ok(detail.children.length < 24, 'Static palace detail should remain batched by material');
  assert.ok(court.children.filter(object => object.isMesh).length <= 12, 'Court members must share material batches');
  const framing = new THREE.PerspectiveCamera(lightweight ? 68 : 58, lightweight ? 390 / 844 : 16 / 10, 0.2, 480);
  framing.position.fromArray(TREE_CAMERA_STOPS.at(-1).position);
  framing.lookAt(new THREE.Vector3(...TREE_CAMERA_STOPS.at(-1).target)); framing.updateMatrixWorld();
  for (const member of members.filter(member => member.role === 'king' || (member.role === 'guard' && member.position[2] < -10))) {
    const face = palace.localToWorld(new THREE.Vector3(...member.position).add(new THREE.Vector3(0, member.role === 'king' ? 6.15 : 4.05, 0))).project(framing);
    assert.ok(Math.abs(face.x) < 0.95 && Math.abs(face.y) < 0.95 && face.z < 1, `${member.name} should fit in the final composition`);
  }
  console.log(`${lightweight ? 'Mobile' : 'Desktop'}: ${samples} route samples clear; seated king and ${members.length - 1} court members; king and guards framed at Contact.`);
  architecture.dispose();
}
