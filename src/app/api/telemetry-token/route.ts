import { connection } from "next/server";

export async function GET() {
  await connection();
  const token = process.env.TELEMETRY_TOKEN ?? null;
  return Response.json({ token });
}
