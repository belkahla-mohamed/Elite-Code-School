import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elite Code School — Robotique, Coding & IA",
  description:
    "École de robotique, programmation et intelligence artificielle pour enfants de 7 à 17 ans à Marrakech."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
