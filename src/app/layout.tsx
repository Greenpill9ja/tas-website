import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import SunCursor from "@/components/SunCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techandsun.com"),
  title: "Tech & Sun (TAS) — Empowering Builders and Communities",
  description: "TAS builds dependable solar-powered hubs that give students, builders, and local communities in Nigeria steady access to electricity and internet.",
  alternates: {
    canonical: "https://techandsun.com",
  },
  openGraph: {
    type: "website",
    siteName: "Tech & Sun",
    title: "Tech & Sun — Empowering Builders and Communities",
    description: "TAS builds dependable solar-powered hubs that give students, builders, and local communities in Nigeria steady access to electricity and internet.",
    url: "https://techandsun.com",
    images: [{ url: "/og-image.png?v=20260405", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@techandsunhub",
    creator: "@techandsunhub",
    title: "Tech & Sun — Empowering Builders and Communities",
    description: "TAS builds dependable solar-powered hubs that give students, builders, and local communities in Nigeria steady access to electricity and internet.",
    images: ["/og-image.png?v=20260405"],
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tech & Sun (TAS)",
              url: "https://techandsun.com",
              logo: "https://techandsun.com/Tas Logo-green.png",
              description: "TAS builds dependable solar-powered hubs that give students, builders, and local communities in Nigeria steady access to electricity and internet.",
              sameAs: [
                "https://x.com/techandsunhub",
                "https://github.com/Greenpill9ja",
                "https://linkedin.com",
                "https://youtube.com",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} bg-gradient-to-b from-white to-vibrant min-h-screen text-dark font-body antialiased`}
      >
        <SmoothScroll>
          <SunCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
