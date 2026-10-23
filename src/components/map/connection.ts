export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected";

export type Connection = {
  status: ConnectionStatus;
  ping: number | null;
};

let connection: Connection = { status: "connecting", ping: null };
const listeners = new Set<(connection: Connection) => void>();

export function publishConnection(next: Connection) {
  if (connection.status === next.status && connection.ping === next.ping) return;
  connection = next;
  for (const listener of listeners) listener(connection);
}

export function subscribeConnection(listener: (connection: Connection) => void) {
  listener(connection);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
