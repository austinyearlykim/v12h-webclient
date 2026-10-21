import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "v12h",
  description: "High-performance dashboard for live drone data",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
