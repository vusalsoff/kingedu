"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import GlobalLoader from "@/components/ui/GlobalLoader";

export default function VolunteerPage() {
  const [settings, setSettings] = useState({
    volunteerLink: "https://docs.google.com/forms/d/e/1FAIpQLSdDQuU3BxPv3C1t_ELe3va9Xr2-li11ZgFrzoBAWXVhLmHYvw/viewform?usp=header",
    volunteerLink_show: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_all" })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.settings) {
          setSettings(prev => ({ ...prev, ...res.data.settings }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isAvailable = settings.volunteerLink && settings.volunteerLink_show !== false;

  return (
    <>
      {loading && <GlobalLoader />}
      {!loading && (
        <div className="container" style={{ paddingTop: '150px', paddingBottom: '80px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {isAvailable ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel"
          style={{ maxWidth: '800px', width: '100%', padding: '3.5rem 2.5rem', borderRadius: '30px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(255, 107, 0, 0.15)', background: 'var(--bg-alt)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(255, 107, 0, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--primary)' }}
          >
            <HeartHandshake size={64} />
          </motion.div>

          <h1 className="page-title text-gradient" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
            KİNG Education Könüllülük Proqramı
          </h1>
          
          <p className="lead-text" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Gələcəyin liderləri arasına qatılmaq, komanda işi təcrübəsi qazanmaq, peşəkar mühitdə inkişaf etmək və cəmiyyətə fayda vermək istəyirsinizsə, könüllülük proqramımıza qoşulun!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem', textAlign: 'left' }}>
            <div style={{ padding: '1.2rem', background: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 700, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} /> Təcrübə Qazan
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Real layihələrdə işləyərək peşəkar biliklər əldə edin.</p>
            </div>

            <div style={{ padding: '1.2rem', background: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 700, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} /> Sertifikat & Referans
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Proqramı uğurla başa vuranlara rəsmi sertifikat və tövsiyə məktubu verilir.</p>
            </div>

            <div style={{ padding: '1.2rem', background: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: 700, marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} /> Netvorkinq
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>Uğurlu gənclər və peşəkar mentorlarla tanışlıq fürsəti.</p>
            </div>
          </div>

          <a 
            href={settings.volunteerLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-glow"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '1.2rem 3rem', background: 'var(--primary)', color: 'white', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.3s ease', fontSize: '1.15rem', boxShadow: '0 10px 25px rgba(255,107,0,0.3)' }}
          >
            Könüllülük Formunu Doldur & Müraciət Et <ArrowRight size={20} />
          </a>
        </motion.div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            style={{ marginBottom: '1.5rem' }}
          >
            <Clock size={80} color="var(--primary)" style={{ filter: 'drop-shadow(0 8px 15px rgba(255,107,0,0.3))' }} />
          </motion.div>
          <h1 className="page-title text-gradient" style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
            Tezliklə Yenilənir
          </h1>
          <p className="lead-text" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            Könüllülük proqramı üçün müraciət formu hazırda yenilənir və yaxın zamanda istifadənizə veriləcək. Səbriniz üçün təşəkkür edirik!
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '1rem 2.5rem', background: 'var(--primary)', color: 'white', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none' }}>
            Ana Səhifəyə Qayıt
          </Link>
        </div>
          )}
        </div>
      )}
    </>
  );
}
