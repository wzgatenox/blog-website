"use client"

import { useState, useRef, useEffect } from "react"
import { blogPosts } from "@/data/blog-posts"
import Link from "next/link"

export function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Array<[string, typeof blogPosts[keyof typeof blogPosts]]>>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsOpen(true)
    
    if (query.trim() === "") {
      setResults([])
      return
    }

    const searchResults = Object.entries(blogPosts).filter(([, post]) => {
      const searchableText = `${post.title} ${post.subtitle || ""} ${post.content}`
      return searchableText.toLowerCase().includes(query.toLowerCase())
    })

    setResults(searchResults)
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full h-9 px-4 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 max-h-[60vh] overflow-y-auto z-50">
          {results.map(([slug, post]) => (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="block p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <h3 className="font-medium">{post.title}</h3>
              {post.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {post.subtitle}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 