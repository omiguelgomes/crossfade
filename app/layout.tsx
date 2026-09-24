import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crossfade-seven.vercel.app"),
  title: "Crossfade: the daily song-chain music puzzle",
  description:
    "Connect two artists by writing songs. Each track is a real collaboration that carries you to the next artist. A new puzzle every day, or build your own to send a friend.",
  applicationName: "Crossfade",
  keywords: ["music game", "daily puzzle", "wordle", "artists", "collaborations", "songs"],
  openGraph: {
    title: "Crossfade",
    description:
      "Connect two artists by writing songs. A new music puzzle every day.",
    type: "website",
    siteName: "Crossfade",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crossfade: the daily song-chain music puzzle",
    description: "Connect two artists by writing songs. A new music puzzle every day.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Apply the stored theme before paint. Dark is the default, so only the
            opt-in light theme needs an attribute — no flash on load. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('crossfade:theme')==='light'){document.documentElement.dataset.theme='light'}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
