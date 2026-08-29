import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { AppHeader } from "@/components/layout/app-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Architect",
  description: "Turn a project idea into a complete technical plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="container flex-1 py-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
