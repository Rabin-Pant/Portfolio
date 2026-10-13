type TreeRealm = {
  progress: number; name: string; angle: number; y: number; radius: number;
  accent: string; horizon: string; zenith: string;
} & (
  { kind: 'roots' | 'castle' }
  | { kind: 'winter' | 'garden' | 'workshop' | 'academy'; ground: string; walls: string; roof: string }
);

// Projects and Contact visit different parts of this one shared citadel.
export const HEAVEN_REALM: TreeRealm = {
  progress: 6, name: 'Heaven Citadel', kind: 'castle', angle: 4.1, y: 79, radius: 68,
  accent: '#ffe4a0', horizon: '#e0e7e9', zenith: '#8cb4cf',
};

export const TREE_REALMS: TreeRealm[] = [
  { progress: 1, name: 'Rootbound Underworld', kind: 'roots', angle: 0.38, y: -35, radius: 36, accent: '#ff792f', horizon: '#8c311b', zenith: '#210b0d' },
  { progress: 2, name: 'Frosthaven', kind: 'winter', angle: 0.95, y: 18, radius: 48, ground: '#dbeaf6', walls: '#789aaf', roof: '#e8f4ff', accent: '#ffbc67', horizon: '#abcfe8', zenith: '#416b9d' },
  { progress: 3, name: 'Bloomgrove', kind: 'garden', angle: 1.7, y: 29, radius: 54, ground: '#438451', walls: '#d7c597', roof: '#427758', accent: '#ff91b8', horizon: '#9bd9c6', zenith: '#32849c' },
  { progress: 4, name: 'Copperleaf', kind: 'workshop', angle: 2.45, y: 39, radius: 60, ground: '#50714a', walls: '#c39761', roof: '#9a5438', accent: '#ffce75', horizon: '#acd2bd', zenith: '#407c94' },
  { progress: 5, name: 'Skyward Academy', kind: 'academy', angle: 3.1, y: 49, radius: 63, ground: '#7da5a0', walls: '#e3dfc7', roof: '#168e99', accent: '#b6fcff', horizon: '#b4e2e6', zenith: '#337cae' },
  HEAVEN_REALM,
];
