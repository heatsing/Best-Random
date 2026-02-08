import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { generateWebsiteSchema } from "@/lib/seo"
import { CommandPalette } from "@/components/SearchCommand"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "BestRandom - 44 Free Random Generators | Numbers, Names, Passwords & More",
    template: "%s | BestRandom",
  },
  description: "The #1 free random generator site with 44+ tools. Generate random numbers, names, passwords, colors, teams, movies & more. Instant results, shareable links. 100% free!",
  keywords: ["random generator", "random number generator", "random name generator", "random password generator", "random color generator", "random picker", "random team generator", "wheel of names", "dice roller", "coin flip", "online random tools", "free random generator"],
  authors: [{ name: "BestRandom" }],
  creator: "BestRandom",
  icons: {
    icon: [
      { url: "/favicon-v2.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon-v2.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest-v2.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bestrandom.net",
    siteName: "BestRandom",
    title: "BestRandom - 44 Free Random Generators | Numbers, Names, Passwords & More",
    description: "The #1 free random generator site with 44+ tools. Generate random numbers, names, passwords, colors, teams, movies & more. Instant results, shareable links. 100% free!",
    images: [
      {
        url: "https://bestrandom.net/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "BestRandom - 44 Free Random Generators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BestRandom - 44 Free Random Generators | Numbers, Names, Passwords & More",
    description: "The #1 free random generator site with 44+ tools. Generate random numbers, names, passwords, colors, teams, movies & more. Instant results, shareable links. 100% free!",
    images: ["https://bestrandom.net/og-image-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
          <CommandPalette />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
