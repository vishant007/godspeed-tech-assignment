import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Wall Size Calculator",
  description: "Calculate closest cabinet configurations for video walls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
