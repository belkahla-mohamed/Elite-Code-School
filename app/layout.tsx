import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { template: "%s — Elite Code School", default: "Elite Code School — Robotique, Coding & IA" },
  description: "École de robotique, programmation et intelligence artificielle pour enfants de 7 à 17 ans à Marrakech.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body text-ink bg-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
