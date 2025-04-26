import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { StarryBackground } from "@/components/StarryBackground";
import { LightModeBackgroundAccent } from "@/components/LightModeBackgroundAccent";

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
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          {/* Background Elements - Rendered First */}
          <div className="fixed inset-0 z-0"> {/* Container for backgrounds at z-0 */}
             <StarryBackground />
             <LightModeBackgroundAccent />
          </div>
          
          {/* Main Content Wrapper - Relative, z-10 */}
          <div className="relative min-h-screen z-10 bg-transparent">
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
