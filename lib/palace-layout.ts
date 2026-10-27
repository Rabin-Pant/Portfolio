// Local palace coordinates: the entrance faces +Z and the throne faces it at -Z.
// Shared dimensions keep the camera above the floor and inside the open portals.
export const PALACE_LAYOUT = {
  floor: 7.4,
  eyeHeight: 12.2,
  doorwayWidth: 8.8,
  doorwayShoulder: 7,
  doorwayPeak: 10.6,
  entranceZ: 32,
  throneZ: -16,
} as const;
