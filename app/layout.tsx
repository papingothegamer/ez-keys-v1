import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EZ-Keys — Chord & Transpose Assistant",
  description:
    "A reference, voicing explorer, and transposition assistant for keyboard players who play in C and transpose. Built for gospel, worship, jazz, neo soul, and more.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0c0e12",
}

import { TutorialDialog } from "@/components/tutorial-dialog"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${GeistSans.variable} ${inter.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <TutorialDialog />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
