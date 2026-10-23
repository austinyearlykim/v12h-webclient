"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { subscribeRoster, type DroneRoster } from "@/components/map/roster";
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

  useEffect(() => {
    setOpen(pathname === "/");
  }, [pathname]);

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
        <ul className="absolute bottom-full left-4 mb-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 shadow-xl shadow-black/40">
          {roster.length === 0 ? (
            <li className="px-3 py-2 text-neutral-500">No drones</li>
          ) : (
            roster.map((drone) => {
              const tone = STATUS_TONE[drone.status];
              const selected = selectedId === drone.id;
              return (
                <li key={drone.id} className="border-b border-neutral-800/80 last:border-b-0">
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectDrone(drone.id)}
                    className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-2 text-left hover:bg-neutral-900 ${
                      selected ? "bg-neutral-900 ring-1 ring-white ring-inset" : ""
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
      )}
    </footer>
  );
}
