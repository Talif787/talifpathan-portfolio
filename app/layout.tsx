import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { profile, education } from "@/content";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

/**
 * Space Grotesk carries the page: geometric enough to read as engineered,
 * idiosyncratic enough not to read as a default. IBM Plex Mono is reserved for
 * strings that are genuinely technical, never used as a generic label style.
 * Both are self-hosted by next/font, so there is no render-blocking request to
 * a font CDN and no layout shift on swap.
 */
const sans = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description = `${profile.role} working on real-time collaboration, distributed systems and AWS cloud engineering. Nearly four years at Capgemini, currently completing an MS in Computer Science at Northeastern University.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name}, ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "software engineer",
    "real-time systems",
    "distributed systems",
    "AWS",
    "Next.js",
    "Boston",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: `${profile.name}, ${profile.role}`,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name}, ${profile.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0c141f",
  colorScheme: "dark",
};

/** Structured data. Every field is drawn from the content layer. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description,
  email: `mailto:${profile.emails.personal}`,
  url: siteUrl,
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  sameAs: profile.socials
    .filter((social) => social.icon !== "mail")
    .map((social) => social.href),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <ScrollProgress />
        <SiteHeader />
        <div id="scroll-sentinel" aria-hidden className="absolute top-0 h-px w-px" />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // Serialised from a local object literal, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
