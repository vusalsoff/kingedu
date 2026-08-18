"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, User, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import "./Navbar.css";

export default function Navbar({ settings = {} }) {
  const { user, setAuthModalOpen } = useAuth();
  const volunteerUrl = settings.volunteerLink || "https://docs.google.com/forms/d/e/1FAIpQLSdDQuU3BxPv3C1t_ELe3va9Xr2-li11ZgFrzoBAWXVhLmHYvw/viewform?usp=header";
  const showVolunteer = settings.volunteerLink_show !== false;

  const menuItems = [
    { name: "Ana Səhifə", path: "/" },
    { name: "Haqqımızda", path: "/haqqimizda" },
    { name: "Rəhbərlik", path: "/rehberlik" },
    { name: "Kurslar", path: "/kurslar" },
    { name: "Təlimlər", path: "/telimler" },
    { name: "Marafonlar", path: "/marafonlar" },
    ...(showVolunteer ? [{ name: "Könüllülük", path: volunteerUrl }] : []),
    { name: "Premium Üzv Ol", path: "/premium" },
    { name: "Kitablar", path: "/pdf-kitablar" },
    { name: "Sənəd Yoxlama", path: "/sened-yoxlama" },
    { name: "Məzunlar", path: "/mezunlar" },
    { name: "AI Şahzadə", path: "/ai-sahzade" },
    { name: "Sosial Media", path: "/sosial-media" },
    { name: "Bizimlə Əlaqə", path: `https://api.whatsapp.com/send/?phone=${(settings.phone || "+994103790874").replace(/[^0-9]/g, "")}&text&type=phone_number&app_absent=0` },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = menuItems.slice(0, 6);
  const moreNavItems = menuItems.slice(6);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        <Link href="/" className="logo-wrapper" style={{ textDecoration: 'none' }}>
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.8 }}
            whileHover={{ scale: 1.05, filter: "drop-shadow(0 0 12px rgba(99, 102, 241, 0.5))" }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
              <img src="/img/Icon.jpeg" alt="King Education Company" className="logo-img" style={{ borderRadius: '10px', height: '42px', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
            </div>
            <span className="logo-text" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              King <span className="text-gradient">Education Company</span>
            </span>
          </motion.div>
        </Link>

        <nav className="desktop-nav">
          <ul className="nav-list">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.path} 
                    className={`nav-link ${isActive ? "active" : ""}`}
                    target={item.path.startsWith("http") ? "_blank" : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
            {moreNavItems.length > 0 && (
              <li className="dropdown-wrapper">
                <span className="nav-link dropdown-toggle">Daha çox ▾</span>
                <ul className="dropdown-menu">
                  {moreNavItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.name}>
                          <Link 
                            href={item.path} 
                            className={`dropdown-link ${isActive ? "active" : ""}`}
                            target={item.path.startsWith("http") ? "_blank" : undefined}
                          >
                            {item.name}
                          </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            )}
          </ul>
        </nav>

        <div className="navbar-actions">
          {mounted && (
            <button 
              className="action-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {mounted && (
            <button 
              className="auth-btn-nav"
              onClick={() => (user && !user.isAdmin) ? (window.location.href = "/kabinet") : setAuthModalOpen(true)}
            >
              <User size={18} />
              <span className="auth-btn-text">{(user && !user.isAdmin) ? "Hesabım" : "Daxil ol"}</span>
            </button>
          )}

          <button 
            className="mobile-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name}>
                  <Link 
                    href={item.path} 
                    className={`mobile-nav-link ${isActive ? "active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                    target={item.path.startsWith("http") ? "_blank" : undefined}
                  >
                    {item.name}
                  </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
