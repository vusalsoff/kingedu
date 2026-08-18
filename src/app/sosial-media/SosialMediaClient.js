"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaLinkedin, FaFacebook, FaTelegram, FaHandsHelping } from "react-icons/fa";
import "./sosial-media.css";

export default function SosialMediaPage() {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_specific", sheetName: "social" })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setSocialLinks(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const IconMap = {
    FaInstagram, FaWhatsapp, FaTiktok, FaYoutube, FaLinkedin, FaFacebook, FaTelegram, FaHandsHelping
  };

  return (
    <div className="page-wrapper container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      {/* Spacer div to push content below the fixed Navbar, avoiding global padding !important overrides */}
      <div style={{ height: "150px", width: "100%", flexShrink: 0 }}></div>
      
      <section id="socialSection" className="page-section">
        <div className="section-wrapper">
          <motion.div 
            className="logo-container" 
            style={{ display: 'flex', justifyContent: "center", marginBottom: "20px" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <img 
              src="/img/Icon.jpeg" 
              alt="Logo" 
              style={{ borderRadius: "20px", border: "3px solid white", boxShadow: "var(--shadow-md)", height: '80px', width: 'auto' }} 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="section-title text-gradient" style={{ textAlign: 'center', marginBottom: '10px' }}>🌐 Bizim Sosial Media və Kanallarımız</h1>
            <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-secondary)' }}>
              Bizi rəsmi sosial şəbəkələrdən izləyin və aktiv layihələrimizə qoşulun
            </p>
          </motion.div>

          <motion.div 
            className="social-buttons-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {socialLinks.filter(s => s.visible !== false && s.visible !== "false").map((social, idx) => {
              const IconComp = IconMap[social.icon] || IconMap['FaInstagram'];
              return (
                <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="social-link-btn">
                  <IconComp size={20} style={{marginRight: '8px'}} /> {social.title}
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
