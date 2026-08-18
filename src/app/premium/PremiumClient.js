"use client";

import { motion } from "framer-motion";
import { Crown, CheckCircle2, ArrowRight, Star, Calendar } from "lucide-react";
import Image from "next/image";
import Typewriter from "typewriter-effect";

export default function PremiumClient({ settings }) {
  const phone = settings?.premium_whatsapp || "+994103790874";
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  
  let packages = [];
  try {
    if (settings?.premium_packages_data) {
      packages = JSON.parse(settings.premium_packages_data);
    }
  } catch (e) {
    console.error("Error parsing premium packages", e);
  }

  if (!packages || packages.length === 0) {
    packages = [
      { 
        id: 1, 
        months: 1, 
        title: "1 Aylıq Paket", 
        price: settings?.premium_price_1 || "17.99",
        popular: false,
        features: ["Bütün dərslərə giriş", "Aylıq sınaqlar", "Telegram dəstək qrupu"]
      },
      { 
        id: 3, 
        months: 3, 
        title: "3 Aylıq Paket", 
        price: settings?.premium_price_3 || "27.99",
        popular: true,
        features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Həftəlik canlı sual-cavab"]
      },
      { 
        id: 6, 
        months: 6, 
        title: "6 Aylıq Paket", 
        price: settings?.premium_price_6 || "59.99",
        popular: false,
        features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Fərdi mentorluq sessiyası (1 dəfə)"]
      },
      { 
        id: 12, 
        months: 12, 
        title: "1 İllik Paket", 
        price: settings?.premium_price_12 || "111.99",
        popular: false,
        features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Fərdi mentorluq (Hər ay)", "Pulsuz təlim və marafonlar"]
      }
    ];
  }

  const handleSelect = (pkg) => {
    const text = encodeURIComponent(`Salam, mən Premium ${pkg.title} ilə maraqlanıram.`);
    window.open(`https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${text}&type=phone_number&app_absent=0`, "_blank");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px", background: "transparent", position: "relative", overflow: "hidden" }}>
      
      {/* Background Decor */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.15) 0%, rgba(0,0,0,0) 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.1) 0%, rgba(0,0,0,0) 70%)", zIndex: 0, pointerEvents: "none" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, duration: 1 }}
            style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #FF6B00, #ff8c3a)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "#fff", boxShadow: "0 10px 30px rgba(255,107,0,0.4)" }}
          >
            <Crown size={40} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "3rem", fontWeight: 900, marginBottom: "1rem", color: "var(--text-main)", letterSpacing: "-0.03em" }}
          >
            Öz Potensialınızı <span style={{ color: "#FF6B00", display: "inline-block" }}>
              <Typewriter
                options={{
                  strings: ['Premium', 'Eksklüziv', 'VIP'],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                  cursor: "|"
                }}
              />
            </span> ilə Kəşf Edin
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: "1.1rem", opacity: 0.7, maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}
          >
            King Education-ın eksklüziv təlimləri, marafonları və xüsusi resurslarından faydalanmaq üçün premium ailəmizə qoşulun.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "stretch" }}
        >
          {packages.map((pkg, index) => (
            <motion.div 
              key={pkg.id}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{
                background: "var(--bg-alt)",
                border: pkg.popular ? "2px solid #FF6B00" : "1px solid var(--border-color)",
                borderRadius: "24px",
                padding: "2.5rem 2rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                boxShadow: pkg.popular ? "0 20px 40px rgba(255,107,0,0.15)" : "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              {pkg.popular && (
                <div style={{ position: "absolute", top: "-0.8rem", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #FF6B00, #ff8c3a)", color: "#fff", padding: "0.4rem 1.25rem", borderRadius: "100px", fontWeight: 800, fontSize: "0.75rem", boxShadow: "0 4px 10px rgba(255,107,0,0.3)", zIndex: 10, whiteSpace: "nowrap" }}>
                  ƏN ÇOX SEÇİLƏN
                </div>
              )}
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: pkg.popular ? "rgba(255,107,0,0.15)" : "var(--bg-color)", display: "flex", alignItems: "center", justifyContent: "center", color: pkg.popular ? "#FF6B00" : "var(--text-main)", flexShrink: 0 }}>
                  {index === 3 || pkg.title.toLowerCase().includes('illik') ? <Crown size={24} /> : pkg.popular ? <Star size={24} /> : <Calendar size={24} />}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-main)", lineHeight: 1.2 }}>{pkg.title}</h3>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "3rem", fontWeight: 900, color: "var(--text-main)", lineHeight: 1 }}>{pkg.price}</span>
                <span style={{ fontSize: "1rem", opacity: 0.6, fontWeight: 600 }}> AZN</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                {pkg.features.map((feature, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.95rem", opacity: 0.8, lineHeight: 1.4 }}>
                    <CheckCircle2 size={18} style={{ color: pkg.popular ? "#FF6B00" : "#10b981", flexShrink: 0, marginTop: "2px" }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(pkg)}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "none",
                  background: pkg.popular ? "linear-gradient(135deg, #FF6B00, #ff8c3a)" : "var(--bg-color)",
                  color: pkg.popular ? "#fff" : "var(--text-main)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.3s",
                  boxShadow: pkg.popular ? "0 8px 20px rgba(255,107,0,0.3)" : "none",
                }}
                onMouseOver={(e) => { 
                  if (!pkg.popular) {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseOut={(e) => { 
                  if (!pkg.popular) {
                    e.currentTarget.style.background = "var(--bg-color)";
                    e.currentTarget.style.color = "var(--text-main)";
                  }
                }}
              >
                Abunə Ol <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
