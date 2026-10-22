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
