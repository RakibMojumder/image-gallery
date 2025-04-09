"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import type { PaletteMode } from "@mui/material"
import { createAppTheme } from "@/theme/theme"
import { Toaster } from "sonner"

type ThemeContextType = {
  mode: PaletteMode
  toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => { },
})

export const useThemeContext = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme-mode") as PaletteMode | null
      if (savedMode) {
        setMode(savedMode)
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setMode("dark")
      }
      setIsInitialized(true)
    }
  }, [])

  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light"
    setMode(newMode)
    localStorage.setItem("theme-mode", newMode)
  }

  const theme = createAppTheme(mode)

  // Don't render until we've determined the initial mode
  if (!isInitialized) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      <Toaster richColors position="bottom-right" />
    </ThemeContext.Provider>
  )
}