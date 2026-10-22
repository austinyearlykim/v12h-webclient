"use client";

import { useEffect, useMemo, useRef } from "react";
import DeckGL, { type DeckGLRef } from "@deck.gl/react";
import { IconLayer } from "@deck.gl/layers";
import { setWorkerUrl } from "maplibre-gl";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { droneIcon, getDrones, stepDrones, type Drone } from "./drones";

// Turbopack rewrites MapLibre's default worker path. Point at the real bundle.
const workerUrl = new URL(
  "../../../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
  import.meta.url,
);
setWorkerUrl(workerUrl.href);

const INITIAL_VIEW_STATE = {
  longitude: -117.918031,
  latitude: 33.693477,
  zoom: 11,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

function droneLayer(drones: Drone[], frame: number) {
  return new IconLayer<Drone>({
    id: "drones",
    data: drones,
    getPosition: (drone) => [drone.longitude, drone.latitude],
        getAngle: (drone) => -drone.heading,
    getIcon: () => droneIcon,
    getSize: 48,
    getColor: [255, 176, 32],
    sizeUnits: "pixels",
    updateTriggers: {
      getPosition: frame,
      getAngle: frame,
    },
  });
}

export default function MapCanvas() {
  const deckRef = useRef<DeckGLRef>(null);
  const dronesRef = useRef(getDrones());

  const layers = useMemo(() => [droneLayer(getDrones(), 0)], []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      stepDrones(dronesRef.current, dt);
      frame += 1;
      deckRef.current?.deck?.setProps({
        layers: [droneLayer(dronesRef.current, frame)],
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <DeckGL
      ref={deckRef}
      initialViewState={INITIAL_VIEW_STATE}
      controller
      layers={layers}
    >
      <Map mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}
