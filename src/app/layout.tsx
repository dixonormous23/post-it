import type { Metadata, Viewport } from "next";
import StyledComponentsRegistry from "@/lib/styled-registry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sticky Notes & Calendar",
  description: "A beautiful sticky notes app with Google Calendar integration",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sticky Notes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
