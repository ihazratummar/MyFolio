import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hazratdev.top"),
  title: "Hazrat Ummar Shaikh | Native Android & Backend Developer",
  description: "Portfolio of Hazrat Ummar Shaikh, an expert Native Android App Developer, Backend Developer, and Discord Bot Developer from India. Specializing in Kotlin, FastAPI, KTOR, and MongoDB.",
  keywords: [
    "Hazrat Ummar Shaikh",
    "Hazrat Ummar",
    "Hazrat",
    "Android App Developer",
    "Android Developer",
    "Mobile App Developer",
    "Discord Bot Developer",
    "Indian Developer",
    "Native Android Developer",
    "Backend Developer",
    "Discord Bot Developer",
    "Next.js Developer",
    "React Native Developer",
    "Kotlin Developer",
    "Portfolio",
    "Web Developer",
    "Software Engineer"
  ],
  authors: [{ name: "Hazrat Ummar Shaikh", url: "https://hazrat.dev" }],
  creator: "Hazrat Ummar Shaikh",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hazrat.dev",
    title: "Hazrat Ummar Shaikh | Native Android & Backend Developer",
    description: "Portfolio of Hazrat Ummar Shaikh, an expert Native Android App Developer, Backend Developer, and Discord Bot Developer from India.",
    siteName: "Hazrat Ummar Shaikh Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Hazrat Ummar Shaikh Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hazrat Ummar Shaikh | Native Android & Backend Developer",
    description: "Portfolio of Hazrat Ummar Shaikh, an expert Native Android App Developer, Backend Developer, and Discord Bot Developer from India.",
    images: ["/logo.png"],
    creator: "@ihazratummar9",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Replace with your code
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hazrat Ummar Shaikh",
  url: "https://hazratdev.top",
  sameAs: [
    "https://github.com/ihazratummar",
    "https://www.linkedin.com/in/hazrat-ummar-shaikh/",
    "https://x.com/ihazratummar9",
    "https://www.instagram.com/hazratummar/"
  ],
  jobTitle: "Native Android & Backend Developer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          outfit.variable
        )}
      >
        <GoogleAnalytics gaId="G-CGMGGSKEBE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
