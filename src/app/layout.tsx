import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { StarryBackground } from "@/components/StarryBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dreams Blog",
  description: "Exploring the mysteries of dreams and consciousness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <StarryBackground />
          <div className="relative min-h-screen">
            <Nav />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
