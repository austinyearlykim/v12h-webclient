"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { subscribeConnection, type Connection, type ConnectionStatus } from "./connection";
import type { Origin } from "./drones";
import { hideOrigin, subscribeOrigin } from "./origin-panel";
import { subscribeSelection } from "./selection";

const MapCanvas = dynamic(() => import("./map-canvas"), { ssr: false });

export function MapView() {
  return (
    <div className="absolute inset-0">
      <MapCanvas />
      <CenterMark />
      <FrameRate />
      <OriginModal />
    </div>
  );
}

const CONNECTION_DOT: Record<ConnectionStatus, string> = {
  connecting: "bg-neutral-500",
  connected: "bg-emerald-400",
  reconnecting: "bg-amber-400",
  disconnected: "bg-red-400",
};

function FrameRate() {
  const [fps, setFps] = useState<number | null>(null);
  const [connection, setConnection] = useState<Connection>({ status: "connecting", ping: null });

  useEffect(() => subscribeConnection(setConnection), []);

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let frame = requestAnimationFrame(tick);

    function tick(now: number) {
      frames += 1;
      const elapsed = now - last;
      if (elapsed >= 500) {
        setFps(Math.round((frames * 1000) / elapsed));
        frames = 0;
        last = now;
      }
      frame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none absolute top-3 right-4 z-10 flex items-center gap-2 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-sm tabular-nums">
      <span>{fps ?? "–"} fps</span>
      <span className="text-neutral-600" aria-hidden="true">
        ·
      </span>
      <span>{connection.ping == null ? "–" : connection.ping} ms</span>
      <span className="text-neutral-600" aria-hidden="true">
        ·
      </span>
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className={`size-1.5 rounded-full ${CONNECTION_DOT[connection.status]}`} />
        {connection.status}
      </span>
    </div>
  );
}

function OriginModal() {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => subscribeOrigin(setOrigin), []);

  useEffect(() => {
    if (!origin) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") hideOrigin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [origin]);

  if (!origin) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close origin details"
        className="absolute inset-0 bg-black/60"
        onClick={hideOrigin}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="origin-title"
        className="relative w-full max-w-sm rounded-md border border-neutral-800 bg-neutral-950 p-4 shadow-xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs tracking-wide text-neutral-500">
              <span aria-hidden="true" className="size-2 rounded-full bg-blue-600" />
              Origin
            </p>
            <h2 id="origin-title" className="mt-1 text-base font-medium tracking-wide">
              {origin.name}
            </h2>
            <p className="text-sm text-neutral-400">{origin.place}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={hideOrigin}
            className="rounded border border-neutral-700 px-2 py-0.5 text-sm text-neutral-300 hover:bg-neutral-900"
          >
            Close
          </button>
        </div>
        <p className="mt-4 text-sm text-neutral-300">Drones return to this point to charge.</p>
        <p className="mt-3 text-xs text-neutral-500 tabular-nums">
          {origin.latitude.toFixed(6)}, {origin.longitude.toFixed(6)}
        </p>
      </div>
    </div>
  );
}

function CenterMark() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => subscribeSelection(setSelectedId), []);

  if (!selectedId) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 size-16 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-white" />
      <span className="absolute top-0 right-0 size-3 border-t-2 border-r-2 border-white" />
      <span className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-white" />
      <span className="absolute right-0 bottom-0 size-3 border-r-2 border-b-2 border-white" />
    </div>
  );
}
