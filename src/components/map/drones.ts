export type Drone = {
  id: string;
  longitude: number;
  latitude: number;
  heading: number;
};

const CENTER = {
  longitude: -117.918031,
  latitude: 33.693477,
};

const SEEDS = [
  { id: "drone-1", longitude: 0, latitude: 0, heading: 0 },
  { id: "drone-2", longitude: 0.03, latitude: 0.02, heading: 45 },
  { id: "drone-3", longitude: -0.025, latitude: 0.03, heading: 120 },
  { id: "drone-4", longitude: 0.02, latitude: -0.03, heading: 200 },
  { id: "drone-5", longitude: -0.03, latitude: -0.02, heading: 300 },
];

const DRONE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <path fill="white" d="M32 8 L52 52 L32 40 L12 52 Z"/>
</svg>`;

export const droneIcon = {
  id: "drone",
  url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRONE_SVG)}`,
  width: 64,
  height: 64,
  anchorX: 32,
  anchorY: 32,
  mask: true,
};

export function createDrones(): Drone[] {
  return SEEDS.map((seed) => ({
    id: seed.id,
    longitude: CENTER.longitude + seed.longitude,
    latitude: CENTER.latitude + seed.latitude,
    heading: seed.heading,
  }));
}

let droneList: Drone[] | undefined;

export function getDrones(): Drone[] {
  droneList ??= createDrones();
  return droneList;
}
