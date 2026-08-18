import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaLinkedin, FaFacebook, FaTelegram } from "react-icons/fa";
import "./Footer.css";

export default function Footer({ settings = {} }) {
  return (
    <footer className="footer glass-panel" style={{ marginTop: "4rem", borderTop: "1px solid var(--border-color)" }}>
      <div className="container footer-container">
        <div className="footer-grid">
          {/* About */}
          <div className="footer-section brand-section">
            <Link href="/" className="footer-logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', textDecoration: 'none' }}>
              <img src="/img/Icon.jpeg" alt="King Education Company" className="logo-img" style={{ borderRadius: '8px', height: '40px', width: 'auto' }} />
              <h3 className="footer-logo" style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>
                King <span className="text-gradient">Education Company</span>
              </h3>
            </Link>
            <p className="footer-desc" style={{ color: "var(--text-secondary)", lineHeight: '1.6' }}>
              {settings.footer_description_text || "Peşəkar, premium və sürətli təhsil platforması. Biz tamamilə onlayn fəaliyyət göstəririk və gələcəyinizi bizimlə qurmağa dəvət edirik."}
            </p>
          </div>

          {/* Links */}
          <div className="footer-section">
            <h4 className="footer-title">Şirkət</h4>
            <ul className="footer-links">
              <li><Link href="/">Ana Səhifə</Link></li>
              <li><Link href="/haqqimizda">Haqqımızda</Link></li>
              <li><Link href="/rehberlik">Rəhbərlik</Link></li>
              <li><Link href="/kurslar">Kurslar</Link></li>
              <li><Link href="/sened-yoxlama">Sənəd Yoxlama</Link></li>
              <li><Link href="/mezunlar">Məzunlar</Link></li>
              {settings.volunteerLink && settings.volunteerLink_show !== false && (
                <li><Link href={settings.volunteerLink} target="_blank">Könüllülük</Link></li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Əlaqə & Dəstək</h4>
            <ul className="footer-contact">
              {String(settings.phone_show) !== "false" && (
                <li><a href={`tel:${settings.phone || "+994103790874"}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> {settings.phone || "+994 10 379 08 74"}</a></li>
              )}
              {String(settings.email_show) !== "false" && (
                <li><a href={`mailto:${settings.email || "info@kingeducation.az"}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> {settings.email || "info@kingeducation.az"}</a></li>
              )}
              {String(settings.whatsapp_contact_show) !== "false" && (
                <li><a href={settings.whatsapp_contact || `https://api.whatsapp.com/send/?phone=${(settings.phone || "994103790874").replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MessageCircle size={16} /> WhatsApp Dəstək</a></li>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Sosial Media</h4>
            <div className="social-links-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {String(settings.instagram_show) !== "false" && (
                <a href={settings.instagram || "https://www.instagram.com/king.edu.az"} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaInstagram size={16} /> Instagram</a>
              )}
              {String(settings.tiktok_show) !== "false" && (
                <a href={settings.tiktok || "https://www.tiktok.com/@king.edu.az"} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaTiktok size={16} /> TikTok</a>
              )}
              {String(settings.facebook_show) !== "false" && (
                <a href={settings.facebook || "https://www.facebook.com/profile.php?id=61591124085845"} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaFacebook size={16} /> Facebook</a>
              )}
              {String(settings.telegram_show) !== "false" && (
                <a href={settings.telegram || "https://t.me/+XokLJzABCDE3NWQy"} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaTelegram size={16} /> Telegram</a>
              )}
              {String(settings.linkedin_show) !== "false" && (
                <a href={settings.linkedin || "https://www.linkedin.com/in/king-education-company-mmc-528162415"} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaLinkedin size={16} /> LinkedIn</a>
              )}
            </div>
            <Link href="/sosial-media" className="see-all-social" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>Bütün kanallar &rarr;</Link>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", marginTop: "2rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {settings.footer_copyright_text || "King Education Company MMC - 2026 bütün Hüquqlar qorunur"}
          </p>
          <div className="footer-legal" style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Məxfilik Siyasəti</Link>
            <Link href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>İstifadə Şərtləri</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
