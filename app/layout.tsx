import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Code",
  description: "AI project dashboard for managers and developers"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
