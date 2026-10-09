import { TREE_REALMS } from './tree-realms';
import { CROWN_PROGRESS } from './tree-journey';

// Every close view aims at a inhabited branch; overview stops reveal how the
// settlements connect. Angles are unwrapped for a continuous spiral.
export const TREE_CAMERA_STOPS = Array.from({ length: CROWN_PROGRESS + 1 }, (_, index) => {
  if (index === 0) return [0, 18, 155, 42, 0];
  if (index === 1) return [TREE_REALMS[0].angle, -29, 77, -36, 26];
  if (index === 6) return [3.55, 76, 170, 60, 0];
  const realm = TREE_REALMS.find(item => item.progress === index) ?? TREE_REALMS[TREE_REALMS.length - 1];
  return [realm.angle, realm.y + 15, realm.radius + 37, realm.y + 2.5, realm.radius];
});
