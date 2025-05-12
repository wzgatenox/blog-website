"use client"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu } from "lucide-react"
import { usePathname } from 'next/navigation'

export function Nav() {
  const pathname = usePathname()
  const isBlogPage = pathname?.startsWith('/blog/')

  const handleTocHamburgerClick = () => {
    document.dispatchEvent(new CustomEvent('openBlogPostToc'))
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-14 px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold inline-block gradient-text text-lg md:text-xl">
              Dreams Blog
            </span>
          </Link>

        {/* Wrapper for all right-side elements */}
        <div className="flex items-center space-x-4">
          {/* Blog link - always visible */}
            <Link
              href="/blog/what-if-your-dreams-are-lying"
            className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
            >
              Blog
            </Link>

          <ThemeToggle />

          {/* Conditional ToC Hamburger for blog pages */}
          {isBlogPage && (
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Open Table of Contents"
              onClick={handleTocHamburgerClick}
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
} 