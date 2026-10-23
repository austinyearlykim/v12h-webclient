export const FLEET_SIZES = [5, 10, 100, 1000] as const;

export type FleetSize = (typeof FLEET_SIZES)[number];

let fleetSize: FleetSize = 5;
const listeners = new Set<(size: FleetSize) => void>();

export function getFleetSize() {
  return fleetSize;
}

export function setFleetSize(size: FleetSize) {
  if (size === fleetSize) return;
  fleetSize = size;
  for (const listener of listeners) listener(fleetSize);
}

export function subscribeFleetSize(listener: (size: FleetSize) => void) {
  listener(fleetSize);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
