import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elite Marketing Strategy Roadmap | Performance Agency Gurgaon & India | First Option",
  description: "Download the First Option Agency growth roadmap. Master performance marketing, high-conversion sales funnels, and ROI-driven lead generation for Doctors, Manufacturing, and IT.",
  keywords: "Best Marketing Agency Gurgaon, ROI Marketing Delhi NCR, Lead Generation for Doctors India, Manufacturing Marketing Agency, IT SaaS Growth Agency, Performance Marketing Gurgaon, Sales Funnel Optimization India",
  openGraph: {
    title: "First Option Agency - Strategy Roadmap for High-Growth Businesses",
    description: "Architecting high-performance client acquisition systems. View our strategic roadmap to $10M+ scaling.",
    images: ["/brochure/broucher.webp"],
  },
};

export default function BrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
