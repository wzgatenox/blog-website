import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="container flex flex-col gap-2 md:flex-row md:h-12 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:mr-4">
          <Link href="/" className="mb-2 md:mb-0 md:mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block gradient-text text-lg md:text-xl">
              Dreams Blog
            </span>
          </Link>
          <nav className="flex flex-col gap-2 md:flex-row md:gap-6 items-start md:items-center text-sm font-medium">
            <Link
              href="/blog/what-if-your-dreams-are-lying"
              className="transition-colors hover:text-foreground/80 text-foreground/60 py-2 md:py-0"
            >
              Blog
            </Link>
            {/* Removed About link */}
            {/* <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link> */}
          </nav>
        </div>
        <div className="flex items-center space-x-2 justify-end">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
} 