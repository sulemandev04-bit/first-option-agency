import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "First Option Agency | Smart Funnels That Drive Customers",
  description:
    "We build systems that turn enquiries into paying clients. Predictable growth, serious inquiries, and real revenue for Doctors, Manufacturers, and IT Companies.",
  keywords:
    "marketing agency, sales funnels, lead generation, conversion rate optimization, ROI marketing, performance marketing, First Option Agency",
  authors: [{ name: "First Option Agency" }],
  openGraph: {
    title: "First Option Agency | Modern Performance Marketing & Scalable Acquisition Systems",
    description: "Empowering Doctors, Manufacturers, and IT Companies with high-conversion marketing funnels and ROI-driven ad strategies.",
    url: "https://firstoptionagency.com",
    siteName: "First Option Agency",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "First Option Agency - Performance Marketing",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Option Agency | Smart Funnels That Drive Customers",
    description: "We build systems that turn enquiries into paying clients.",
    images: ["/og-image.webp"],
  },
  icons: {
    icon: "/meta-logo.webp",
    shortcut: "/meta-logo.webp",
    apple: "/meta-logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
