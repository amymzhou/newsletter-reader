import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amy's Reader",
  description: "Personal newsletter feed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ThemeProvider>
          <header
            className="sticky top-0 z-10 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between"
            style={{
              backgroundColor: "color-mix(in srgb, var(--bg) 85%, transparent)",
              borderColor: "var(--border)",
            }}
          >
            <span className="font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              Amy&apos;s Reader
            </span>
            <ThemeToggle />
          </header>
          <main className="px-4 py-8 mx-auto w-full max-w-2xl">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
