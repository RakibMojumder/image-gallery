import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Image Gallery App",
  description: "A Pinterest-like image gallery application",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider>
            <CssBaseline />
            <div>
              <Navbar />
              <main className="mt-20 min-h-[calc(100vh_-_90px)]">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}