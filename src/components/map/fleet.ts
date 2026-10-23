export const FLEET_SIZES = [5, 10, 100, 1000] as const;

export type FleetSize = (typeof FLEET_SIZES)[number];

let fleetSize: FleetSize = 5;
let hold = 0;
const watchers = new Set<(size: FleetSize) => void>();
const intents = new Set<(size: FleetSize) => void>();

export function isFleetSize(size: number): size is FleetSize {
  return (FLEET_SIZES as readonly number[]).includes(size);
}

export function getFleetSize() {
  return fleetSize;
}

function publish(size: FleetSize) {
  if (size === fleetSize) return;
  fleetSize = size;
  for (const watcher of watchers) watcher(fleetSize);
}

export function setFleetSize(size: FleetSize) {
  hold = 4;
  publish(size);
  for (const intent of intents) intent(size);
}

export function noteFleetSize(size: FleetSize) {
  if (size === fleetSize) {
    hold = 0;
    return;
  }
  if (hold > 0) {
    hold -= 1;
    return;
  }
  publish(size);
}

export function subscribeFleetSize(listener: (size: FleetSize) => void) {
  listener(fleetSize);
  watchers.add(listener);
  return () => {
    watchers.delete(listener);
  };
}

export function subscribeFleetIntent(listener: (size: FleetSize) => void) {
  intents.add(listener);
  return () => {
    intents.delete(listener);
  };
}
