"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { publishRoster } from "./roster";
import { selectDrone, subscribeSelection } from "./selection";

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

type Fix = {
  id: string;
  longitude: number;
  latitude: number;
  heading: number;
  time: number;
};

// Shortest turn from one heading to the next, in degrees.
function mixHeading(from: number, to: number, t: number) {
  const turn = ((((to - from) % 360) + 540) % 360) - 180;
  return from + turn * t;
}

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

if (!API_HOST) {
  throw new Error("NEXT_PUBLIC_API_HOST is not set");
}

const ORANGE: [number, number, number] = [255, 176, 32];
const ICON_SIZE = 48;

function droneAtClick(
  x: number,
  y: number,
  project: (lngLat: [number, number]) => [number, number],
  followed: Fix | null,
) {
  const hitRadius = ICON_SIZE / 2;
  let closest: Drone | null = null;
  let closestDistance = hitRadius * hitRadius;
  for (const drone of getDrones()) {
    const position: [number, number] =
      followed && drone.id === followed.id
        ? [followed.longitude, followed.latitude]
        : [drone.longitude, drone.latitude];
    const [droneX, droneY] = project(position);
    const dx = droneX - x;
    const dy = droneY - y;
    const distance = dx * dx + dy * dy;
    if (distance <= closestDistance) {
      closest = drone;
      closestDistance = distance;
    }
  }
  return closest;
}

function droneLayers(drones: Drone[], frame: number, followed: Fix | null) {
  const place = (drone: Drone) =>
    followed && drone.id === followed.id
      ? [followed.longitude, followed.latitude]
      : [drone.longitude, drone.latitude];
  const heading = (drone: Drone) =>
    followed && drone.id === followed.id ? followed.heading : drone.heading;

  return [
    new PathLayer<Drone>({
      id: "paths",
      data: drones,
      getPath: (drone) => drone.path,
      getColor: [...ORANGE, 160],
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
      getPosition: (drone) => place(drone),
      getAngle: (drone) => -heading(drone),
      getIcon: () => droneIcon,
      getSize: ICON_SIZE,
      getColor: ORANGE,
      sizeUnits: "pixels",
      updateTriggers: {
        getPosition: frame,
        getAngle: frame,
        getIcon: drones.length,
      },
    }),
  ];
}

