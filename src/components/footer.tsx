"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { subscribeRoster, type DroneRoster } from "@/components/map/roster";
import { FLEET_SIZES, setFleetSize, subscribeFleetSize, type FleetSize } from "@/components/map/fleet";
import { selectDrone, subscribeSelection } from "@/components/map/selection";

const STATUS_TONE: Record<DroneRoster["status"], { pill: string; bar: string }> = {
  Patrolling: { pill: "bg-emerald-400/15 text-emerald-300", bar: "bg-emerald-400" },
  RTB: { pill: "bg-amber-400/15 text-amber-300", bar: "bg-amber-400" },
  Charging: { pill: "bg-sky-400/15 text-sky-300", bar: "bg-sky-400" },
};

export function Footer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname === "/");
  const [roster, setRoster] = useState<DroneRoster[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fleetSize, setFleetSizeState] = useState<FleetSize>(5);
  const [countOpen, setCountOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setOpen(pathname === "/");
  }, [pathname]);

  useEffect(() => subscribeRoster(setRoster), []);
  useEffect(() => subscribeFleetSize(setFleetSizeState), []);
  useEffect(
    () =>
      subscribeSelection((id) => {
        setSelectedId(id);
        if (id) setOpen(true);
      }),
    [],
  );

  const normalized = query.trim().toLowerCase();
  const shown = normalized
    ? roster.filter(
        (drone) =>
          drone.name.toLowerCase().includes(normalized) || drone.id.includes(normalized),
      )
    : roster;

  return (
    <footer className="relative flex shrink-0 items-center gap-2 border-t border-neutral-800 px-4 py-1.75 text-sm">
      {open && (
        <div className="absolute right-4 bottom-full left-4 z-10 mb-2 flex flex-col gap-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Drone name or id"
            aria-label="Search drones by name or id"
            autoComplete="off"
            className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 shadow-xl shadow-black/40 outline-none placeholder:text-neutral-500 focus:border-neutral-500"
          />
          <ul className="grid max-h-[12.5rem] grid-cols-5 gap-2 overflow-x-hidden overflow-y-auto overscroll-contain rounded-md border border-neutral-800 bg-neutral-950 p-2 shadow-xl shadow-black/40">
            {shown.length === 0 ? (
              <li className="col-span-5 px-3 py-2 text-neutral-500">
                {roster.length === 0 ? "No drones" : "No matches"}
              </li>
            ) : (
              shown.map((drone) => {
                const tone = STATUS_TONE[drone.status];
                const selected = selectedId === drone.id;
                return (
                  <li key={drone.id} className="h-14 min-w-0">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectDrone(drone.id)}
                      className={`grid h-full w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-md bg-neutral-900 px-3 text-left hover:bg-neutral-800 ${
                        selected ? "ring-1 ring-white ring-inset" : ""
                      }`}
                    >
                      <span className="truncate font-medium tracking-wide">{drone.name}</span>
                      <span
                        className={`justify-self-end rounded-full px-1.5 py-px text-xs font-medium tracking-wide ${tone.pill}`}
                      >
                        {drone.status}
                      </span>
                      <span className="text-xs text-neutral-500 tabular-nums">{drone.id}</span>
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-14 overflow-hidden rounded-full bg-neutral-800" aria-hidden="true">
                          <span className={`block h-full rounded-full ${tone.bar}`} style={{ width: `${drone.battery}%` }} />
                        </span>
                        <span className="w-9 text-right text-xs text-neutral-300 tabular-nums">{drone.battery}%</span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            setOpen((value) => !value);
            setCountOpen(false);
          }}
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
      </div>
      <div className="relative">
        <button
          type="button"
          aria-expanded={countOpen}
          aria-label="Drone count"
          onClick={() => {
            setCountOpen((value) => {
              const next = !value;
              if (next) setOpen(false);
              else if (pathname === "/") setOpen(true);
              return next;
            });
          }}
          className={`rounded border px-2 py-0.5 font-medium tabular-nums tracking-wide ${
            countOpen
              ? "border-neutral-500 bg-neutral-800"
              : "border-neutral-700 bg-neutral-900 hover:border-neutral-500 hover:bg-neutral-800"
          }`}
        >
          {fleetSize}
          <span aria-hidden="true" className="ml-2 text-neutral-400">
            {countOpen ? "▾" : "▸"}
          </span>
        </button>
        {countOpen && (
          <ul className="absolute bottom-full left-0 z-10 mb-2 min-w-full overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 shadow-xl shadow-black/40">
            {FLEET_SIZES.map((size) => (
              <li key={size} className="border-b border-neutral-800/80 last:border-b-0">
                <button
                  type="button"
                  aria-pressed={size === fleetSize}
                  onClick={() => {
                    setFleetSize(size);
                    setCountOpen(false);
                    if (pathname === "/") setOpen(true);
                  }}
                  className={`w-full px-3 py-2 text-left tabular-nums hover:bg-neutral-900 ${
                    size === fleetSize ? "bg-neutral-900 ring-1 ring-white ring-inset" : ""
                  }`}
                >
                  {size}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
