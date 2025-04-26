import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { StarryBackground } from "@/components/StarryBackground";
import { Linkedin } from "lucide-react";

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
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <div className="fixed inset-0 z-0">
             <StarryBackground />
          </div>
          
          <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
            <Nav />
            <main className="container mx-auto px-4 py-8 flex-grow">
              {children}
            </main>

            <footer className="py-6 md:px-8 md:py-0 border-t animate-gradient bg-[linear-gradient(90deg,#7C3AED_0%,#EC4899_25%,#3B82F6_50%,#14B8A6_75%,#7C3AED_100%)]">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row md:justify-between">
                <p className="text-center text-sm leading-loose text-white md:text-left">
                  © {new Date().getFullYear()} Maia Zatorska. All rights reserved.
                </p>
                <a 
                  href="https://www.linkedin.com/in/maia-zatorska-7832392b8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Maia Zatorska LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
