export type DroneRoster = {
  id: string;
  name: string;
};

let roster: DroneRoster[] = [];
const listeners = new Set<(roster: DroneRoster[]) => void>();

export function publishRoster(next: DroneRoster[]) {
  if (
    roster.length === next.length &&
    roster.every(
      (drone, index) =>
        drone.id === next[index].id && drone.name === next[index].name,
    )
  ) {
    return;
  }
  roster = next;
  for (const listener of listeners) listener(roster);
}

export function subscribeRoster(listener: (roster: DroneRoster[]) => void) {
  listener(roster);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
