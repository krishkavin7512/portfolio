import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Mona_Sans, Mr_Dafoe } from "next/font/google";

import { Cursor } from "@/components/Cursor";
import { Header } from "@/components/Header";
import { Preloader } from "@/components/Preloader";
import { TransitionProvider } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/data/site";

import "./globals.css";

const mona = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const dafoe = Mr_Dafoe({
  variable: "--font-dafoe",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  keywords: [
    "Kavin Krish",
    "Kavin Krish Vijay",
    "machine learning engineer",
    "full-stack developer",
    "SRM IST",
    "Chennai",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#eeeae1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${mona.variable} ${instrument.variable} ${mono.variable} ${dafoe.variable} antialiased`}
    >
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-blue px-4 py-2 font-mono text-xs uppercase tracking-widest text-white focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <TransitionProvider>
            <Header />
            {children}
            <Preloader />
            <Cursor />
          </TransitionProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
