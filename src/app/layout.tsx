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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          {/* Background Elements - Rendered First */}
          <div className="fixed inset-0 z-0"> {/* Container for backgrounds at z-0 */}
             <StarryBackground />
          </div>
          
          {/* Main Content Wrapper - Use flex-grow to push footer down */}
          <div className="relative z-10 bg-transparent flex-grow">
            <Nav />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>

          {/* Simple Footer */}
          <footer className="py-6 md:px-8 md:py-0 border-t bg-background/80">
            <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row md:justify-between">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {new Date().getFullYear()} Maia Zatorska. All rights reserved.
              </p>
              <a 
                href="https://www.linkedin.com/in/maia-zatorska-7832392b8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Maia Zatorska LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </footer>

        </ThemeProvider>
      </body>
    </html>
  );
}
