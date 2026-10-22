"use client";

import { useEffect, useState } from "react";
import { subscribeRoster, type DroneRoster } from "@/components/map/roster";
import { selectDrone, subscribeSelection } from "@/components/map/selection";

export function Footer() {
  const [open, setOpen] = useState(false);
  const [roster, setRoster] = useState<DroneRoster[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => subscribeRoster(setRoster), []);
  useEffect(
    () =>
      subscribeSelection((id) => {
        setSelectedId(id);
        if (id) setOpen(true);
      }),
    [],
  );

  return (
    <footer className="relative flex shrink-0 items-center border-t border-neutral-800 px-4 py-1.75 text-sm">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`rounded border px-2 py-0.5 font-medium tracking-wide ${
          open
            ? "border-neutral-500 bg-neutral-800"
            : "border-neutral-700 bg-neutral-900 hover:border-neutral-500 hover:bg-neutral-800"
        }`}
      >
        Drones
        <span aria-hidden="true" className="ml-2 text-neutral-400">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <ul className="absolute bottom-full left-4 w-52 border border-neutral-800 bg-neutral-950">
          {roster.length === 0 ? (
            <li className="px-3 py-2 text-neutral-500">No drones</li>
          ) : (
            roster.map((drone) => (
              <li key={drone.id} className="border-b border-neutral-900 last:border-b-0">
                <button
                  type="button"
                  aria-pressed={selectedId === drone.id}
                  onClick={() => selectDrone(drone.id)}
                  className={`flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-neutral-900 ${
                    selectedId === drone.id ? "bg-neutral-900 outline outline-1 outline-white" : ""
                  }`}
                >
                  <span>{drone.name}</span>
                  <span className="text-neutral-500 tabular-nums">{drone.id}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </footer>
  );
}
