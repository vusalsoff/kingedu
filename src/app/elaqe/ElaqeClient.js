"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function Page() {
  return (
    <div className="container" style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <motion.div
        animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{ marginBottom: '1.5rem' }}
      >
        <Clock size={80} color="var(--primary)" style={{ filter: 'drop-shadow(0 8px 15px rgba(255,107,0,0.3))' }} />
      </motion.div>
      <div className="typewriter-container" style={{ marginBottom: '1rem', height: '4rem', display: 'flex', alignItems: 'center' }}>
        <h1 
          className="page-title text-gradient typewriter-text" 
          style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, paddingRight: '5px' }}
        >
          Tezliklə
        </h1>
      </div>
      <motion.p 
        className="lead-text" 
        style={{ maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Bu səhifə hazırda hazırlanır və yaxın zamanda istifadənizə veriləcək. Səbriniz üçün təşəkkür edirik!
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link href="/" style={{ display: 'inline-block', padding: '1rem 2.5rem', background: 'var(--primary)', color: 'white', borderRadius: '50px', fontWeight: 'bold', textDecoration: 'none', transition: 'all 0.3s ease', fontSize: '1.1rem' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(255,107,0,0.4)'; e.currentTarget.style.background = 'var(--primary-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'var(--primary)'; }}
        >
          Ana Səhifəyə Qayıt
        </Link>
      </motion.div>
    </div>
  );
}
