import type { Metadata } from "next";
import "./globals.css";
import { ThemeProviderComp } from "@/provider/ThemeProvider";

export const metadata: Metadata = {
  title: "Excalidraw Clone",
  description: "Enjoy with your friends, and try to break it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <ThemeProviderComp>
        <body>{children}</body>
      </ThemeProviderComp>
    </html>
  );
}
