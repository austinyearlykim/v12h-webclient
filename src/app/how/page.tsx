export default function How() {
  return <main className="min-h-0 flex-1">
    <h1 className="text-2xl font-medium tracking-tight">Github Repositories</h1>
    <ul className="list-disc list-inside">
      <li>
        <a href="https://github.com/austinyearlykim/latticeweb-webclient" target="_blank" rel="noopener noreferrer">
          austinyearlykim/latticeweb-webclient
        </a>
      </li>
    </ul>
    <ul className="list-disc list-inside">
      <li>
        <a href="https://github.com/austinyearlykim/latticeweb-server" target="_blank" rel="noopener noreferrer">
          austinyearlykim/latticeweb-server
        </a>
      </li>
    </ul>
    <h1 className="text-2xl font-medium tracking-tight">How was this made?</h1>
    <p className="text-sm text-neutral-500">
      Next.js webclient that displays the telemetry data in a dashboard.
    </p>
    <p className="text-sm text-neutral-500">
      Node.js server with a Telemetry service that provides live (faked) drone telemetry data.
    </p>
    <h1 className="text-2xl font-medium tracking-tight">Tech Stack</h1>
    <ul className="list-disc list-inside">
      <li>Webclient: Next/React</li>
      <li>CSS: Tailwind</li>
      <li>Data Visualization: Deck.gl</li>
      <li>Server: Node.js</li>
      <li>Realtime Communication: Websockets via Socket.io</li>
    </ul>
  </main>
}
