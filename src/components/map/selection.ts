let selectedId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

export function selectDrone(id: string | null) {
  const next = selectedId === id ? null : id;
  if (next === selectedId) return;
  selectedId = next;
  for (const listener of listeners) listener(selectedId);
}

export function subscribeSelection(listener: (id: string | null) => void) {
  listener(selectedId);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
