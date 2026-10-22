export type Drone = {
  id: string;
  longitude: number;
  latitude: number;
  heading: number;
  turn: 1 | -1; // +1 right, -1 left
  turnFor: number; // seconds until the turn reverses
};

const CENTER = {
  longitude: -117.918031,
  latitude: 33.693477,
};

const SEEDS = [
  { id: "drone-1", longitude: 0, latitude: 0, heading: 0, turn: 1, turnFor: 5 },
  { id: "drone-2", longitude: 0.03, latitude: 0.02, heading: 45, turn: -1, turnFor: 2 },
  { id: "drone-3", longitude: -0.025, latitude: 0.03, heading: 120, turn: 1, turnFor: 4 },
  { id: "drone-4", longitude: 0.02, latitude: -0.03, heading: 200, turn: -1, turnFor: 1 },
  { id: "drone-5", longitude: -0.03, latitude: -0.02, heading: 300, turn: 1, turnFor: 3 },
] as const;

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
    turn: seed.turn,
    turnFor: seed.turnFor,
  }));
}

let droneList: Drone[] | undefined;

export function getDrones(): Drone[] {
  droneList ??= createDrones();
  return droneList;
}

const METERS_PER_DEGREE = 111_320;
const SPEED_METERS_PER_SECOND = 500;
const TURN_DEGREES_PER_SECOND = 8;
const TURN_HOLD_SECONDS = 5;

export function stepDrones(drones: Drone[], dtSeconds: number) {
  const meters = SPEED_METERS_PER_SECOND * dtSeconds;
  const turn = TURN_DEGREES_PER_SECOND * dtSeconds;

  for (const drone of drones) {
    const heading = (drone.heading * Math.PI) / 180;
    const latitude = (drone.latitude * Math.PI) / 180;
    drone.latitude += (Math.cos(heading) * meters) / METERS_PER_DEGREE;
    drone.longitude +=
      (Math.sin(heading) * meters) /
      (METERS_PER_DEGREE * Math.cos(latitude));
    drone.heading = (drone.heading + drone.turn * turn + 360) % 360;
    drone.turnFor -= dtSeconds;
    if (drone.turnFor <= 0) {
      drone.turn = drone.turn === 1 ? -1 : 1;
      drone.turnFor += TURN_HOLD_SECONDS;
    }
  }
}
