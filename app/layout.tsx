import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { profile, degrees } from "@/content";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollToTop } from "@/components/motion/ScrollToTop";

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
const description = `${profile.role} working on distributed systems, real-time backends, AWS cloud engineering and applied LLM systems. Three years and nine months at Capgemini, now completing an MS in Computer Science at Northeastern University.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name}, ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "software engineer",
    "distributed systems",
    "real-time systems",
    "AWS",
    "Raft consensus",
    "RAG",
    "LangChain",
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
  name: profile.fullName,
  alternateName: profile.name,
  jobTitle: profile.role,
  homeLocation: { "@type": "Place", name: profile.location },
  knowsLanguage: profile.spokenLanguages,
  description,
  email: `mailto:${profile.emails.personal}`,
  url: siteUrl,
  alumniOf: degrees.map((degree) => ({
    "@type": "CollegeOrUniversity",
    name: degree.institution,
  })),
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
        <ScrollToTop />
        <script
          type="application/ld+json"
          // Serialised from a local object literal, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
