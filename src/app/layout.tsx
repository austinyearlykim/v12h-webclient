import type { Metadata } from "next";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "LatticeWeb",
  description: "High-performance dashboard for live drone data",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex h-screen flex-col bg-neutral-950 text-neutral-100">
        <Header title="LatticeWeb" />
        {children}
      </body>
    </html>
  );
}