export default function MapCanvas() {
  const deckRef = useRef<DeckGLRef>(null);
  const dronesRef = useRef(getDrones());
  const selectedRef = useRef<string | null>(null);
  const interactingRef = useRef(false);
  const shownRef = useRef<Fix | null>(null);
  // Mutated in place. DeckGL reapplies this object on render, so a render
  // keeps the followed position instead of jumping back to the origin.
  const [camera] = useState(() => ({ ...INITIAL_VIEW_STATE }));

  const layers = useMemo(() => droneLayers(getDrones(), 0, null), []);

  const boundsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // MapLibre flips tiles by a pixel when the width or height is odd and the
  // camera sits on a pixel boundary. An even size never takes that branch.
  useLayoutEffect(() => {
    const bounds = boundsRef.current;
    const map = mapRef.current;
    if (!bounds || !map) return;

    const fit = () => {
      const width = bounds.clientWidth - (bounds.clientWidth % 2);
      const height = bounds.clientHeight - (bounds.clientHeight % 2);
      map.style.width = `${width}px`;
      map.style.height = `${height}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(bounds);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    let fromFix: Fix | null = null;
    let toFix: Fix | null = null;

    const sampleOf = (drone: Drone, time: number): Fix => ({
      id: drone.id,
      longitude: drone.longitude,
      latitude: drone.latitude,
      heading: drone.heading,
      time,
    });

    const note = (drone: Drone) => {
      const sample = sampleOf(drone, performance.now());
      if (!toFix || toFix.id !== drone.id) {
        fromFix = sample;
        toFix = sample;
        return;
      }
      fromFix = toFix;
      toFix = sample;
    };

    const at = (now: number): Fix | null => {
      if (!fromFix || !toFix) return null;
      const span = toFix.time - fromFix.time;
      const t = span > 0 ? Math.min(1, (now - toFix.time) / span) : 1;
      return {
        id: toFix.id,
        longitude: fromFix.longitude + (toFix.longitude - fromFix.longitude) * t,
        latitude: fromFix.latitude + (toFix.latitude - fromFix.latitude) * t,
        heading: mixHeading(fromFix.heading, toFix.heading, t),
        time: now,
      };
    };

    const draw = (followed: Fix | null) => {
      const deck = deckRef.current?.deck;
      if (!deck) return;
      frame += 1;
      shownRef.current = followed;
      const props: { layers: ReturnType<typeof droneLayers>; initialViewState?: object } = {
        layers: droneLayers(dronesRef.current, frame, followed),
      };
      if (followed && !interactingRef.current) {
        props.initialViewState = {
          longitude: followed.longitude,
          latitude: followed.latitude,
          zoom: camera.zoom,
          pitch: camera.pitch,
          bearing: camera.bearing,
        };
      }
      deck.setProps(props);
      if (followed && !interactingRef.current) {
        camera.longitude = followed.longitude;
        camera.latitude = followed.latitude;
      }
    };

    let raf = 0;
    const tick = (now: number) => {
      if (selectedRef.current && !interactingRef.current) draw(at(now));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const socket = io(API_HOST);

    const onTelemetry = (samples: Telemetry[]) => {
      applyTelemetry(dronesRef.current, samples);
      publishRoster(
        dronesRef.current.map((drone) => ({
          id: drone.id,
          name: drone.name,
        })),
      );
      const selected = dronesRef.current.find((drone) => drone.id === selectedRef.current);
      if (selected) note(selected);
      else draw(null);
    };

    const unsubscribe = subscribeSelection((id) => {
      selectedRef.current = id;
      interactingRef.current = false;
      fromFix = null;
      toFix = null;
      const selected = dronesRef.current.find((drone) => drone.id === id);
      if (selected) {
        note(selected);
        draw(at(performance.now()));
      } else {
        draw(null);
      }
    });

    const releaseDrag = () => {
      interactingRef.current = false;
    };
    window.addEventListener("pointerup", releaseDrag);
    window.addEventListener("pointercancel", releaseDrag);

    socket.on("telemetry", onTelemetry);
    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener("pointerup", releaseDrag);
      window.removeEventListener("pointercancel", releaseDrag);
      socket.off("telemetry", onTelemetry);
      socket.close();
      publishRoster([]);
    };
  }, [camera]);

  return (
    <div ref={boundsRef} className="absolute inset-0">
      <div ref={mapRef} className="absolute top-0 left-0 h-full w-full">
        <DeckGL
          ref={deckRef}
          initialViewState={camera}
          controller
          layers={layers}
          onClick={(info) => {
            const deck = deckRef.current?.deck;
            if (!deck || info.x == null || info.y == null) return;
            let viewport;
            try {
              viewport = deck.getViewports()[0];
            } catch {
              return;
            }
            if (!viewport) return;
            const drone = droneAtClick(info.x, info.y, viewport.project.bind(viewport), shownRef.current);
            selectDrone(drone ? drone.id : null);
          }}
          onInteractionStateChange={(state) => {
            interactingRef.current = Boolean(state.isDragging);
          }}
          onViewStateChange={({ viewState }) => {
            const zoom = Math.round(viewState.zoom);
            camera.zoom = zoom;
            camera.pitch = viewState.pitch ?? 0;
            camera.bearing = viewState.bearing ?? 0;
            if (!selectedRef.current || interactingRef.current) {
              camera.longitude = viewState.longitude;
              camera.latitude = viewState.latitude;
            }
            if (zoom !== viewState.zoom) return { ...viewState, zoom };
          }}
        >
          <Map mapStyle={MAP_STYLE} />
        </DeckGL>
      </div>
    </div>
  );
}
