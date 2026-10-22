"use client";

import { useEffect, useMemo, useRef } from "react";
import DeckGL, { type DeckGLRef } from "@deck.gl/react";
import { IconLayer, PathLayer } from "@deck.gl/layers";
import { setWorkerUrl } from "maplibre-gl";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { io } from "socket.io-client";
import {
  applyTelemetry,
  droneIcon,
  getDrones,
  type Drone,
  type Telemetry,
} from "./drones";

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
const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

if (!API_HOST) {
  throw new Error("NEXT_PUBLIC_API_HOST is not set");
}

function droneLayers(drones: Drone[], frame: number) {
  return [
    new PathLayer<Drone>({
      id: "paths",
      data: drones,
      getPath: (drone) => drone.path,
      getColor: [255, 176, 32, 160],
      getWidth: 2,
      widthUnits: "pixels",
      widthMinPixels: 2,
      jointRounded: true,
      capRounded: true,
      billboard: true,
      updateTriggers: { getPath: frame },
    }),
    new IconLayer<Drone>({
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
    }),
  ];
}

export default function MapCanvas() {
  const deckRef = useRef<DeckGLRef>(null);
  const dronesRef = useRef(getDrones());

  const layers = useMemo(() => droneLayers(getDrones(), 0), []);

  useEffect(() => {
    let frame = 0;
    const socket = io(API_HOST);

    const onTelemetry = (samples: Telemetry[]) => {
      applyTelemetry(dronesRef.current, samples);
      frame += 1;
      deckRef.current?.deck?.setProps({
        layers: droneLayers(dronesRef.current, frame),
      });
    };

    socket.on("telemetry", onTelemetry);
    return () => {
      socket.off("telemetry", onTelemetry);
      socket.close();
    };
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
