"use client";

import DeckGL from "@deck.gl/react";
import { setWorkerUrl } from "maplibre-gl";
import { Map } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

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
  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller>
      <Map mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}
