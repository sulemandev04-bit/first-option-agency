"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { Service } from "@/app/constants/services";

interface ServiceDetailContentProps {
  service: Service;
}

export default function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Zap;

  return (
    <div className="container-main" style={{ maxWidth: 1100 }}>
      {/* Breadcrumb */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: 32 }}
      >
        <Link href="/services" style={{ color: "#6B7280", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <LucideIcons.ArrowLeft size={16} />
          Return to Solutions
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: "#FFFFFF", borderRadius: 32, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB" }}
      >
        {/* Header Area */}
        <div style={{ padding: "clamp(32px, 6vw, 80px)", borderBottom: "1px solid #F3F4F6", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7C3AED", padding: "8px 16px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {service.tag}
            </div>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#D1D5DB" }} />
            <span style={{ fontSize: "0.85rem", color: "#6B7280", fontWeight: 600 }}>Performance Suite</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#111827", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 28, maxWidth: 800 }}>
            {service.title}
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 2vw, 1.25rem)", color: "#4B5563", lineHeight: 1.6, maxWidth: 850, fontWeight: 500 }}>
            {service.fullDesc}
          </p>
        </div>

        {/* Strategic Visualization (Uncropped) */}
        {service.secondaryImage && (
          <div style={{ padding: "clamp(24px, 5vw, 60px)", background: "#F9FAFB" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
               <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Strategic Architecture</h2>
               <p style={{ color: "#6B7280", fontSize: "0.95rem" }}>Deep dive into our implementation methodology</p>
            </div>
            <div style={{ 
              position: "relative", 
              width: "100%", 
              minHeight: "400px", 
              maxHeight: "800px",
              borderRadius: 24, 
              overflow: "hidden", 
              background: "#FFFFFF",
              border: "1px solid #E5E7EB", 
              boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Image 
                src={service.secondaryImage} 
                alt={`${service.title} strategy workflow for global business growth - ${service.mainKeyword}`}
                width={1600}
                height={900}
                style={{ width: "100%", height: "auto", objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }} 
                priority
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(30px, 5vw, 60px)", padding: "clamp(24px, 5vw, 80px)" }}>
          {/* Left: Benefits & Focus */}
          <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", marginBottom: 24, letterSpacing: "-0.02em" }}>Operational Excellence</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {service.benefits.map((benefit: string, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 16, background: "#F9FAFB", padding: "16px 20px", borderRadius: 16, border: "1px solid #F3F4F6" }}
                >
                  <div style={{ background: "#7C3AED", color: "white", padding: 6, borderRadius: 8, display: "flex", flexShrink: 0 }}>
                    <LucideIcons.Check size={16} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: "1.05rem", color: "#374151", fontWeight: 600, lineHeight: 1.4 }}>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Core Visualization & Engagement */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div style={{ 
              position: "relative", 
              width: "100%", 
              borderRadius: 24, 
              overflow: "hidden", 
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              padding: 2,
              boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
            }}>
              <Image 
                src={service.image} 
                alt={`${service.title} implementation - ${service.mainKeyword}`} 
                width={800}
                height={500}
                style={{ width: "100%", height: "auto", objectFit: "contain", borderRadius: 22 }} 
              />
            </div>

            <div style={{ 
              background: "linear-gradient(135deg, #1E1B4B 0%, #4C1D95 100%)", 
              borderRadius: 24, 
              padding: "clamp(24px, 4vw, 40px) clamp(20px, 3.5vw, 32px)", 
              color: "#FFFFFF",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative element */}
              <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              
              <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <IconComponent size={28} color="#FFFFFF" />
              </div>
              <h4 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 12, lineHeight: 1.2 }}>Scale your {service.tag.toLowerCase()} performance?</h4>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", marginBottom: 32, lineHeight: 1.6 }}>
                Architect a predictable growth engine with our result-first methodology. Secure your growth audit today.
              </p>
              <button className="glow-btn-primary" style={{ width: "100%", padding: "18px", borderRadius: 16, border: "none", color: "#FFFFFF", fontWeight: 800, cursor: "pointer", fontSize: "1rem", letterSpacing: "0.02em" }}>
                BOOK A FREE GROWTH AUDIT
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
