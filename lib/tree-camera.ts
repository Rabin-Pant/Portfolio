import { HEAVEN_REALM, TREE_REALMS } from './tree-realms';
import { CROWN_PROGRESS } from './tree-journey';

type Point = [number, number, number];
type CameraStop = { position: Point; target: Point };
const radial = (angle: number, y: number, radius: number): Point => [Math.sin(angle) * radius, y, Math.cos(angle) * radius];
const palacePoint = ([x, y, z]: Point): Point => {
  const { angle, radius, y: height } = HEAVEN_REALM;
  return [Math.sin(angle) * radius + Math.cos(angle) * x + Math.sin(angle) * z,
    height + y, Math.cos(angle) * radius - Math.sin(angle) * x + Math.cos(angle) * z];
};

// Each chapter has its own destination inside the same connected palace.
const palaceViews: CameraStop[] = [
  { position: [0, 46, 168], target: [0, 27, 0] },
  { position: [0, 19, 93], target: [0, 15, 30] },
  { position: [94, 27, 40], target: [31, 17, 6] },
  { position: [66, 52, -72], target: [25, 34, -22] },
  { position: [-88, 25, -40], target: [-30, 13, -7] },
  { position: [-15, 41, 83], target: [0, 35, -1] },
];

export const TREE_CAMERA_STOPS: CameraStop[] = Array.from({ length: CROWN_PROGRESS + 1 }, (_, index) => {
  if (index === 0) return { position: [0, 18, 155], target: [0, 42, 0] };
  if (index === 1) return { position: radial(TREE_REALMS[0].angle, -19, 125), target: radial(TREE_REALMS[0].angle, -33, TREE_REALMS[0].radius) };
  if (index >= HEAVEN_REALM.progress) {
    const view = palaceViews[Math.min(index - HEAVEN_REALM.progress, palaceViews.length - 1)];
    return { position: palacePoint(view.position), target: palacePoint(view.target) };
  }
  const realm = TREE_REALMS.find(item => item.progress === index)!;
  return { position: radial(realm.angle, realm.y + 15, realm.radius + 37), target: radial(realm.angle, realm.y + 2.5, realm.radius) };
});
