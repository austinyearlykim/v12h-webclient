const statuses = [
  {
    name: "Patrolling",
    className: "bg-emerald-400/15 text-emerald-300",
    explanation:
      "The drone is flying its route, drawn as an arrow with a path. It takes off to patrol again after charging.",
  },
  {
    name: "RTB",
    className: "bg-amber-400/15 text-amber-300",
    explanation:
      "Return to Base. The drone heads back to the origin when its battery reaches 60%.",
  },
  {
    name: "Charging",
    className: "bg-sky-400/15 text-sky-300",
    explanation:
      "At Anduril HQ in Costa Mesa, the battery charges to 100% in 3 seconds, then the drone takes off to patrol again.",
  },
] as const;

const repositories = [
  {
    href: "https://github.com/austinyearlykim/v12h-webclient",
    name: "austinyearlykim/v12h-webclient",
    description:
      "LatticeWeb webclient that displays the telemetry data in a dashboard. Built with Next.js and Tailwind CSS.",
  },
  {
    href: "https://github.com/austinyearlykim/v12h-server",
    name: "austinyearlykim/latticeweb-server",
    description:
      "LatticeWeb server with a Telemetry service that provides live (faked) drone telemetry data. Built with Node.js.",
  },
];

const stack = [
  ["Pages, routing, and the dashboard UI.", "Next/React"],
  ["Telemetry service that streams drone data.", "Node.js"],
  ["Draws the base map: roads and the dark earth.", "maplibre-gl"],
  ["Draws the overlay. Drones and paths are WebGL objects on a transparent canvas sitting above the map.", "Deck.gl"],
  ["Keeps the drone overlay synced with the map camera.", "react-map-gl"],
] as const;

export default function How() {
  return (
    <main className="min-h-0 flex-1 overflow-auto px-4 py-8">
      <div className="mx-auto flex max-w-xl flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium tracking-wide">LatticeWeb</h2>
          <p className="text-sm leading-6 text-neutral-300">
            LatticeWeb is a web application that displays the telemetry data of a fleet of drones.
            It tracks a roster of drones and their current status.
          </p>
          <p className="w-fit max-w-full rounded-md border border-amber-400/40 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 shadow-lg shadow-black/40">
            The drones are not generated on the webclient. LatticeWeb is connected to a server via a websocket connection.
          </p>
          <p className="text-sm leading-6 text-neutral-400">
            The drones are represented as arrows on a map and their paths are drawn as lines.
          </p>
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-500">
              <tr className="border-b border-neutral-800">
                <th className="py-2 pr-6 font-medium">Status</th>
                <th className="py-2 font-medium">What it means</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status) => (
                <tr key={status.name} className="border-b border-neutral-900 align-top">
                  <td className="py-3 pr-6">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap ${status.className}`}
                    >
                      {status.name}
                    </span>
                  </td>
                  <td className="py-3 leading-6 text-neutral-400">{status.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm leading-6 text-neutral-400">
            While a drone is patrolling or returning to base, its battery drains at 1% per second.
          </p>
          <p className="text-sm leading-6 text-neutral-400">
            The drones are selectable and clicking on them will have the camera follow them.
          </p>
          <p className="text-sm leading-6 text-neutral-400">
            Telemetry data is mocked from a server that generates the telemetry data in real-time and
            communicated over a websocket connection.
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-wide">On the map</h2>
          <div className="inline-flex w-fit items-center gap-2 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-sm tabular-nums">
            <span>60 fps</span>
            <span className="text-neutral-600" aria-hidden="true">
              ·
            </span>
            <span>12 ms</span>
            <span className="text-neutral-600" aria-hidden="true">
              ·
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
              connected
            </span>
          </div>
          <ul className="flex flex-col gap-2 text-sm leading-6 text-neutral-400">
            <li>The frames per second is displayed in the top right corner of the map.</li>
            <li>The ping is in the top right corner of the map displayed in milliseconds.</li>
            <li className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                The websocket connection status is displayed in the top right corner of the map as a
                green dot if connected, or a red dot if disconnected.
              </span>
              <span className="inline-flex items-center gap-3 text-neutral-300">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
                  connected
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-red-400" />
                  disconnected
                </span>
              </span>
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-wide">Tech stack</h2>
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-500">
              <tr className="border-b border-neutral-800">
                <th className="py-2 pr-6 font-medium">Technology</th>
                <th className="py-2 font-medium">How It's Used</th>
              </tr>
            </thead>
            <tbody>
              {stack.map(([description, name]) => (
                <tr key={name} className="border-b border-neutral-900 align-top">
                  <td className="py-3 pr-6 font-medium whitespace-nowrap">
                    {name}
                  </td>
                  <td className="py-3 leading-6 text-neutral-400">
                    {description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium tracking-wide">
            GitHub repositories
          </h2>
          <ul className="flex flex-col gap-2">
            {repositories.map((repository) => (
              <li key={repository.href}>
                <a
                  href={repository.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 rounded-md border border-neutral-800 px-4 py-3 hover:border-neutral-600"
                >
                  <span className="text-sm font-medium">{repository.name}</span>
                  <span className="text-sm leading-6 text-neutral-400">
                    {repository.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
