"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { subscribeSelection } from "./selection";

const MapCanvas = dynamic(() => import("./map-canvas"), { ssr: false });

export function MapView() {
  return (
    <div className="absolute inset-0">
      <MapCanvas />
      <CenterMark />
      <FrameRate />
    </div>
  );
}

function FrameRate() {
  const [fps, setFps] = useState<number | null>(null);

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
    <div className="pointer-events-none absolute top-3 right-4 z-10 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-sm tabular-nums">
      {fps ?? "–"} fps
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
