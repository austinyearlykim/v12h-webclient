export type Telemetry = {
  id: string;
  longitude: number;
  latitude: number;
  heading: number;
};

export type Drone = Telemetry & {
  path: [number, number][]; // recent positions, oldest first
};

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

const PATH_LENGTH = 160; // about 8 seconds of 50ms updates

const drones: Drone[] = [];

export function getDrones(): Drone[] {
  return drones;
}

export function applyTelemetry(drones: Drone[], samples: Telemetry[]) {
  const byId = new Map(drones.map((drone) => [drone.id, drone]));

  for (const sample of samples) {
    const position: [number, number] = [sample.longitude, sample.latitude];
    const drone = byId.get(sample.id);
    if (!drone) {
      const created: Drone = { ...sample, path: [position] };
      drones.push(created);
      byId.set(sample.id, created);
      continue;
    }
    drone.longitude = sample.longitude;
    drone.latitude = sample.latitude;
    drone.heading = sample.heading;
    drone.path.push(position);
    if (drone.path.length > PATH_LENGTH) drone.path.shift();
  }
}
