import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER = "lattice";

function matches(given: string, expected: string) {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return new NextResponse("SITE_PASSWORD is not set", { status: 503 });
  }

  const header = request.headers.get("authorization");
  const encoded = header?.match(/^Basic (.+)$/)?.[1];
  if (encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    const user = separator === -1 ? "" : decoded.slice(0, separator);
    const pass = separator === -1 ? "" : decoded.slice(separator + 1);
    if (matches(user, USER) && matches(pass, password)) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="LatticeWeb", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
