"use client"

import * as React from "react"
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: "class" | "data-theme"
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      {...props}
    >
      <Theme>{children}</Theme>
    </NextThemesProvider>
  )
}

function Theme({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    return (
        <body data-theme={resolvedTheme ?? 'dark'}>{children}</body>
    );
}