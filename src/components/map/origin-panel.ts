import type { Origin } from "./drones";

let shown: Origin | null = null;
const listeners = new Set<(origin: Origin | null) => void>();

function emit() {
  for (const listener of listeners) listener(shown);
}

export function showOrigin(origin: Origin) {
  shown = origin;
  emit();
}

export function hideOrigin() {
  if (!shown) return;
  shown = null;
  emit();
}

export function subscribeOrigin(listener: (origin: Origin | null) => void) {
  listener(shown);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
