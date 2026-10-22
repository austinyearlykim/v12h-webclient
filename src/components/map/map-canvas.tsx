"use client";

import { useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { IconLayer } from "@deck.gl/layers";
import { setWorkerUrl } from "maplibre-gl";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { droneIcon, getDrones, type Drone } from "./drones";

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

export default function MapCanvas() {
  // Same array the layer draws. The frame loop will update it in place.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- read by the frame loop
  const dronesRef = useRef(getDrones());

  const layers = useMemo(
    () => [
      new IconLayer<Drone>({
        id: "drones",
        data: getDrones(),
        getPosition: (drone) => [drone.longitude, drone.latitude],
        getAngle: (drone) => drone.heading,
        getIcon: () => droneIcon,
        getSize: 48,
        getColor: [255, 176, 32],
        sizeUnits: "pixels",
      }),
    ],
    [],
  );

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
      <Map mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}
