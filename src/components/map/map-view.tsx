"use client";

import dynamic from "next/dynamic";

const MapCanvas = dynamic(() => import("./map-canvas"), { ssr: false });

export function MapView() {
  return (
    <div className="absolute inset-0">
      <MapCanvas />
    </div>
  );
}
