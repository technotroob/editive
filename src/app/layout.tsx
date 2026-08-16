import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "EDITIVE — Professional Web-Based Image Editor",
  description: "Unlock, reconstruct, restyle, and reframe visual designs with a high-craft browser image editor.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
